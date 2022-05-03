import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { assert } from "chai";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as sinon from "sinon";
import * as winston from "winston";
import { ProductRepository } from "../product.repository";
import { ProductService } from "../product.service";
import { ProductInputSchemaHelper } from "./helpers/product-input.schema.helper";
import { ProductUpdateSchemaHelper } from "./helpers/product-update.schema.helper";
import { ProductEntityHelper } from "./helpers/product.entity.helper";

describe("Product service", () => {
  const productRepository = sinon.createStubInstance(ProductRepository);
  const logger = sinon.stub(winston.createLogger());

  let productService: ProductService;

  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: productRepository,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(async () => {
    sinon.reset();
    await module.close();
  });

  describe("When should be finded products", () => {
    it("Should find a product", async () => {
      const product = ProductEntityHelper.createClass();

      productRepository.findOne
        .withArgs(sinon.match(product.id))
        .resolves(product);

      const result = await productService.findOne(product.id);

      assert.deepEqual(result, product);

      sinon.assert.calledOnceWithExactly(
        productRepository.findOne,
        sinon.match(product.id)
      );
    });

    it("Should not find a product and fail with NotFoundException", async () => {
      const product = ProductEntityHelper.createClass();

      productRepository.findOne
        .withArgs(sinon.match(product.id))
        .resolves(undefined);

      try {
        await productService.findOneOrFail(product.id);
      } catch (e) {
        assert.instanceOf(e, NotFoundException);
        sinon.assert.calledOnceWithExactly(
          productRepository.findOne,
          sinon.match(product.id)
        );
        return;
      }

      throw new Error("Expected exception to be thrown, but was not");
    });

    it("Should find all product by name", async () => {
      const product = ProductEntityHelper.createClass();

      productRepository.find
        .withArgs(sinon.match({ name: product.name }))
        .resolves([product]);

      const result = await productService.find({ name: product.name });

      assert.deepEqual(result, [product]);

      sinon.assert.calledOnceWithExactly(
        productRepository.find,
        sinon.match({ name: product.name })
      );
    });
  });

  describe("When should be created products", () => {
    it("Should create a product", async () => {
      const productInputSchema = ProductInputSchemaHelper.createClass();
      const product = ProductEntityHelper.createClass();

      productRepository.save
        .withArgs(sinon.match(productInputSchema))
        .resolves(product);

      const result = await productService.create(productInputSchema);

      assert.deepEqual(result, product);

      sinon.assert.calledOnceWithExactly(
        productRepository.save,
        sinon.match(productInputSchema)
      );
    });
  });

  describe("When should be updated products", () => {
    it("Should update a product", async () => {
      const productUpdateSchema = ProductUpdateSchemaHelper.createClass();
      const product = ProductEntityHelper.createClass();
      productUpdateSchema.name = "Update name";
      const productUpdate = { ...productUpdateSchema, id: product.id };

      productRepository.update
        .withArgs(sinon.match(productUpdate))
        .resolves(product);

      productRepository.findOne
        .withArgs(sinon.match(product.id))
        .resolves(product);

      const result = await productService.update(
        product.id,
        productUpdateSchema
      );

      assert.deepEqual(result, product);

      sinon.assert.calledOnceWithExactly(
        productRepository.update,
        sinon.match(productUpdate)
      );

      sinon.assert.calledOnceWithExactly(
        productRepository.findOne,
        sinon.match(product.id)
      );
    });
  });

  describe("When should be deleted products", () => {
    it("Should delete a product", async () => {
      const product = ProductEntityHelper.createClass();

      productRepository.findOne
        .withArgs(sinon.match(product.id))
        .resolves(product);
      productRepository.delete.withArgs(sinon.match(product.id)).resolves();

      await productService.remove(product.id);

      sinon.assert.calledOnceWithExactly(
        productRepository.delete,
        sinon.match(product.id)
      );
    });
  });
});
