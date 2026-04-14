import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class SetFlowerStockDto {
  @ApiProperty({ example: 120, minimum: 0 })
  @IsInt()
  @Min(0)
  stockQuantity!: number;
}

