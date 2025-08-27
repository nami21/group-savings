import React, { createContext, useContext, ReactNode } from 'react';
import { Group, Member, Transaction } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppContextType {
  groups: Group[];
  members: Member[];
  transactions: Transaction[];
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => void;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  getGroupTotal: (groupId: string) => number;
  getMemberTotal: (memberId: string) => number;
  getGroupMembers: (groupId: string) => Member[];
  getGroupTransactions: (groupId: string) => Transaction[];
  getMemberTransactions: (memberId: string) => Transaction[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useLocalStorage<Group[]>('groups', []);
  const [members, setMembers] = useLocalStorage<Member[]>('members', []);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const addGroup = (groupData: Omit<Group, 'id' | 'createdAt'>) => {
    const newGroup: Group = {
      ...groupData,
      id: generateId(),
      createdAt: new Date(),
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const updateGroup = (id: string, updates: Partial<Group>) => {
    setGroups(prev => prev.map(group => 
      group.id === id ? { ...group, ...updates } : group
    ));
  };

  const deleteGroup = (id: string) => {
    setGroups(prev => prev.filter(group => group.id !== id));
    setMembers(prev => prev.filter(member => member.groupId !== id));
    setTransactions(prev => prev.filter(transaction => transaction.groupId !== id));
  };

  const addMember = (memberData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...memberData,
      id: generateId(),
    };
    setMembers(prev => [...prev, newMember]);
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(member => member.id !== id));
    setTransactions(prev => prev.filter(transaction => transaction.memberId !== id));
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateId(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const getGroupTotal = (groupId: string): number => {
    return transactions
      .filter(transaction => transaction.groupId === groupId)
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getMemberTotal = (memberId: string): number => {
    return transactions
      .filter(transaction => transaction.memberId === memberId)
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getGroupMembers = (groupId: string): Member[] => {
    return members.filter(member => member.groupId === groupId);
  };

  const getGroupTransactions = (groupId: string): Transaction[] => {
    return transactions.filter(transaction => transaction.groupId === groupId);
  };

  const getMemberTransactions = (memberId: string): Transaction[] => {
    return transactions.filter(transaction => transaction.memberId === memberId);
  };

  const value: AppContextType = {
    groups,
    members,
    transactions,
    addGroup,
    updateGroup,
    deleteGroup,
    addMember,
    updateMember,
    deleteMember,
    addTransaction,
    deleteTransaction,
    getGroupTotal,
    getMemberTotal,
    getGroupMembers,
    getGroupTransactions,
    getMemberTransactions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};