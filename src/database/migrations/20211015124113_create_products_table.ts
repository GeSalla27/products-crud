import { Knex } from "knex";
import { PRODUCT_TABLE } from "../../constants";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    PRODUCT_TABLE,
    (table: Knex.CreateTableBuilder) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.integer("code").notNullable();
      table.text("name").notNullable();
      table.decimal("price").notNullable();
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(PRODUCT_TABLE);
}
