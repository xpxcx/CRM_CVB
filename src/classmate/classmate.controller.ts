import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiBadGatewayResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClassmateService } from './classmate.service';

@ApiTags('Одногруппник (прокси)')
@Controller('classmate')
export class ClassmateController {
  constructor(private readonly classmate: ClassmateService) {}

  @ApiOperation({ summary: 'Прокси: health одногруппника' })
  @ApiOkResponse({
    description: 'Ответ от внешнего API',
    schema: { example: { source: 'classmate', url: 'https://.../health', data: { status: 'ok' } } },
  })
  @ApiBadGatewayResponse({
    description: 'Внешний сервис недоступен',
    schema: { example: { error: 'Upstream 502 Bad Gateway', source: 'classmate', detail: null } },
  })
  @Get('health')
  async health() {
    const url = `${this.classmate.getBaseUrl()}/health`;
    try {
      const data = await this.classmate.fetchJson(url);
      return { source: 'classmate', url, data };
    } catch (e: any) {
      const status = e?.status && e.status < 600 ? e.status : 502;
      return {
        statusCode: status,
        error: e?.message || 'Ошибка внешнего сервиса',
        source: 'classmate',
        detail: e?.body ?? e?.code ?? null,
      };
    }
  }

  @ApiOperation({ summary: 'Прокси: список товаров/объектов из API одногруппника' })
  @ApiOkResponse({
    description: 'Ответ от внешнего API',
    schema: { example: { source: 'classmate', url: 'https://.../api/products', data: [{ id: 1, name: '...', price: 1000 }] } },
  })
  @Get('products')
  async products() {
    const url = `${this.classmate.getBaseUrl()}/api/products`;
    try {
      const data = await this.classmate.fetchJson(url);
      return { source: 'classmate', url, data };
    } catch (e: any) {
      const status = e?.status && e.status < 600 ? e.status : 502;
      return {
        statusCode: status,
        error: e?.message || 'Ошибка внешнего сервиса',
        source: 'classmate',
        detail: e?.body ?? e?.code ?? null,
      };
    }
  }

  @ApiOperation({ summary: 'Прокси: создать товар/объект в API одногруппника' })
  @ApiOkResponse({ description: 'Создано во внешнем API (ответ проксируется как есть)' })
  @ApiBadGatewayResponse({ description: 'Внешний сервис недоступен или вернул ошибку' })
  @HttpCode(201)
  @Post('products')
  async createProduct(@Body() body: any) {
    const url = `${this.classmate.getBaseUrl()}/api/products`;
    try {
      const data = await this.classmate.fetchJson(url, { method: 'POST', body: body ?? {} });
      return { source: 'classmate', url, data };
    } catch (e: any) {
      const status = e?.status && e.status < 600 ? e.status : 502;
      return {
        statusCode: status,
        error: e?.message || 'Ошибка внешнего сервиса',
        source: 'classmate',
        detail: e?.body ?? e?.code ?? null,
      };
    }
  }
}

