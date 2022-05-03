import { plainToClass } from "@nestjs/class-transformer";
import { ProductInputSchema } from "../../schemas/product/product-input.schema";

export class ProductInputSchemaHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      code: 1,
      name: "Product",
      price: 10,
    };
  }

  static createClass(): ProductInputSchema {
    return plainToClass(
      ProductInputSchema,
      ProductInputSchemaHelper.createPlain()
    );
  }
}
