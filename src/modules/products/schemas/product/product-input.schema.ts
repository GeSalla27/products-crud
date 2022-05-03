import { Exclude, Expose } from "@nestjs/class-transformer";
import { IsNumber, IsString } from "@nestjs/class-validator";

@Exclude()
export class ProductInputSchema {
  @Expose()
  @IsNumber()
  code: number;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsNumber()
  price: number;
}
