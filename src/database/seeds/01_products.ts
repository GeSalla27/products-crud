import { Knex } from "knex";
import { PRODUCT_TABLE } from "../../constants";
import { ProductEntity } from "../../modules/products/entities/product.entity";

export async function seed(knex: Knex): Promise<void> {
  await knex(PRODUCT_TABLE).del();

  await knex<ProductEntity>(PRODUCT_TABLE).insert([
    {
      id: "4d13575f-64a1-4fd4-b96b-19a6e354388a",
      code: 1,
      name: "Product",
      price: 10,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
}
