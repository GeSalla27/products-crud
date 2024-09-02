import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from "nest-winston";
import winston from "winston";
import { AppModule } from "./app.module";
import { setupSwagger } from "./config/swagger";
import winstonTransports from "./config/winston/winston.config";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(winstonTransports),
  });
  const logger = app.get<winston.Logger>(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  app.setGlobalPrefix(process.env.BASE_PATH ?? "");
  setupSwagger(app);

  await app.listen(process.env.APP_PORT ?? "3000");
}

bootstrap();
