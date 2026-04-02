export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  minStock: number;
  category: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    sku: "CBD-001",
    name: "CBD Oil 500mg",
    description: "Premium full-spectrum CBD oil, 30ml bottle",
    price: 49.99,
    stock: 45,
    minStock: 10,
    category: "Oils",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    sku: "CBD-002",
    name: "CBD Gummies 25mg",
    description: "Delicious strawberry flavored CBD gummies, 30 count",
    price: 34.99,
    stock: 8,
    minStock: 15,
    category: "Edibles",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    sku: "CBD-003",
    name: "CBD Cream 100mg",
    description: "Topical CBD cream for muscle relief, 50ml",
    price: 39.99,
    stock: 23,
    minStock: 8,
    category: "Topicals",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    sku: "CBD-004",
    name: "CBD Capsules 20mg",
    description: "Easy-to-swallow CBD capsules, 60 count",
    price: 44.99,
    stock: 5,
    minStock: 12,
    category: "Capsules",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    sku: "CBD-005",
    name: "CBD Tincture 1000mg",
    description: "High potency CBD tincture, 30ml bottle",
    price: 89.99,
    stock: 18,
    minStock: 5,
    category: "Oils",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    sku: "CBD-006",
    name: "CBD Vape Pen 200mg",
    description: "Disposable CBD vape pen, peppermint flavor",
    price: 29.99,
    stock: 32,
    minStock: 10,
    category: "Vapes",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    sku: "CBD-007",
    name: "CBD Pet Treats 10mg",
    description: "CBD treats for pets, bacon flavor, 30 count",
    price: 24.99,
    stock: 3,
    minStock: 8,
    category: "Pet Products",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    sku: "CBD-008",
    name: "CBD Bath Bombs 50mg",
    description: "Relaxing CBD bath bombs, lavender scent, 4 pack",
    price: 19.99,
    stock: 27,
    minStock: 6,
    category: "Bath & Body",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export interface StockLog {
  id: string;
  productId: string;
  type: "IN" | "OUT" | "ADJUST";
  quantity: number;
  prevStock: number;
  nextStock: number;
  note: string | null;
  createdAt: string;
}

export const mockStockLogs: StockLog[] = [
  {
    id: "1",
    productId: "1",
    type: "IN",
    quantity: 50,
    prevStock: 0,
    nextStock: 50,
    note: "Initial stock from supplier",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "2",
    productId: "1",
    type: "OUT",
    quantity: 5,
    prevStock: 50,
    nextStock: 45,
    note: "Sales order #1001",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "3",
    productId: "2",
    type: "IN",
    quantity: 30,
    prevStock: 0,
    nextStock: 30,
    note: "Restock from manufacturer",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "4",
    productId: "2",
    type: "OUT",
    quantity: 22,
    prevStock: 30,
    nextStock: 8,
    note: "Bulk order shipment",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "5",
    productId: "3",
    type: "IN",
    quantity: 25,
    prevStock: 0,
    nextStock: 25,
    note: "New product line",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: "6",
    productId: "3",
    type: "OUT",
    quantity: 2,
    prevStock: 25,
    nextStock: 23,
    note: "Sales order #1005",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "7",
    productId: "4",
    type: "ADJUST",
    quantity: -3,
    prevStock: 8,
    nextStock: 5,
    note: "Damaged goods removed",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "8",
    productId: "7",
    type: "ADJUST",
    quantity: -5,
    prevStock: 8,
    nextStock: 3,
    note: "Expired products disposed",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];
