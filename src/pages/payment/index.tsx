import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { companies, InvoiceType } from '../../data/invoiceTypes';
import { mockInvoices } from '../../data/invoices';

export default function Payment() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<InvoiceType>('telecom');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [customerNumber, setCustomerNumber] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const filteredCompanies = companies.filter(company => company.type === activeTab);

  const handleLookup = () => {
    setError('');
    
    if (!selectedCompany || !customerNumber) {
      setError('Please select a company and enter your customer number');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      const invoice = mockInvoices.find(inv => 
        inv.companyId === selectedCompany && 
        inv.customerNumber === customerNumber &&
        !inv.isPaid
      );
      
      if (invoice) {
        setInvoiceNumber(invoice.invoiceNumber);
        setAmount(invoice.amount.toString());
      } else {
        setError('No unpaid invoice found for this customer number');
        setInvoiceNumber('');
        setAmount('');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handlePayment = () => {
    setError('');
    
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setError('Please fill in all payment details');
      return;
    }
    
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number must be 16 digits');
      return;
    }
    
    if (cvv.length < 3) {
      setError('CVV must be at least 3 digits');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      
      const invoiceIndex = mockInvoices.findIndex(inv => 
        inv.invoiceNumber === invoiceNumber && !inv.isPaid
      );
      
      if (invoiceIndex !== -1) {
        mockInvoices[invoiceIndex].isPaid = true;
        mockInvoices[invoiceIndex].paidDate = new Date().toISOString().split('T')[0];
      }
    }, 2000);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setSelectedCompany('');
    setCustomerNumber('');
    setInvoiceNumber('');
    setAmount('');
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    navigate('/history');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pay Invoice</h1>
      
      <Tabs defaultValue="telecom" className="space-y-4" onValueChange={(value) => setActiveTab(value as InvoiceType)}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="telecom">Telecom</TabsTrigger>
          <TabsTrigger value="electric">Electric</TabsTrigger>
          <TabsTrigger value="water">Water</TabsTrigger>
        </TabsList>
        
        <TabsContent value="telecom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Telecom Invoice Payment</CardTitle>
              <CardDescription>Pay your telecom bills from Turkcell, Vodafone, and more</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCompanies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerNumber">Customer Number</Label>
                <Input 
                  id="customerNumber" 
                  placeholder="Enter your customer number" 
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                />
              </div>
              
              <Button onClick={handleLookup} disabled={isLoading}>
                {isLoading ? 'Looking up...' : 'Find Invoice'}
              </Button>
              
              {error && <p className="text-sm text-red-500">{error}</p>}
              
              {invoiceNumber && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input id="invoiceNumber" value={invoiceNumber} readOnly />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" value={`${amount} ₺`} readOnly />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input 
                      id="cardName" 
                      placeholder="John Doe" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input 
                        id="expiryDate" 
                        placeholder="MM/YY" 
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123" 
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handlePayment} 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Pay Now'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="electric" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Electric Invoice Payment</CardTitle>
              <CardDescription>Pay your electricity bills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Same structure as telecom tab */}
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCompanies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerNumber">Customer Number</Label>
                <Input 
                  id="customerNumber" 
                  placeholder="Enter your customer number" 
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                />
              </div>
              
              <Button onClick={handleLookup} disabled={isLoading}>
                {isLoading ? 'Looking up...' : 'Find Invoice'}
              </Button>
              
              {error && <p className="text-sm text-red-500">{error}</p>}
              
              {invoiceNumber && (
                <div className="space-y-4 pt-4 border-t">
                  {/* Same payment form as telecom tab */}
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input id="invoiceNumber" value={invoiceNumber} readOnly />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" value={`${amount} ₺`} readOnly />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input 
                      id="cardName" 
                      placeholder="John Doe" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input 
                        id="expiryDate" 
                        placeholder="MM/YY" 
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123" 
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handlePayment} 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Pay Now'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="water" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Water Invoice Payment</CardTitle>
              <CardDescription>Pay your water bills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Same structure as telecom tab */}
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCompanies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerNumber">Customer Number</Label>
                <Input 
                  id="customerNumber" 
                  placeholder="Enter your customer number" 
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                />
              </div>
              
              <Button onClick={handleLookup} disabled={isLoading}>
                {isLoading ? 'Looking up...' : 'Find Invoice'}
              </Button>
              
              {error && <p className="text-sm text-red-500">{error}</p>}
              
              {invoiceNumber && (
                <div className="space-y-4 pt-4 border-t">
                  {/* Same payment form as telecom tab */}
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input id="invoiceNumber" value={invoiceNumber} readOnly />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" value={`${amount} ₺`} readOnly />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input 
                      id="cardName" 
                      placeholder="John Doe" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input 
                        id="expiryDate" 
                        placeholder="MM/YY" 
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123" 
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handlePayment} 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Pay Now'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Success Dialog */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Successful!</AlertDialogTitle>
            <AlertDialogDescription>
              Your payment has been processed successfully. A receipt has been sent to your email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSuccessClose}>
              View Payment History
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
