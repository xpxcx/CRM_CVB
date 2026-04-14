import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { BouquetCalculatorService } from '../orders/bouquet-calculator.service';
import { DeliveryQuoteService } from '../orders/delivery-quote.service';
import { CatalogService } from '../catalog/catalog.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { ClassmateService } from '../classmate/classmate.service';

@Injectable()
export class IntegrationService {
  constructor(
    private readonly catalog: CatalogService,
    private readonly bouquet: BouquetCalculatorService,
    private readonly delivery: DeliveryQuoteService,
    private readonly orders: OrdersService,
    private readonly classmate: ClassmateService,
  ) {}

  async status(selfBaseUrl: string) {
    const CLASSMATE_BASE = this.classmate.getBaseUrl();

    const result: any = {
      platform: { ok: true, at: new Date().toISOString() },
      self: null,
      classmate: null,
      errors: [] as any[],
    };

    try {
      result.self = await this.classmate.fetchJson(`${selfBaseUrl}/api/health`);
    } catch (e: any) {
      result.errors.push({
        service: 'FlowerShopAPI',
        message: e?.message,
        detail: e?.body || e?.code || null,
      });
      result.self = { available: false };
    }

    try {
      result.classmate = await this.classmate.fetchJson(`${CLASSMATE_BASE}/health`);
    } catch (e: any) {
      result.errors.push({
        service: 'ClassmateAPI',
        message: e?.message,
        detail: e?.body || e?.code || null,
      });
      result.classmate = { available: false };
    }

    return result;
  }

  async bouquetEstimate(dto: CreateOrderDto) {
    if (!dto?.employeeName || !String(dto.employeeName).trim()) {
      return { error: 'Укажите employeeName', step: 'Валидация' };
    }

    const packagingEnabled = !!dto.packagingEnabled;
    const deliveryEnabled = !!dto.deliveryEnabled;

    if (deliveryEnabled && (!dto.deliveryAddress || !String(dto.deliveryAddress).trim())) {
      return { error: 'Укажите deliveryAddress (если deliveryEnabled = true)', step: 'Валидация' };
    }

    let packagingName = 'Без оформления';
    let packagingId: string | null = null;
    let packagingPrice = 0;

    if (packagingEnabled) {
      if (!dto.packagingId) {
        return { error: 'Укажите packagingId (если packagingEnabled = true)', step: 'Валидация' };
      }
      const packaging = this.catalog.getPackagingById(dto.packagingId);
      if (!packaging || !packaging.isActive) {
        return { error: `Упаковка не найдена: ${dto.packagingId}`, step: 'Проверка упаковки' };
      }
      packagingName = packaging.name;
      packagingId = packaging.id;
      packagingPrice = packaging.price;
    }

    const { lines: calcLines, bouquetSubtotal } = this.bouquet.calculate(dto.lines);
    const quote = deliveryEnabled
      ? this.delivery.quote(dto.deliveryAddress!, calcLines)
      : { cost: 0, eta: '—', providerRef: 'no-delivery' };
    const total = Math.round((bouquetSubtotal + packagingPrice + quote.cost) * 100) / 100;

    let products: any[] = [];
    let recommended: any = null;
    try {
      const data = await this.classmate.fetchJson(`${this.classmate.getBaseUrl()}/api/products`);
      products = Array.isArray(data) ? data : [];
      const inStock = products.filter((p) => (p?.inStock ?? 1) > 0);
      if (inStock.length) {
        const budget = Math.max(total * 2, 5000);
        recommended =
          inStock.find((p) => typeof p?.price === 'number' && p.price <= budget) ||
          inStock.reduce((a, b) => ((a?.price ?? Infinity) <= (b?.price ?? Infinity) ? a : b));
      }
    } catch {
      products = [];
      recommended = null;
    }

    return {
      step: 'Расчет букета + доставка (демо) + рекомендации из API одногруппника',
      orderPreview: {
        employeeId: dto.employeeId ?? null,
        employeeName: String(dto.employeeName).trim(),
        deliveryEnabled,
        deliveryAddress: deliveryEnabled ? String(dto.deliveryAddress).trim() : null,
        packagingEnabled,
        packagingId,
        packagingName,
        lines: calcLines,
        bouquetSubtotal,
        packagingPrice,
        deliveryCost: quote.cost,
        deliveryEta: quote.eta,
        total,
      },
      classmate: {
        baseUrl: this.classmate.getBaseUrl(),
        recommendedProduct: recommended,
        productsCount: products.length,
      },
    };
  }
}

