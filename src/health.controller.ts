import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Информация')
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Проверка работоспособности сервиса' })
  @ApiOkResponse({
    description: 'Сервис доступен',
    schema: {
      example: { status: 'ok', service: 'FlowerShop API', version: '1.0.0' },
    },
  })
  @Get()
  health() {
    return {
      status: 'ok',
      service: 'FlowerShop API',
      version: '1.0.0',
    };
  }
}

