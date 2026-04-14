import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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

  @ApiProperty({ example: 'Иван Петров' })
  @IsString()
  employeeName!: string;

  @ApiProperty({ example: true, description: 'Нужно ли оформление (упаковка)' })
  @IsBoolean()
  packagingEnabled!: boolean;

  @ApiPropertyOptional({
    example: 'p1',
    description: 'Идентификатор упаковки (если packagingEnabled = true)',
  })
  @IsOptional()
  @IsString()
  packagingId?: string;

  @ApiProperty({ example: true, description: 'Нужна ли доставка' })
  @IsBoolean()
  deliveryEnabled!: boolean;

  @ApiPropertyOptional({
    example: 'Геленджик, ул. Примерная, 10',
    description: 'Адрес доставки (если deliveryEnabled = true)',
  })
  @IsOptional()
  @IsString()
  deliveryAddress?: string;

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
