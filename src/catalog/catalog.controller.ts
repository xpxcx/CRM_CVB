import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiBody({ type: AddFlowerDto })
  @ApiCreatedResponse({
    description: 'Цветок создан',
    schema: { example: { id: 'f10', name: 'Пион', unitPrice: 180, stockQuantity: 50, categoryId: 'c1', isActive: true } },
  })
  @ApiConflictResponse({
    description: 'Цветок с таким id уже существует',
    schema: { example: { statusCode: 409, message: 'Цветок с таким id уже существует', error: 'Conflict' } },
  })
  @HttpCode(201)
  @Post('flowers')
  addFlower(@Body() body: AddFlowerDto) {
    return this.catalog.addFlower(body);
  }

  @ApiOperation({ summary: 'Удалить цветок' })
  @ApiParam({ name: 'id', example: 'f1', description: 'Идентификатор цветка' })
  @ApiOkResponse({
    description: 'Удалено',
    schema: { example: { ok: true } },
  })
  @ApiNotFoundResponse({
    description: 'Цветок не найден',
    schema: { example: { statusCode: 404, message: 'Цветок не найден', error: 'Not Found' } },
  })
  @Delete('flowers/:id')
  deleteFlower(@Param('id') id: string) {
    this.catalog.deleteFlower(id);
    return { ok: true };
  }

  @ApiOperation({ summary: 'Установить остаток (кол-во на складе) для существующего цветка' })
  @ApiParam({ name: 'id', example: 'f1', description: 'Идентификатор цветка' })
  @ApiBody({ type: SetFlowerStockDto })
  @ApiOkResponse({
    description: 'Обновлённый цветок',
    schema: { example: { id: 'f1', name: 'Роза красная', unitPrice: 120, stockQuantity: 123, categoryId: 'c1', isActive: true } },
  })
  @ApiNotFoundResponse({
    description: 'Цветок не найден',
    schema: { example: { statusCode: 404, message: 'Цветок не найден', error: 'Not Found' } },
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
  @ApiBody({ type: AddPackagingDto })
  @ApiCreatedResponse({
    description: 'Упаковка создана',
    schema: { example: { id: 'p10', name: 'Лён + шпагат', price: 190, isActive: true } },
  })
  @ApiConflictResponse({
    description: 'Упаковка с таким id уже существует',
    schema: { example: { statusCode: 409, message: 'Упаковка с таким id уже существует', error: 'Conflict' } },
  })
  @HttpCode(201)
  @Post('packaging')
  addPackaging(@Body() body: AddPackagingDto) {
    return this.catalog.addPackaging(body);
  }

  @ApiOperation({ summary: 'Удалить упаковку' })
  @ApiParam({ name: 'id', example: 'p1', description: 'Идентификатор упаковки' })
  @ApiOkResponse({
    description: 'Удалено',
    schema: { example: { ok: true } },
  })
  @ApiNotFoundResponse({
    description: 'Упаковка не найдена',
    schema: { example: { statusCode: 404, message: 'Упаковка не найдена', error: 'Not Found' } },
  })
  @Delete('packaging/:id')
  deletePackaging(@Param('id') id: string) {
    this.catalog.deletePackaging(id);
    return { ok: true };
  }
}
