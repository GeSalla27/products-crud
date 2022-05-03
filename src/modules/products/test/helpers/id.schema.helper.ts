import { plainToClass } from "@nestjs/class-transformer";
import { IdSchema } from "../../schemas/id-schema";

export class IdSchemaHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      id: "4d13575f-64a1-4fd4-b96b-19a6e354388a",
    };
  }

  static createClass(): IdSchema {
    return plainToClass(IdSchema, IdSchemaHelper.createPlain());
  }
}
