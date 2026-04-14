import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderLineDto {
  @ApiProperty({ example: 'f1' })
  @IsString()
  flowerId!: string;

  @ApiProperty({ example: 7, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @ApiPropertyOptional({ example: 'e1' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiProperty({ example: 'Геленджик, ул. Примерная, 10' })
  @IsString()
  deliveryAddress!: string;

  @ApiProperty({ example: 'p1' })
  @IsString()
  packagingId!: string;

  @ApiProperty({
    type: [OrderLineDto],
    example: [
      { flowerId: 'f1', quantity: 7 },
      { flowerId: 'f2', quantity: 5 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  lines!: OrderLineDto[];
}
