import { Injectable } from '@nestjs/common';
import { OrderLineResult } from '../domain/types';

export interface DeliveryQuote {
  cost: number;
  eta: string;
  providerRef: string;
}

@Injectable()
export class DeliveryQuoteService {
  quote(
    address: string,
    lines: OrderLineResult[],
    packagingWeightKg = 0.3,
  ): DeliveryQuote {
    const units = lines.reduce((s, l) => s + l.quantity, 0);
    const weightKg = Math.max(0.5, units * 0.05 + packagingWeightKg);
    const addressLen = Math.min(address.length, 80);
    const base = 180 + weightKg * 40 + addressLen * 0.5;
    const cost = Math.round(base * 100) / 100;
    const eta =
      units > 25 ? '2–3 дня' : units > 12 ? '1–2 дня' : 'в день заказа';
    return {
      cost,
      eta,
      providerRef: `mock-${Date.now()}`,
    };
  }
}
