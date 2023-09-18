import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { subscriptionProviders } from './subscription.providers';
import { SubscriptionController } from './subscription.controller';

@Module({
  controllers : [SubscriptionController],
  providers: [SubscriptionService,...subscriptionProviders]
})
export class SubscriptionModule {}
