import { Test } from "@nestjs/testing";
import { assert } from "chai";
import KnexBuilder, { Knex } from "knex";
import { WinstonModule, WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as sinon from "sinon";
import * as winston from "winston";
import { KNEX_TOKEN } from "../../../constants";
import knexConfigs from "../../../database/knexfile";
import { ProductEntity } from "../entities/product.entity";
import { ProductRepository } from "../product.repository";
import { ProductInputSchemaHelper } from "./helpers/product-input.schema.helper";
import { ProductEntityHelper } from "./helpers/product.entity.helper";

describe("Product repository", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matchFields = (actual: any, expected: any): void => {
    assert.equal(actual.id, expected.id);
    assert.equal(actual.code, expected.code);
    assert.equal(actual.name, expected.name);
    assert.isDefined(expected.created_at);
    assert.isDefined(expected.updated_at);
  };

  let productRepository: ProductRepository;
  let knex: Knex;
  const logger = sinon.stub(winston.createLogger());

  beforeAll(async () => {
    knex = KnexBuilder(knexConfigs);
    await knex.migrate.rollback(undefined, true);
    await knex.migrate.latest();
  });

  afterAll(async () => {
    await knex.migrate.rollback(undefined, true);
    await knex.destroy();
  });

  beforeEach(async () => {
    sinon.reset();

    await knex.seed.run();

    const module = await Test.createTestingModule({
      imports: [
        {
          module: WinstonModule,
          providers: [
            {
              provide: WINSTON_MODULE_PROVIDER,
              useValue: logger,
            },
          ],
          exports: [WINSTON_MODULE_PROVIDER],
        },
      ],
      providers: [
        ProductRepository,
        {
          provide: KNEX_TOKEN,
          useValue: knex,
        },
      ],
    }).compile();

    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  afterEach(() => {
    sinon.reset();
  });

  it("Should find all products", async () => {
    const products = await productRepository.find({});

    assert.lengthOf(products, 1);
  });

  it("Should find a product by id", async () => {
    const product = (await productRepository.findOne(
      "4d13575f-64a1-4fd4-b96b-19a6e354388a"
    )) as ProductEntity;

    const productEntity = ProductEntityHelper.createClass();

    matchFields(product, productEntity);
  });

  it("Should find product with filters", async () => {
    const [product] = (await productRepository.find({
      id: "4d13575f-64a1-4fd4-b96b-19a6e354388a",
      code: 1,
      name: "Product",
    })) as ProductEntity[];

    const productEntity = ProductEntityHelper.createClass();

    matchFields(product, productEntity);
  });

  it("Should verify if exists a product with filters", async () => {
    const product = await productRepository.exists({
      id: "4d13575f-64a1-4fd4-b96b-19a6e354388a",
      code: 1,
    });
    assert.isTrue(product);
  });

  it("Should verify if exists a product without filters", async () => {
    const product = await productRepository.exists({});
    assert.isTrue(product);
  });

  it("Should verify if exists a product with id", async () => {
    const product = await productRepository.exists({
      id: "4d13575f-64a1-4fd4-b96b-19a6e354388a",
    });
    assert.isTrue(product);
  });

  it("Should verify if exists a product with name", async () => {
    const product = await productRepository.exists({
      name: "Product",
    });
    assert.isTrue(product);
  });

  it("Should create a product", async () => {
    const product = ProductInputSchemaHelper.createPlain();
    product.name = "New Product";
    const dbProduct = await productRepository.save(product);

    assert.equal(dbProduct.code, product.code);
    assert.equal(dbProduct.name, product.name);
    assert.equal(dbProduct.price, product.price);
  });

  it("Should update a product ", async () => {
    const product = {
      id: "4d13575f-64a1-4fd4-b96b-19a6e354388a",
      name: "New Name",
      price: 20,
    };
    const oldValues = (await productRepository.findOne(
      "4d13575f-64a1-4fd4-b96b-19a6e354388a"
    )) as ProductEntity;

    const newValues = await productRepository.update(product);

    assert.equal(newValues.name, product.name);
    assert.equal(newValues.price, product.price);
    assert.deepEqual(newValues.created_at, oldValues.created_at);
    assert.notEqual(newValues.updated_at, oldValues.updated_at);
  });

  it("Should delete a product by id", async () => {
    await productRepository.delete("4d13575f-64a1-4fd4-b96b-19a6e354388a");

    const product = await productRepository.findOne(
      "4d13575f-64a1-4fd4-b96b-19a6e354388a"
    );

    assert.isUndefined(product);
  });
});
