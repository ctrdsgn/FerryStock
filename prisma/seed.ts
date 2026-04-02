import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    sku: 'SNK-001',
    name: 'Nike Air Max 270',
    description: 'Sepatu sneakers casual dengan teknologi Air Max untuk kenyamanan maksimal',
    price: 1899000,
    stock: 0,
    minStock: 10,
    category: 'Sepatu',
  },
  {
    sku: 'SNK-002',
    name: 'Adidas Ultraboost 22',
    description: 'Sepatu running dengan teknologi Boost untuk energi kembali di setiap langkah',
    price: 2299000,
    stock: 0,
    minStock: 12,
    category: 'Sepatu',
  },
  {
    sku: 'TPL-001',
    name: 'Kaos Polo Classic Navy',
    description: 'Kaos polo premium bahan cotton combed 30s, nyaman dipakai sehari-hari',
    price: 149000,
    stock: 0,
    minStock: 20,
    category: 'Pakaian',
  },
  {
    sku: 'TPL-002',
    name: 'Kemeja Flannel Box',
    description: 'Kemeja flannel motif kotak-kotak, bahan tebal dan hangat',
    price: 279000,
    stock: 0,
    minStock: 10,
    category: 'Pakaian',
  },
  {
    sku: 'JNS-001',
    name: 'Celana Jeans Slim Fit',
    description: 'Jeans slim fit stretch, nyaman dan fleksibel untuk aktivitas sehari-hari',
    price: 399000,
    stock: 0,
    minStock: 15,
    category: 'Celana',
  },
  {
    sku: 'JNS-002',
    name: 'Celana Chino Pants',
    description: 'Celana chino formal-casual, cocok untuk kerja atau acara santai',
    price: 329000,
    stock: 0,
    minStock: 12,
    category: 'Celana',
  },
  {
    sku: 'BAG-001',
    name: 'Tas Ransel Canvas',
    description: 'Tas ransel bahan canvas waterproof, kapasitas 25L dengan laptop compartment',
    price: 459000,
    stock: 0,
    minStock: 8,
    category: 'Tas',
  },
  {
    sku: 'BAG-002',
    name: 'Tas Selempang Kulit',
    description: 'Tas selempang pria bahan kulit sintetis premium, desain minimalis',
    price: 249000,
    stock: 0,
    minStock: 10,
    category: 'Tas',
  },
  {
    sku: 'ACC-001',
    name: 'Topi Baseball Cap',
    description: 'Topi baseball adjustable, bahan katun breathable dengan emblem bordir',
    price: 89000,
    stock: 0,
    minStock: 20,
    category: 'Aksesoris',
  },
  {
    sku: 'ACC-002',
    name: 'Jam Tangan Analog',
    description: 'Jam tangan analog minimalis, strap kulit asli, water resistant 3ATM',
    price: 599000,
    stock: 0,
    minStock: 8,
    category: 'Aksesoris',
  },
];

const suppliers = [
  'PT. Sumber Jaya Abadi',
  'CV. Mitra Sejahtera',
  'PT. Global Distribusi',
  'UD. Berkah Sentosa',
  'PT. Indo Retail Supply',
];

const transactionNotes = {
  IN: [
    'Pengiriman dari supplier',
    'Restock barang baru',
    'Order PO diterima',
    'Kiriman batch terbaru',
    'Stok pengganti retur',
  ],
  OUT: [
    'Penjualan marketplace Shopee',
    'Order Tokopedia',
    'Penjualan offline store',
    'Reseller order',
    'Customer regular order',
  ],
};

function getRandomDate(daysAgoMin: number, daysAgoMax: number) {
  const days = Math.floor(Math.random() * (daysAgoMax - daysAgoMin + 1)) + daysAgoMin;
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function getRandomSupplier() {
  return suppliers[Math.floor(Math.random() * suppliers.length)];
}

async function main() {
  console.log('🌱 Starting fresh database seed with transactions...\n');

  // Clear existing data
  console.log('🗑️  Clearing ALL existing data...');
  await prisma.stockLog.deleteMany();
  console.log('   ✅ Stock logs cleared');
  await prisma.product.deleteMany();
  console.log('   ✅ Products cleared\n');

  console.log('📦 Creating products...');
  const createdProducts = [];
  for (const product of products) {
    const created = await prisma.product.create({
      data: {
        ...product,
        stock: 0,
      },
    });
    createdProducts.push(created);
    console.log(`   ✅ ${product.name}`);
  }

  console.log('\n📊 Creating stock transactions (last 45 days)...\n');
  
  let totalTransactions = 0;

  for (const product of createdProducts) {
    let currentStock = 0;
    const transactions: any[] = [];

    // === INITIAL STOCK IN (35-45 days ago) - ALL with supplier ===
    const initialStock = Math.floor(Math.random() * 25) + 20;
    const initialDate = getRandomDate(35, 45);
    transactions.push({
      productId: product.id,
      type: 'IN' as const,
      quantity: initialStock,
      prevStock: 0,
      nextStock: initialStock,
      supplier: getRandomSupplier(), // ALWAYS has supplier
      note: `Stok awal - ${transactionNotes.IN[Math.floor(Math.random() * transactionNotes.IN.length)]}`,
      createdAt: initialDate,
    });
    currentStock = initialStock;

    // === ADDITIONAL IN TRANSACTIONS (20-35 days ago) - ALL with supplier ===
    const additionalInCount = Math.floor(Math.random() * 2) + 2; // 2-3 times
    for (let i = 0; i < additionalInCount; i++) {
      const inQuantity = Math.floor(Math.random() * 15) + 10;
      const inDate = getRandomDate(20, 35);
      transactions.push({
        productId: product.id,
        type: 'IN' as const,
        quantity: inQuantity,
        prevStock: currentStock,
        nextStock: currentStock + inQuantity,
        supplier: getRandomSupplier(), // ALWAYS has supplier
        note: transactionNotes.IN[Math.floor(Math.random() * transactionNotes.IN.length)],
        createdAt: inDate,
      });
      currentStock += inQuantity;
    }

    // === OUT TRANSACTIONS (5-30 days ago) - NO supplier ===
    const outTxCount = Math.floor(Math.random() * 4) + 3; // 3-6 times
    for (let i = 0; i < outTxCount; i++) {
      const maxOut = Math.min(currentStock - 8, 12);
      if (maxOut > 0) {
        const outQuantity = Math.floor(Math.random() * maxOut) + 1;
        const outDate = getRandomDate(5, 30);
        transactions.push({
          productId: product.id,
          type: 'OUT' as const,
          quantity: outQuantity,
          prevStock: currentStock,
          nextStock: currentStock - outQuantity,
          supplier: null, // NO supplier for OUT
          note: transactionNotes.OUT[Math.floor(Math.random() * transactionNotes.OUT.length)],
          createdAt: outDate,
        });
        currentStock -= outQuantity;
      }
    }

    // === RECENT RESTOCK (1-10 days ago) - ALL with supplier ===
    const recentInQuantity = Math.floor(Math.random() * 12) + 8;
    const recentInDate = getRandomDate(1, 10);
    transactions.push({
      productId: product.id,
      type: 'IN' as const,
      quantity: recentInQuantity,
      prevStock: currentStock,
      nextStock: currentStock + recentInQuantity,
      supplier: getRandomSupplier(), // ALWAYS has supplier
      note: `Restock cepat - ${transactionNotes.IN[Math.floor(Math.random() * transactionNotes.IN.length)]}`,
      createdAt: recentInDate,
    });
    currentStock += recentInQuantity;

    // Sort by date
    transactions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // Recalculate with sorted dates
    let runningStock = 0;
    for (const tx of transactions) {
      tx.prevStock = runningStock;
      if (tx.type === 'IN') {
        runningStock += tx.quantity;
      } else {
        runningStock -= tx.quantity;
      }
      tx.nextStock = runningStock;
    }

    // Create transactions
    for (const tx of transactions) {
      await prisma.stockLog.create({
        data: tx,
      });
      totalTransactions++;
    }

    // Update final stock
    await prisma.product.update({
      where: { id: product.id },
      data: { stock: runningStock },
    });

    const inCount = transactions.filter(t => t.type === 'IN').length;
    const outCount = transactions.filter(t => t.type === 'OUT').length;
    console.log(`   📦 ${product.name}`);
    console.log(`      └─ ${transactions.length} transactions (${inCount} IN, ${outCount} OUT)`);
    console.log(`      └─ Final stock: ${runningStock}`);
    console.log(`      └─ All IN transactions have supplier: ✅`);
  }

  console.log('\n✅ Database seeded successfully!');
  console.log(`   📊 Total products: ${products.length}`);
  console.log(`   📈 Total transactions: ${totalTransactions}`);
  console.log(`   📅 Date range: Last 45 days`);
  console.log(`   🏪 Suppliers used: ${suppliers.join(', ')}`);
  
  // Verify no null suppliers for IN transactions
  const inLogs = await prisma.stockLog.findMany({
    where: { type: 'IN' },
  });
  const nullSuppliers = inLogs.filter(log => !log.supplier || log.supplier.trim() === '');
  
  if (nullSuppliers.length > 0) {
    console.log(`\n⚠️  WARNING: ${nullSuppliers.length} IN transactions have NULL supplier!`);
  } else {
    console.log(`\n✅ VERIFIED: All ${inLogs.length} IN transactions have supplier data!`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
