export interface Group {
  id: string;
  title: string;
  description?: string;
  icon: string;
  createdAt: Date;
}

export interface Member {
  id: string;
  groupId: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface Transaction {
  id: string;
  groupId: string;
  memberId: string;
  amount: number;
  date: Date;
  description?: string;
}