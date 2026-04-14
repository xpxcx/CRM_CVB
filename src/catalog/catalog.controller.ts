import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { AddFlowerDto } from './dto/add-flower.dto';
import { AddPackagingDto } from './dto/add-packaging.dto';
import { SetFlowerStockDto } from './dto/set-flower-stock.dto';

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

  @ApiOperation({ summary: 'Добавить цветок' })
  @ApiOkResponse({
    description: 'Добавленный цветок',
    schema: { example: { id: 'f10', name: 'Пион', unitPrice: 180, stockQuantity: 50, categoryId: 'c1', isActive: true } },
  })
  @HttpCode(201)
  @Post('flowers')
  addFlower(@Body() body: AddFlowerDto) {
    return this.catalog.addFlower(body);
  }

  @ApiOperation({ summary: 'Удалить цветок' })
  @ApiOkResponse({ description: 'Удалено' })
  @Delete('flowers/:id')
  deleteFlower(@Param('id') id: string) {
    this.catalog.deleteFlower(id);
    return { ok: true };
  }

  @ApiOperation({ summary: 'Установить остаток (кол-во на складе) для существующего цветка' })
  @ApiOkResponse({
    description: 'Обновлённый цветок',
    schema: { example: { id: 'f1', name: 'Роза красная', unitPrice: 120, stockQuantity: 123, categoryId: 'c1', isActive: true } },
  })
  @Patch('flowers/:id/stock')
  setFlowerStock(@Param('id') id: string, @Body() body: SetFlowerStockDto) {
    return this.catalog.setFlowerStock(id, body.stockQuantity);
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

  @ApiOperation({ summary: 'Добавить упаковку' })
  @ApiOkResponse({
    description: 'Добавленная упаковка',
    schema: { example: { id: 'p10', name: 'Лён + шпагат', price: 190, isActive: true } },
  })
  @HttpCode(201)
  @Post('packaging')
  addPackaging(@Body() body: AddPackagingDto) {
    return this.catalog.addPackaging(body);
  }

  @ApiOperation({ summary: 'Удалить упаковку' })
  @ApiOkResponse({ description: 'Удалено' })
  @Delete('packaging/:id')
  deletePackaging(@Param('id') id: string) {
    this.catalog.deletePackaging(id);
    return { ok: true };
  }
}
