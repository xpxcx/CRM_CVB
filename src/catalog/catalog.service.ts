import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  addFlower(payload: Omit<Flower, 'id'> & { id?: string }): Flower {
    const id = this.ensureId(payload.id, 'f', this.flowers.map((x) => x.id));
    if (this.flowers.some((x) => x.id === id)) {
      throw new ConflictException('Цветок с таким id уже существует');
    }
    const row: Flower = {
      id,
      name: String(payload.name),
      unitPrice: Number(payload.unitPrice),
      stockQuantity: Number(payload.stockQuantity),
      categoryId: String(payload.categoryId),
      isActive: !!payload.isActive,
    };
    this.flowers.push(row);
    return { ...row };
  }

  setFlowerStock(flowerId: string, stockQuantity: number): Flower {
    const f = this.flowers.find((x) => x.id === flowerId);
    if (!f) {
      throw new NotFoundException('Цветок не найден');
    }
    f.stockQuantity = stockQuantity;
    return { ...f };
  }

  addPackaging(payload: Omit<Packaging, 'id'> & { id?: string }): Packaging {
    const id = this.ensureId(payload.id, 'p', this.packaging.map((x) => x.id));
    if (this.packaging.some((x) => x.id === id)) {
      throw new ConflictException('Упаковка с таким id уже существует');
    }
    const row: Packaging = {
      id,
      name: String(payload.name),
      price: Number(payload.price),
      isActive: !!payload.isActive,
    };
    this.packaging.push(row);
    return { ...row };
  }

  deleteFlower(id: string): void {
    const idx = this.flowers.findIndex((x) => x.id === id);
    if (idx < 0) {
      throw new NotFoundException('Цветок не найден');
    }
    this.flowers.splice(idx, 1);
  }

  deletePackaging(id: string): void {
    const idx = this.packaging.findIndex((x) => x.id === id);
    if (idx < 0) {
      throw new NotFoundException('Упаковка не найдена');
    }
    this.packaging.splice(idx, 1);
  }

  decreaseStock(flowerId: string, qty: number): void {
    const f = this.flowers.find((x) => x.id === flowerId);
    if (f) f.stockQuantity -= qty;
  }

  private ensureId(id: string | undefined, prefix: string, used: string[]): string {
    const trimmed = (id ?? '').trim();
    if (trimmed) return trimmed;
    for (let i = 1; i < 100000; i += 1) {
      const candidate = `${prefix}${used.length + i}`;
      if (!used.includes(candidate)) return candidate;
    }
    return `${prefix}${Date.now()}`;
  }
}
