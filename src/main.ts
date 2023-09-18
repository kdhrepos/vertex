import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe} from '@nestjs/common'
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerDocument } from './swagger.document';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Documentation
  SwaggerDocument.swaggerSetup(app);
   
  // app.useGlobalPipes()
  await app.listen(3000);
}
bootstrap();
