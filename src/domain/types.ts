export interface Flower {
  id: string;
  name: string;
  unitPrice: number;
  stockQuantity: number;
  categoryId: string;
  isActive: boolean;
}

export interface Packaging {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface OrderLineResult {
  flowerId: string;
  flowerName: string;
  quantity: number;
  unitPriceAtOrder: number;
  lineSubtotal: number;
}

export interface OrderResult {
  id: string;
  employeeId: string | null;
  deliveryAddress: string;
  packagingId: string;
  packagingName: string;
  status: string;
  createdAt: string;
  lines: OrderLineResult[];
  bouquetSubtotal: number;
  packagingPrice: number;
  deliveryCost: number;
  deliveryEta: string;
  total: number;
}
