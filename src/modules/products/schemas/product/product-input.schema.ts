import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

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
