import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('Заказы')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @ApiOperation({ summary: 'Получить список заказов' })
  @ApiOkResponse({
    description: 'Массив заказов',
    schema: {
      example: [
        {
          id: 'UUID',
          employeeId: 'e1',
          deliveryAddress: 'Геленджик, ул. Примерная, 10',
          packagingId: 'p1',
          packagingName: 'Крафт + лента',
          status: 'Подтверждён',
          createdAt: '2026-04-14T00:00:00.000Z',
          lines: [
            {
              flowerId: 'f1',
              flowerName: 'Роза красная',
              quantity: 7,
              unitPriceAtOrder: 120,
              lineSubtotal: 840,
            },
          ],
          bouquetSubtotal: 1265,
          packagingPrice: 250,
          deliveryCost: 300,
          deliveryEta: 'в день заказа',
          total: 1815,
        },
      ],
    },
  })
  @Get()
  list() {
    return this.orders.getAll();
  }

  @ApiOperation({ summary: 'Создать заказ на букет' })
  @ApiCreatedResponse({
    description: 'Заказ создан и рассчитан',
    schema: {
      example: {
        id: 'UUID',
        employeeId: 'e1',
        deliveryAddress: 'Геленджик, ул. Примерная, 10',
        packagingId: 'p1',
        packagingName: 'Крафт + лента',
        status: 'Подтверждён',
        createdAt: '2026-04-14T00:00:00.000Z',
        lines: [
          {
            flowerId: 'f1',
            flowerName: 'Роза красная',
            quantity: 7,
            unitPriceAtOrder: 120,
            lineSubtotal: 840,
          },
          {
            flowerId: 'f2',
            flowerName: 'Хризантема',
            quantity: 5,
            unitPriceAtOrder: 85,
            lineSubtotal: 425,
          },
        ],
        bouquetSubtotal: 1265,
        packagingPrice: 250,
        deliveryCost: 300,
        deliveryEta: 'в день заказа',
        total: 1815,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Некорректные данные или ошибка бизнес-логики',
    schema: {
      example: {
        message: 'Упаковка не найдена: p999',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orders.create(dto);
  }
}
