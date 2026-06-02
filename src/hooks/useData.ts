import { useState, useEffect, useCallback } from 'react';
import { DataService, DATA_UPDATED_EVENT } from '../services/dataService';
import { MedicalOrder, Product, Expense, B2BCompany, B2BDeal, B2BFollowUp, B2BProductB2B } from '../types';

export function useData() {
  const [orders, setOrders] = useState<MedicalOrder[]>(DataService.getOrders());
  const [products, setProducts] = useState<Product[]>(DataService.getProducts());
  const [expenses, setExpenses] = useState<Expense[]>(DataService.getExpenses());
  const [b2bCompanies, setB2BCompanies] = useState<B2BCompany[]>(DataService.getB2BCompanies());
  const [b2bDeals, setB2BDeals] = useState<B2BDeal[]>(DataService.getB2BDeals());
  const [b2bFollowUps, setB2BFollowUps] = useState<B2BFollowUp[]>(DataService.getB2BFollowUps());
  const [b2bProducts, setB2BProducts] = useState<B2BProductB2B[]>(DataService.getB2BProducts());

  const refreshData = useCallback(() => {
    setOrders(DataService.getOrders());
    setProducts(DataService.getProducts());
    setExpenses(DataService.getExpenses());
    setB2BCompanies(DataService.getB2BCompanies());
    setB2BDeals(DataService.getB2BDeals());
    setB2BFollowUps(DataService.getB2BFollowUps());
    setB2BProducts(DataService.getB2BProducts());
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      refreshData();
    };

    window.addEventListener(DATA_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(DATA_UPDATED_EVENT, handleUpdate);
  }, [refreshData]);

  // Expose DataService methods alongside the reactive state
  return {
    orders,
    products,
    expenses,
    b2bCompanies,
    b2bDeals,
    b2bFollowUps,
    b2bProducts,
    addOrder: DataService.addOrder,
    cancelOrder: DataService.cancelOrder,
    deleteOrder: DataService.deleteOrder,
    setOrders: DataService.setOrders,
    setProducts: DataService.setProducts,
    setExpenses: DataService.setExpenses,
    setB2BCompanies: DataService.setB2BCompanies,
    setB2BDeals: DataService.setB2BDeals,
    setB2BFollowUps: DataService.setB2BFollowUps,
    setB2BProducts: DataService.setB2BProducts,
    getProfitSummary: DataService.getProfitSummary,
    syncInventory: DataService.syncInventory,
    refreshData
  };
}
