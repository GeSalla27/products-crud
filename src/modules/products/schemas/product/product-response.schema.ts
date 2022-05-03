import { Exclude, Expose } from "@nestjs/class-transformer";

@Exclude()
export class ProductResponseSchema {
  @Expose()
  id: string;

  @Expose()
  code: number;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
