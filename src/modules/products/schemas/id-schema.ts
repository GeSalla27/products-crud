import { IsUUID } from "class-validator";

export class IdSchema {
  @IsUUID(4)
  id: string;
}
