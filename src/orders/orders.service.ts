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
    const packagingEnabled = !!dto.packagingEnabled;
    const deliveryEnabled = !!dto.deliveryEnabled;

    if (!dto.employeeName || !String(dto.employeeName).trim()) {
      throw new BadRequestException('Укажите employeeName');
    }

    if (deliveryEnabled && (!dto.deliveryAddress || !String(dto.deliveryAddress).trim())) {
      throw new BadRequestException('Укажите deliveryAddress (если deliveryEnabled = true)');
    }

    let packagingName = 'Без оформления';
    let packagingId: string | null = null;
    let packagingPrice = 0;

    if (packagingEnabled) {
      if (!dto.packagingId) {
        throw new BadRequestException('Укажите packagingId (если packagingEnabled = true)');
      }
      const packaging = this.catalog.getPackagingById(dto.packagingId);
      if (!packaging || !packaging.isActive) {
        throw new BadRequestException(`Упаковка не найдена: ${dto.packagingId}`);
      }
      packagingName = packaging.name;
      packagingId = packaging.id;
      packagingPrice = packaging.price;
    }

    const { lines: calcLines, bouquetSubtotal } = this.bouquet.calculate(
      dto.lines,
    );

    const quote = deliveryEnabled
      ? this.delivery.quote(dto.deliveryAddress!, calcLines)
      : { cost: 0, eta: '—', providerRef: 'no-delivery' };

    const total = Math.round((bouquetSubtotal + packagingPrice + quote.cost) * 100) / 100;

    const order: OrderResult = {
      id: randomUUID(),
      employeeId: dto.employeeId ?? null,
      employeeName: String(dto.employeeName).trim(),
      deliveryEnabled,
      deliveryAddress: deliveryEnabled ? String(dto.deliveryAddress).trim() : null,
      packagingEnabled,
      packagingId,
      packagingName,
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
