import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

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
