import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { mockInvoices } from '../../data/invoices';
import { companies, InvoiceType } from '../../data/invoiceTypes';

export default function History() {
  const [activeTab, setActiveTab] = useState<InvoiceType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const filteredInvoices = mockInvoices
    .filter(invoice => {
      if (activeTab !== 'all') {
        const company = companies.find(c => c.id === invoice.companyId);
        if (company?.type !== activeTab) return false;
      }
      
      if (searchTerm) {
        const company = companies.find(c => c.id === invoice.companyId);
        const searchLower = searchTerm.toLowerCase();
        return (
          invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
          invoice.customerNumber.toLowerCase().includes(searchLower) ||
          company?.name.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      if (a.isPaid !== b.isPaid) {
        return a.isPaid ? 1 : -1; // Unpaid first
      }
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    });
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payment History</h1>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Tabs defaultValue="all" className="w-full max-w-md" onValueChange={(value) => setActiveTab(value as InvoiceType | 'all')}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="telecom">Telecom</TabsTrigger>
            <TabsTrigger value="electric">Electric</TabsTrigger>
            <TabsTrigger value="water">Water</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 w-full max-w-md">
          <div className="flex-1">
            <Input 
              placeholder="Search by invoice number, customer, or company" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setSearchTerm('')}>Clear</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>
            View all your past and upcoming invoice payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map(invoice => {
                  const company = companies.find(c => c.id === invoice.companyId);
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img 
                            src={company?.logo} 
                            alt={company?.name} 
                            className="w-6 h-6 object-contain" 
                          />
                          {company?.name}
                        </div>
                      </TableCell>
                      <TableCell>{invoice.issueDate}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>{invoice.amount.toLocaleString('tr-TR')} ₺</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.isPaid 
                            ? 'bg-green-100 text-green-800' 
                            : new Date(invoice.dueDate) < new Date() 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.isPaid 
                            ? 'Paid' 
                            : new Date(invoice.dueDate) < new Date() 
                              ? 'Overdue' 
                              : 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell>{invoice.paidDate || '-'}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
