import { Exclude, Expose } from "@nestjs/class-transformer";
import { IsNumber, IsOptional, IsString } from "@nestjs/class-validator";

@Exclude()
export class ProductListQuerySchema {
  @Expose()
  @IsOptional()
  @IsNumber()
  code?: number;

  @Expose()
  @IsOptional()
  @IsString()
  name?: string;
}
