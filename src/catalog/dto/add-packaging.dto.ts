import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AddPackagingDto {
  @ApiPropertyOptional({ example: 'p10', description: 'Если не задан — будет сгенерирован' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Лён + шпагат' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 190, minimum: 0 })
  @IsInt()
  @Min(0)
  price!: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive!: boolean;
}

