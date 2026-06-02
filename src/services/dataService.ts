import { MELENT_KEYS, LocalStorageManager } from './localStorageManager';
import { MedicalOrder, Product, Expense, B2BCompany, B2BDeal, B2BFollowUp, B2BProductB2B } from '../types';

export const DATA_UPDATED_EVENT = 'melent-data-updated';

export const DataService = {
  // Orders
  getOrders: (): MedicalOrder[] => {
    return LocalStorageManager.get(MELENT_KEYS.ORDERS) || [];
  },

  setOrders: (orders: MedicalOrder[]) => {
    LocalStorageManager.save(MELENT_KEYS.ORDERS, orders);
    window.dispatchEvent(new CustomEvent(DATA_UPDATED_EVENT, { detail: { key: MELENT_KEYS.ORDERS } }));
  },

  addOrder: (order: MedicalOrder) => {
    const orders = DataService.getOrders();
    const exists = orders.findIndex(o => o.id === order.id);
    if (exists > -1) {
      orders[exists] = order;
    } else {
      orders.unshift(order);
    }
    DataService.setOrders(orders);
  },

  cancelOrder: (orderId: string) => {
    const orders = DataService.getOrders().map(order => 
      order.id === orderId ? { ...order, status: 'Cancelled' as const } : order
    );
    DataService.setOrders(orders);
  },

  deleteOrder: (orderId: string) => {
    // We use softDelete for audit trails, but for this reactivity we can just filter
    const orders = DataService.getOrders().filter(o => o.id !== orderId);
    DataService.setOrders(orders);
    // Also trigger the soft delete in LocalStorageManager if we want the recycle bin
    LocalStorageManager.softDelete(MELENT_KEYS.ORDERS, orderId, 'ORDER', `Order ID: ${orderId}`);
  },

  // Products
  getProducts: (): Product[] => {
    return LocalStorageManager.get(MELENT_KEYS.PRODUCTS) || [];
  },

  setProducts: (products: Product[]) => {
    LocalStorageManager.save(MELENT_KEYS.PRODUCTS, products);
    window.dispatchEvent(new CustomEvent(DATA_UPDATED_EVENT, { detail: { key: MELENT_KEYS.PRODUCTS } }));
  },

  // Expenses
  getExpenses: (): Expense[] => {
    return LocalStorageManager.get(MELENT_KEYS.EXPENSES) || [];
  },

  setExpenses: (expenses: Expense[]) => {
    LocalStorageManager.save(MELENT_KEYS.EXPENSES, expenses);
    window.dispatchEvent(new CustomEvent(DATA_UPDATED_EVENT, { detail: { key: MELENT_KEYS.EXPENSES } }));
  },

  // B2B Data
  getB2BCompanies: (): B2BCompany[] => LocalStorageManager.get(MELENT_KEYS.B2B_COMPANIES) || [],
  getB2BDeals: (): B2BDeal[] => LocalStorageManager.get(MELENT_KEYS.B2B_DEALS) || [],
  getB2BFollowUps: (): B2BFollowUp[] => LocalStorageManager.get(MELENT_KEYS.B2B_FOLLOWUPS) || [],
  getB2BProducts: (): B2BProductB2B[] => LocalStorageManager.get(MELENT_KEYS.B2B_PRODUCTS) || [],

  setB2BCompanies: (data: B2BCompany[]) => {
    LocalStorageManager.save(MELENT_KEYS.B2B_COMPANIES, data);
    window.dispatchEvent(new CustomEvent(DATA_UPDATED_EVENT, { detail: { key: MELENT_KEYS.B2B_COMPANIES } }));
  },
  setB2BDeals: (data: B2BDeal[]) => {
    LocalStorageManager.save(MELENT_KEYS.B2B_DEALS, data);
    window.dispatchEvent(new CustomEvent(DATA_UPDATED_EVENT, { detail: { key: MELENT_KEYS.B2B_DEALS } }));
  },
  setB2BFollowUps: (data: B2BFollowUp[]) => {
    LocalStorageManager.save(MELENT_KEYS.B2B_FOLLOWUPS, data);
    window.dispatchEvent(new CustomEvent(DATA_UPDATED_EVENT, { detail: { key: MELENT_KEYS.B2B_FOLLOWUPS } }));
  },
  setB2BProducts: (data: B2BProductB2B[]) => {
    LocalStorageManager.save(MELENT_KEYS.B2B_PRODUCTS, data);
    window.dispatchEvent(new CustomEvent(DATA_UPDATED_EVENT, { detail: { key: MELENT_KEYS.B2B_PRODUCTS } }));
  },

  // Inventory Sync
  syncInventory: () => {
    const orders = DataService.getOrders();
    const products = DataService.getProducts();
    const initialProducts = LocalStorageManager.get('melent_initial_products') || products;
    
    // We assume stock = initial - quantity of processed orders
    const processedOrders = orders.filter(o => !['Cancelled', 'Rejected', 'Draft'].includes(o.status));
    
    const updatedProducts = initialProducts.map((p: Product) => {
      const soldQuantity = processedOrders.reduce((acc, order) => {
        const item = order.items.find(i => i.productId === p.id);
        return acc + (item?.quantity || 0);
      }, 0);
      return { ...p, stock: Math.max(0, p.stock - soldQuantity) };
    });

    DataService.setProducts(updatedProducts);
  },

  // Calculations
  getProfitSummary: () => {
    const orders = DataService.getOrders();
    const activeOrders = orders.filter(o => !['Cancelled', 'Rejected'].includes(o.status));
    
    // In this app, MedicalOrder.items don't have purchase price directly in the order item,
    // they reference products. So we need products too.
    const products = DataService.getProducts();

    let totalRevenue = 0;
    let totalCost = 0;

    activeOrders.forEach(order => {
      totalRevenue += (order.financials?.total || 0);
      
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const unitCost = product?.purchasePrice || 0;
        totalCost += (unitCost * item.quantity);
      });

      // Add other fees to costs if they are internal costs (customs, shipping if paid by Melent)
      if (order.shipping?.paidBy === 'MELENT CARE') {
        totalCost += (order.shipping?.shippingCost || 0);
      }
      totalCost += (order.financials?.customsFee || 0);
    });

    return {
      count: activeOrders.length,
      revenue: totalRevenue,
      costs: totalCost,
      profit: totalRevenue - totalCost,
      margin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0
    };
  }
};
