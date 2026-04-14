import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { OrderResult } from '../domain/types';
import { BouquetCalculatorService } from './bouquet-calculator.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { DeliveryQuoteService } from './delivery-quote.service';
import { CatalogService } from '../catalog/catalog.service';

@Injectable()
export class OrdersService {
  private readonly orders: OrderResult[] = [];

  constructor(
    private readonly catalog: CatalogService,
    private readonly bouquet: BouquetCalculatorService,
    private readonly delivery: DeliveryQuoteService,
  ) {}

  getAll(): OrderResult[] {
    return [...this.orders];
  }

  create(dto: CreateOrderDto): OrderResult {
    const packaging = this.catalog.getPackagingById(dto.packagingId);
    if (!packaging || !packaging.isActive) {
      throw new BadRequestException(`Упаковка не найдена: ${dto.packagingId}`);
    }

    const { lines: calcLines, bouquetSubtotal } = this.bouquet.calculate(
      dto.lines,
    );
    const quote = this.delivery.quote(dto.deliveryAddress, calcLines);
    const packagingPrice = packaging.price;
    const total =
      Math.round((bouquetSubtotal + packagingPrice + quote.cost) * 100) / 100;

    const order: OrderResult = {
      id: randomUUID(),
      employeeId: dto.employeeId ?? null,
      deliveryAddress: dto.deliveryAddress,
      packagingId: packaging.id,
      packagingName: packaging.name,
      status: 'Подтверждён',
      createdAt: new Date().toISOString(),
      lines: calcLines,
      bouquetSubtotal,
      packagingPrice,
      deliveryCost: quote.cost,
      deliveryEta: quote.eta,
      total,
    };

    this.bouquet.applyStockDecrease(dto.lines);
    this.orders.unshift(order);
    return order;
  }
}
