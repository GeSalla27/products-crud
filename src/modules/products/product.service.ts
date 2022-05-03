import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { ProductEntity } from "./entities/product.entity";
import { ProductRepository } from "./product.repository";
import { ProductInputSchema } from "./schemas/product/product-input.schema";
import { ProductListQuerySchema } from "./schemas/product/product-list-query.schema";
import { ProductFilter } from "./types/product-filter.type";
import { ProductInputType } from "./types/product-input.type";

@Injectable()
export class ProductService {
  constructor(
    private readonly productsRepository: ProductRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async create(productInputSchema: ProductInputSchema): Promise<ProductEntity> {
    this.logger.info("Creating new product");

    const productInputType: ProductInputType = {
      code: productInputSchema.code,
      name: productInputSchema.name,
      price: productInputSchema.price,
    };

    return this.productsRepository.save(productInputType);
  }

  async findOne(id: string): Promise<ProductEntity | null> {
    return this.productsRepository.findOne(id);
  }

  async findOneOrFail(id: string): Promise<ProductEntity> {
    const product = await this.productsRepository.findOne(id);

    if (!product) {
      this.logger.warn("ProductEntity not found");
      throw new NotFoundException("ProductEntity not found");
    }

    return product;
  }

  find(params: ProductListQuerySchema): Promise<ProductEntity[]> {
    const filters: ProductFilter = params;

    this.logger.info("Finding products");

    return this.productsRepository.find(filters);
  }

  async update(
    id: string,
    attrs: Partial<ProductEntity>
  ): Promise<ProductEntity> {
    await this.findOneOrFail(id);
    return this.productsRepository.update({
      ...attrs,
      id,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOneOrFail(id);

    await this.productsRepository.delete(id);
  }
}
