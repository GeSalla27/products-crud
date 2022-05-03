import { plainToClass } from "@nestjs/class-transformer";
import { ProductUpdateSchema } from "../../schemas/product/product-update.schema";

export class ProductUpdateSchemaHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      name: "Produto Alterado",
      price: 20,
    };
  }

  static createClass(): ProductUpdateSchema {
    return plainToClass(
      ProductUpdateSchema,
      ProductUpdateSchemaHelper.createPlain()
    );
  }
}
