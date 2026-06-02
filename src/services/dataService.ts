import { EventEmitter } from 'events';

export type OrderStatus = 'draft' | 'confirmed' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  clientId: string;
  productId?: string;
  supplierId?: string;
  logisticsId?: string;
  contractId?: string;

  quantity: number;
  salePrice: number;
  costPrice: number;
  logisticsCost: number;
  extraCost: number;

  revenue: number;
  totalCost: number;
  grossProfit: number;

  status: OrderStatus;
  createdAt: string;
  cancelledAt?: string;
}

class DataService extends EventEmitter {
  private static instance: DataService;
  private orders: Order[] = [];

  private constructor() {
    super();
    const saved = localStorage.getItem('melent_orders');
    if (saved) {
      this.orders = JSON.parse(saved);
    }
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private save() {
    localStorage.setItem('melent_orders', JSON.stringify(this.orders));
    this.emit('update');
  }

  public getOrders() {
    return this.orders;
  }

  public getActiveOrders() {
    return this.orders.filter(o => o.status !== 'cancelled');
  }

  public getProfitSummary() {
    const activeOrders = this.getActiveOrders();
    return {
      ordersCount: activeOrders.length,
      totalRevenue: activeOrders.reduce((sum, o) => sum + o.revenue, 0),
      totalCost: activeOrders.reduce((sum, o) => sum + o.totalCost, 0),
      grossProfit: activeOrders.reduce((sum, o) => sum + o.grossProfit, 0),
    };
  }

  public addOrder(order: Order) {
    this.orders.push(order);
    this.save();
  }

  public cancelOrder(orderId: string) {
    this.orders = this.orders.map(o => o.id === orderId ? {...o, status: 'cancelled', cancelledAt: new Date().toISOString()} : o);
    this.save();
  }

  public deleteOrder(orderId: string) {
    this.orders = this.orders.filter(o => o.id !== orderId);
    this.save();
  }

}

export const dataService = DataService.getInstance();