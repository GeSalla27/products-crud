import { Exclude, Expose } from "@nestjs/class-transformer";
import { IsNumber, IsOptional, IsString } from "@nestjs/class-validator";

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
