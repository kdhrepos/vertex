import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

export class Swagger {
	public static swaggerSetup = (app: INestApplication) => {
		const config = new DocumentBuilder()
			.setTitle("Vertex")
			.setDescription("Vertex API Specification")
			.setVersion("1.0")
			.build();

		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup("/swagger", app, document);
	};
}
