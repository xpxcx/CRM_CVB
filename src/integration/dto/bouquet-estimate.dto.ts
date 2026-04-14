import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderDto } from '../../orders/dto/create-order.dto';

export class BouquetEstimateDto {
  @ApiProperty({
    description: 'Тело заказа (как для POST /api/orders)',
    type: CreateOrderDto,
  })
  orderBody!: CreateOrderDto;
}

