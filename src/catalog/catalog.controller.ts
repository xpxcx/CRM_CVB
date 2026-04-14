import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';

@ApiTags('Каталог')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @ApiOperation({ summary: 'Получить список цветов' })
  @ApiOkResponse({
    description: 'Массив цветов',
    schema: {
      example: [
        {
          id: 'f1',
          name: 'Роза красная',
          unitPrice: 120,
          stockQuantity: 200,
          categoryId: 'c1',
          isActive: true,
        },
      ],
    },
  })
  @Get('flowers')
  getFlowers() {
    return this.catalog.getFlowers();
  }

  @ApiOperation({ summary: 'Получить список упаковок' })
  @ApiOkResponse({
    description: 'Массив вариантов упаковки',
    schema: {
      example: [{ id: 'p1', name: 'Крафт + лента', price: 250, isActive: true }],
    },
  })
  @Get('packaging')
  getPackaging() {
    return this.catalog.getPackaging();
  }
}
