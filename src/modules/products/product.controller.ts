import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ProductEntity } from "./entities/product.entity";
import { ProductService } from "./product.service";
import { IdSchema } from "./schemas/id-schema";
import { ProductInputSchema } from "./schemas/product/product-input.schema";
import { ProductListQuerySchema } from "./schemas/product/product-list-query.schema";
import { ProductUpdateSchema } from "./schemas/product/product-update.schema";

@Controller("products")
export class ProductsController {
  constructor(private productService: ProductService) {}

  @Post("")
  async createProduct(
    @Body() product: ProductInputSchema
  ): Promise<ProductEntity> {
    return this.productService.create(product);
  }

  @Patch("/:id")
  updateProduct(
    @Param() idSchema: IdSchema,
    @Body() body: ProductUpdateSchema
  ): Promise<ProductEntity> {
    return this.productService.update(idSchema.id, body);
  }

  @Get("/:id")
  findProduct(@Param() idSchema: IdSchema): Promise<ProductEntity | undefined> {
    return this.productService.findOneOrFail(idSchema.id);
  }

  @Get("")
  findProducts(
    @Query() productListQuerySchema: ProductListQuerySchema
  ): Promise<ProductEntity[]> {
    return this.productService.find(productListQuerySchema);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  removeProduct(@Param() idSchema: IdSchema): Promise<void> {
    return this.productService.remove(idSchema.id);
  }
}
