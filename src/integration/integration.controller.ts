import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IntegrationService } from './integration.service';
import { BouquetEstimateDto } from './dto/bouquet-estimate.dto';

@ApiTags('Интеграция')
@Controller('integration')
export class IntegrationController {
  constructor(private readonly integration: IntegrationService) {}

  @ApiOperation({
    summary: 'Статус платформы, своего API и API одногруппника',
    description:
      'Делает HTTP-запросы к своему /api/health и к /health API одногруппника; возвращает сводку и ошибки.',
  })
  @ApiOkResponse({ description: 'Сводный статус' })
  @Get('status')
  async status(@Headers('x-forwarded-proto') proto?: string, @Headers('host') host?: string) {
    const scheme = proto || 'http';
    const baseUrl = process.env.PUBLIC_BASE_URL
      ? process.env.PUBLIC_BASE_URL.replace(/\/$/, '')
      : host
        ? `${scheme}://${host}`
        : 'http://localhost:3000';
    return this.integration.status(baseUrl);
  }

  @ApiOperation({
    summary: 'Смета заказа + интеграция с API одногруппника',
    description:
      'Считает стоимость букета и доставки (демо), затем пытается получить /api/products одногруппника и подобрать рекомендацию.',
  })
  @ApiBody({ type: BouquetEstimateDto })
  @ApiOkResponse({ description: 'Смета и результат интеграции' })
  @Post('bouquet-estimate')
  async bouquetEstimate(@Body() body: BouquetEstimateDto) {
    return this.integration.bouquetEstimate(body?.orderBody);
  }
}

