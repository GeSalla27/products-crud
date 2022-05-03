import { plainToClass } from "@nestjs/class-transformer";
import { ProductEntity } from "../../entities/product.entity";

export class ProductEntityHelper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createPlain(): any {
    return {
      id: "4d13575f-64a1-4fd4-b96b-19a6e354388a",
      code: 1,
      name: "Product",
      price: 10,
      created_at: new Date().toUTCString(),
      updated_at: new Date().toUTCString(),
    };
  }

  static createClass(): ProductEntity {
    return plainToClass(ProductEntity, ProductEntityHelper.createPlain());
  }
}
