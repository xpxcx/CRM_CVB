import { BadRequestException, Injectable } from '@nestjs/common';
import { CatalogService } from '../catalog/catalog.service';
import { OrderLineResult } from '../domain/types';
import { OrderLineDto } from './dto/create-order.dto';

export interface BouquetCalc {
  lines: OrderLineResult[];
  bouquetSubtotal: number;
}

@Injectable()
export class BouquetCalculatorService {
  constructor(private readonly catalog: CatalogService) {}

  calculate(lines: OrderLineDto[]): BouquetCalc {
    const result: OrderLineResult[] = [];
    let bouquetSubtotal = 0;

    for (const line of lines) {
      const flower = this.catalog.getFlowerById(line.flowerId);
      if (!flower || !flower.isActive) {
        throw new BadRequestException(`Цветок не найден: ${line.flowerId}`);
      }
      if (line.quantity > flower.stockQuantity) {
        throw new BadRequestException(
          `Недостаточно остатка для ${flower.name}: запрошено ${line.quantity}, доступно ${flower.stockQuantity}`,
        );
      }
      const unitPriceAtOrder = flower.unitPrice;
      const lineSubtotal = unitPriceAtOrder * line.quantity;
      bouquetSubtotal += lineSubtotal;
      result.push({
        flowerId: flower.id,
        flowerName: flower.name,
        quantity: line.quantity,
        unitPriceAtOrder,
        lineSubtotal,
      });
    }

    return { lines: result, bouquetSubtotal };
  }

  applyStockDecrease(lines: OrderLineDto[]): void {
    for (const line of lines) {
      this.catalog.decreaseStock(line.flowerId, line.quantity);
    }
  }
}
