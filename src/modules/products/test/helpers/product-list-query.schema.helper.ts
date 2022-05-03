import { plainToClass } from "@nestjs/class-transformer";
import { ProductListQuerySchema } from "../../schemas/product/product-list-query.schema";

export class ProductListQuerySchemaHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      name: "Product",
    };
  }

  static createClass(): ProductListQuerySchema {
    return plainToClass(
      ProductListQuerySchema,
      ProductListQuerySchemaHelper.createPlain()
    );
  }
}
