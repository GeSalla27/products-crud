import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  PROJECT_DESCRIPTION,
  PROJECT_NAME,
  PROJECT_VERSION,
} from "../../constants";

/**
 * Default url endpoint for Swagger UI.
 */
const DEFAULT_SWAGGER_PREFIX = "/docs";

export const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(PROJECT_NAME!)
    .setDescription(PROJECT_DESCRIPTION!)
    .setVersion(PROJECT_VERSION!)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const path = process.env.SWAGGER_PREFIX || DEFAULT_SWAGGER_PREFIX;

  SwaggerModule.setup(path, app, document);
};
