import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AddFlowerDto {
  @ApiPropertyOptional({ example: 'f10', description: 'Если не задан — будет сгенерирован' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Пион' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 180, minimum: 0 })
  @IsInt()
  @Min(0)
  unitPrice!: number;

  @ApiProperty({ example: 50, minimum: 0 })
  @IsInt()
  @Min(0)
  stockQuantity!: number;

  @ApiProperty({ example: 'c1' })
  @IsString()
  categoryId!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive!: boolean;
}

