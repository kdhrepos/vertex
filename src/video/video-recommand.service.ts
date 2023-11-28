import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib'

@Injectable()
export class VideoRecommandService {
    private readonly uri = 'amqp://localhost';

    private generateUuid(): string {
        return Math.random().toString() +
            Math.random().toString() +
            Math.random().toString();
    }

    async sendMessage(message: string): Promise<string> {
        console.log(message)

        const connection = await amqp.connect(this.uri);
        const channel = await connection.createChannel();
        const queue = 'my_queue';

        channel.assertQueue(queue, { durable: false });

        const correlationId = this.generateUuid();
        const replyQueue = await channel.assertQueue('', { exclusive: true });
        const replyQueueName = replyQueue.queue;

        // channel.sendToQueue(queue, Buffer.from(message), {
        //   correlationId: correlationId,
        //   replyTo: replyQueueName
        // });
        // console.log(` [x] Sent '${message}'`);

        const res = ['a', 'b', 'c', 'd', 'e', 'f',]
        const resString = JSON.stringify(res);
        channel.sendToQueue(queue, Buffer.from(resString), {
            correlationId: correlationId,
            replyTo: replyQueueName
        });
        console.log(res);

        console.log(` [*] Waiting for messages At Nest. To exit, press Ctrl+C`);
        return new Promise<string>((resolve) => {
            channel.consume(replyQueueName, (msg) => {
                // const data = JSON.parse(msg.content.toString())
                console.log(typeof msg.content.toString())
                console.log(` [*] Received response: '${msg.content.toString()}'`);
                if (msg.properties.correlationId === correlationId) {
                    resolve(msg.content.toString());

                    channel.ack(msg);
                    channel.close();
                    connection.close();
                }
            });
        });
    }
}
