import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

@Exclude()
export class ProductUpdateSchema {
  id: string;

  @Expose()
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  price?: number;
}
