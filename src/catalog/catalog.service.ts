import { Injectable } from '@nestjs/common';
import { Flower, Packaging } from '../domain/types';

@Injectable()
export class CatalogService {
  private readonly flowers: Flower[] = [
    {
      id: 'f1',
      name: 'Роза красная',
      unitPrice: 120,
      stockQuantity: 200,
      categoryId: 'c1',
      isActive: true,
    },
    {
      id: 'f2',
      name: 'Хризантема',
      unitPrice: 85,
      stockQuantity: 150,
      categoryId: 'c2',
      isActive: true,
    },
    {
      id: 'f3',
      name: 'Тюльпан',
      unitPrice: 70,
      stockQuantity: 80,
      categoryId: 'c1',
      isActive: true,
    },
  ];

  private readonly packaging: Packaging[] = [
    { id: 'p1', name: 'Крафт + лента', price: 250, isActive: true },
    { id: 'p2', name: 'Премиум коробка', price: 450, isActive: true },
  ];

  getFlowers(): Flower[] {
    return this.flowers.map((f) => ({ ...f }));
  }

  getPackaging(): Packaging[] {
    return this.packaging.map((p) => ({ ...p }));
  }

  getFlowerById(id: string): Flower | undefined {
    return this.flowers.find((f) => f.id === id);
  }

  getPackagingById(id: string): Packaging | undefined {
    return this.packaging.find((p) => p.id === id);
  }

  decreaseStock(flowerId: string, qty: number): void {
    const f = this.flowers.find((x) => x.id === flowerId);
    if (f) f.stockQuantity -= qty;
  }
}
