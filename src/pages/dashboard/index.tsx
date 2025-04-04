import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockInvoices } from '../../data/invoices';
import { companies, InvoiceType } from '../../data/invoiceTypes';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<InvoiceType | 'all'>('all');
  
  const filteredInvoices = activeTab === 'all' 
    ? mockInvoices 
    : mockInvoices.filter(invoice => {
        const company = companies.find(c => c.id === invoice.companyId);
        return company?.type === activeTab;
      });
  
  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidInvoices = filteredInvoices.filter(invoice => invoice.isPaid);
  const unpaidInvoices = filteredInvoices.filter(invoice => !invoice.isPaid);
  
  const invoicesByType = [
    { name: 'Telecom', value: mockInvoices.filter(inv => companies.find(c => c.id === inv.companyId)?.type === 'telecom').length },
    { name: 'Electric', value: mockInvoices.filter(inv => companies.find(c => c.id === inv.companyId)?.type === 'electric').length },
    { name: 'Water', value: mockInvoices.filter(inv => companies.find(c => c.id === inv.companyId)?.type === 'water').length },
    { name: 'Other', value: mockInvoices.filter(inv => companies.find(c => c.id === inv.companyId)?.type === 'other').length }
  ];
  
  const invoicesByCompany = companies.map(company => ({
    name: company.name,
    count: mockInvoices.filter(inv => inv.companyId === company.id).length
  }));
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <Tabs defaultValue="all" className="space-y-4" onValueChange={(value) => setActiveTab(value as InvoiceType | 'all')}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="telecom">Telecom</TabsTrigger>
          <TabsTrigger value="electric">Electric</TabsTrigger>
          <TabsTrigger value="water">Water</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredInvoices.length}</div>
                <p className="text-xs text-muted-foreground">
                  {paidInvoices.length} paid, {unpaidInvoices.length} unpaid
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAmount.toLocaleString('tr-TR')} ₺</div>
                <p className="text-xs text-muted-foreground">
                  For all {filteredInvoices.length} invoices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unpaid Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('tr-TR')} ₺
                </div>
                <p className="text-xs text-muted-foreground">
                  From {unpaidInvoices.length} unpaid invoices
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Invoices by Type</CardTitle>
                <CardDescription>Distribution of invoices by type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={invoicesByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {invoicesByType.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Invoices by Company</CardTitle>
                <CardDescription>Number of invoices per company</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={invoicesByCompany}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="telecom" className="space-y-4">
          {/* Same structure as "all" tab but with filtered data */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredInvoices.length}</div>
                <p className="text-xs text-muted-foreground">
                  {paidInvoices.length} paid, {unpaidInvoices.length} unpaid
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAmount.toLocaleString('tr-TR')} ₺</div>
                <p className="text-xs text-muted-foreground">
                  For all {filteredInvoices.length} invoices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unpaid Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('tr-TR')} ₺
                </div>
                <p className="text-xs text-muted-foreground">
                  From {unpaidInvoices.length} unpaid invoices
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="electric" className="space-y-4">
          {/* Same structure as "all" tab but with filtered data */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredInvoices.length}</div>
                <p className="text-xs text-muted-foreground">
                  {paidInvoices.length} paid, {unpaidInvoices.length} unpaid
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAmount.toLocaleString('tr-TR')} ₺</div>
                <p className="text-xs text-muted-foreground">
                  For all {filteredInvoices.length} invoices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unpaid Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('tr-TR')} ₺
                </div>
                <p className="text-xs text-muted-foreground">
                  From {unpaidInvoices.length} unpaid invoices
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="water" className="space-y-4">
          {/* Same structure as "all" tab but with filtered data */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredInvoices.length}</div>
                <p className="text-xs text-muted-foreground">
                  {paidInvoices.length} paid, {unpaidInvoices.length} unpaid
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAmount.toLocaleString('tr-TR')} ₺</div>
                <p className="text-xs text-muted-foreground">
                  For all {filteredInvoices.length} invoices
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unpaid Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('tr-TR')} ₺
                </div>
                <p className="text-xs text-muted-foreground">
                  From {unpaidInvoices.length} unpaid invoices
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
