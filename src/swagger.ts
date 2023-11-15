import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

export function swaggerSetup(app: INestApplication) {
	const config = new DocumentBuilder()
		.addCookieAuth("connect.sid")
		.setTitle("Vertex")
		.setDescription("Vertex API Specification")
		.setVersion("1.0")
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("/swagger", app, document);
}
