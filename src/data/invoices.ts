import { Company, companies } from './invoiceTypes';

export interface Invoice {
  id: string;
  companyId: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  customerName: string;
  customerNumber: string;
  invoiceNumber: string;
  issueDate: string;
  paidDate?: string;
}

const getRandomCompany = (): Company => {
  const randomIndex = Math.floor(Math.random() * companies.length);
  return companies[randomIndex];
};

const getRandomDate = (start: Date, end: Date): string => {
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0];
};

export const generateMockInvoices = (count: number): Invoice[] => {
  const invoices: Invoice[] = [];
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);
  
  const twoMonthsFromNow = new Date();
  twoMonthsFromNow.setMonth(today.getMonth() + 2);

  for (let i = 0; i < count; i++) {
    const company = getRandomCompany();
    const issueDate = getRandomDate(sixMonthsAgo, today);
    const dueDate = getRandomDate(new Date(issueDate), twoMonthsFromNow);
    const isPaid = Math.random() > 0.5;
    
    invoices.push({
      id: `invoice-${i + 1}`,
      companyId: company.id,
      amount: Math.floor(Math.random() * 1000) + 50, // Random amount between 50-1050 TL
      dueDate,
      isPaid,
      customerName: 'John Doe',
      customerNumber: `C${100000 + i}`,
      invoiceNumber: `INV-${2023000 + i}`,
      issueDate,
      paidDate: isPaid ? getRandomDate(new Date(issueDate), today) : undefined
    });
  }
  
  return invoices;
};

export const mockInvoices: Invoice[] = generateMockInvoices(20);
