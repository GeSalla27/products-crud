import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { KNEX_TOKEN, PRODUCT_TABLE } from "../../constants";
import { ProductEntity } from "./entities/product.entity";
import { ProductUpdateSchema } from "./schemas/product/product-update.schema";
import { ProductFilter } from "./types/product-filter.type";
import { ProductInputType } from "./types/product-input.type";

@Injectable()
export class ProductRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject(KNEX_TOKEN) private readonly knex: Knex) {}

  async exists(filter: ProductFilter): Promise<boolean> {
    const query = this.knex<ProductEntity>(PRODUCT_TABLE).column(
      this.knex.raw("1 as exists")
    );

    if (filter.id) {
      query.where({ id: filter.id });
    }

    if (filter.code) {
      query.where({ code: filter.code });
    }

    const product = await query.first<ProductEntity>();

    return !!product;
  }

  async find(filter: ProductFilter): Promise<ProductEntity[]> {
    const query = this.knex<ProductEntity>(PRODUCT_TABLE);

    if (filter.id) {
      query.where({ id: filter.id });
    }

    if (filter.code) {
      query.where({ code: filter.code });
    }

    if (filter.name) {
      query.where({ name: filter.name });
    }

    return query;
  }

  async findOne(id: string): Promise<ProductEntity | null> {
    const query = this.knex<ProductEntity>(PRODUCT_TABLE)
      .select<ProductEntity>()
      .where({ id });

    return query.first<ProductEntity>();
  }

  async save(values: ProductInputType): Promise<ProductEntity> {
    const [product] = await this.knex<ProductEntity>(PRODUCT_TABLE)
      .insert({
        ...values,
      })
      .returning("*");

    return product;
  }

  async update(values: ProductUpdateSchema): Promise<ProductEntity> {
    const [product] = await this.knex<ProductEntity>(PRODUCT_TABLE)
      .update({
        updated_at: this.knex.fn.now(),
        ...values,
      })
      .where({
        id: values.id,
      })
      .returning("*");

    return product;
  }

  async delete(id: string): Promise<void> {
    await this.knex<ProductEntity>(PRODUCT_TABLE).delete().where({ id });
  }
}
