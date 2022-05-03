import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { assert } from "chai";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as sinon from "sinon";
import * as request from "supertest";
import * as winston from "winston";
import { ProductsController } from "../product.controller";
import { ProductService } from "../product.service";
import { IdSchemaHelper } from "./helpers/id.schema.helper";
import { ProductInputSchemaHelper } from "./helpers/product-input.schema.helper";
import { ProductListQuerySchemaHelper } from "./helpers/product-list-query.schema.helper";
import { ProductUpdateSchemaHelper } from "./helpers/product-update.schema.helper";
import { ProductEntityHelper } from "./helpers/product.entity.helper";

describe("Product controller", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matchFields = (actual: any, expected: any): void => {
    assert.equal(actual.id, expected.id);
    assert.equal(actual.code, expected.code);
    assert.equal(actual.name, expected.name);
    assert.isDefined(expected.created_at);
    assert.isDefined(expected.updated_at);
  };

  const productService = sinon.createStubInstance(ProductService);
  const logger = sinon.stub(winston.createLogger());

  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductService,
          useValue: productService,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: ClassSerializerInterceptor,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    app = module.createNestApplication();

    await app.init();
  });

  afterEach(() => {
    sinon.reset();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("When should be finded products", () => {
    it("Should find product with id", async () => {
      const idSchema = IdSchemaHelper.createClass();

      return request(app.getHttpServer())
        .head(`/products/${idSchema.id}`)
        .then((response) => {
          assert.equal(response.status, HttpStatus.OK);

          sinon.assert.calledOnceWithExactly(
            productService.findOneOrFail,
            idSchema.id
          );
        });
    });

    it("Should find all products", async () => {
      const product = ProductEntityHelper.createClass();
      const expected = [product];

      productService.find.resolves(expected);

      return request(app.getHttpServer())
        .get("/products")
        .then((response) => {
          assert.equal(response.status, HttpStatus.OK);

          const { body } = response;

          assert.isArray(body);
          assert.lengthOf(body, 1);

          const resultProduct = body[0];

          sinon.assert.calledWith(productService.find);

          matchFields(resultProduct, product);
        });
    });

    it("Should find product with filter", async () => {
      const product = ProductEntityHelper.createClass();
      const poductListQuerySchema = ProductListQuerySchemaHelper.createClass();
      const expected = [product];

      productService.find
        .withArgs(sinon.match(poductListQuerySchema))
        .resolves(expected);

      return request(app.getHttpServer())
        .get("/products")
        .query(poductListQuerySchema)
        .then((response) => {
          assert.equal(response.status, HttpStatus.OK);

          const { body } = response;

          assert.isArray(body);
          assert.lengthOf(body, 1);

          const resultProduct = body[0];

          sinon.assert.calledWith(
            productService.find,
            sinon.match(poductListQuerySchema)
          );

          matchFields(resultProduct, product);
        });
    });

    it("Should not retrieve product and throw not found error", async () => {
      const idSchema = IdSchemaHelper.createClass();

      productService.findOneOrFail.throws(new NotFoundException());

      return request(app.getHttpServer())
        .get(`/products/${idSchema.id}`)
        .then((response) => {
          assert.equal(response.status, HttpStatus.NOT_FOUND);
          assert.equal(response.body.statusCode, HttpStatus.NOT_FOUND);
          assert.equal(response.body.message, "Not Found");
          assert.isDefined(response.body.message);

          sinon.assert.calledOnceWithExactly(
            productService.findOneOrFail,
            idSchema.id
          );
        });
    });
  });

  describe("When should be created products", () => {
    it("Should create product", async () => {
      const product = ProductEntityHelper.createClass();
      const productInputSchema = ProductInputSchemaHelper.createClass();

      productService.create.resolves(product);

      return request(app.getHttpServer())
        .post("/products")
        .send(productInputSchema)
        .then((response) => {
          assert.equal(response.status, HttpStatus.CREATED);

          const { body } = response;

          sinon.assert.calledWith(
            productService.create,
            sinon.match(productInputSchema)
          );

          matchFields(body, product);
        });
    });

    it("Should not create product and throw unprocessable entity error", async () => {
      productService.create.throws(new UnprocessableEntityException());

      return request(app.getHttpServer())
        .post("/products")
        .send({})
        .then((response) => {
          assert.equal(response.status, HttpStatus.UNPROCESSABLE_ENTITY);
          assert.equal(
            response.body.statusCode,
            HttpStatus.UNPROCESSABLE_ENTITY
          );
          assert.equal(response.body.message, "Unprocessable Entity");
        });
    });
  });

  describe("When should be updated products", () => {
    it("Should update product", async () => {
      const product = ProductEntityHelper.createClass();
      const idSchema = IdSchemaHelper.createClass();
      const productUpdateSchema = ProductUpdateSchemaHelper.createClass();

      productService.update
        .withArgs(idSchema.id, sinon.match(productUpdateSchema))
        .resolves(product);

      const { status, body } = await request(app.getHttpServer())
        .patch(`/products/${idSchema.id}`)
        .send(productUpdateSchema);

      assert.strictEqual(status, HttpStatus.OK);

      sinon.assert.calledWith(
        productService.update,
        idSchema.id,
        sinon.match(productUpdateSchema)
      );

      matchFields(body, product);
    });
  });

  describe("When should be deleted products", () => {
    it("Should delete product", async () => {
      const idSchema = IdSchemaHelper.createClass();

      productService.remove.resolves();

      return request(app.getHttpServer())
        .delete(`/products/${idSchema.id}`)
        .then((response) => {
          assert.equal(response.status, HttpStatus.NO_CONTENT);
          assert.isObject(response.body);
          assert.isEmpty(response.body);

          sinon.assert.calledOnceWithExactly(
            productService.remove,
            idSchema.id
          );
        });
    });
  });
});
