import { Module } from "@nestjs/common";
import { ProductsController } from "./product.controller";
import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";

@Module({
  imports: [],
  providers: [ProductService, ProductRepository],
  controllers: [ProductsController],
  exports: [ProductService],
})
export class ProductsModule {}
