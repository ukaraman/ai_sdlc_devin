import { useState } from 'react'
import { Toaster } from './components/ui/toaster'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { useToast } from './hooks/use-toast'
import { validateTransferForm } from './utils/validation'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert'

interface TransferFormData {
  senderName: string;
  senderAccount: string;
  recipientName: string;
  recipientAccount: string;
  amount: string;
  currency: string;
  country: string;
  bicCode: string;
  reference: string;
}

function App() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<TransferFormData>({
    senderName: '',
    senderAccount: '',
    recipientName: '',
    recipientAccount: '',
    amount: '',
    currency: 'EUR',
    country: '',
    bicCode: '',
    reference: ''
  })
  
  const [formErrors, setFormErrors] = useState<string | null>(null)
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false)
  const [transferHistory, setTransferHistory] = useState<TransferFormData[]>([])

  const europeanCountries = [
    'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
    'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
    'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands',
    'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormErrors(null) // Clear errors when user makes changes
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setFormErrors(null) // Clear errors when user makes changes
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTransferSuccess(false)
    
    const validationResult = validateTransferForm(formData)
    
    if (!validationResult.isValid) {
      setFormErrors(validationResult.error || "Validation failed")
      toast({
        title: "Error",
        description: validationResult.error || "Please check your input",
        variant: "destructive"
      })
      return
    }
    
    setFormErrors(null)
    
    setTransferHistory(prev => [...prev, { ...formData }])
    
    setTransferSuccess(true)
    toast({
      title: "Transfer Initiated",
      description: `${formData.currency} ${formData.amount} to ${formData.recipientName} in ${formData.country}`,
    })
    
    setFormData({
      senderName: '',
      senderAccount: '',
      recipientName: '',
      recipientAccount: '',
      amount: '',
      currency: 'EUR',
      country: '',
      bicCode: '',
      reference: ''
    })
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Swift Money Transfer</h1>
      
      <Tabs defaultValue="transfer" className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transfer">New Transfer</TabsTrigger>
          <TabsTrigger value="history">Transfer History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transfer">
          <Card>
            <CardHeader>
              <CardTitle>International Money Transfer</CardTitle>
              <CardDescription>
                Send money to European countries using SWIFT/CBPR+ network.
                Only EUR, USD, and GBP currencies are supported.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {formErrors && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{formErrors}</AlertDescription>
                </Alert>
              )}
              
              {transferSuccess && (
                <Alert className="mb-6">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Your transfer has been initiated successfully.</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        value={formData.currency} 
                        onValueChange={(value) => handleSelectChange('currency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input 
                        id="amount" 
                        name="amount" 
                        type="number" 
                        placeholder="Enter amount" 
                        value={formData.amount}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Sender Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="senderName">Full Name</Label>
                        <Input 
                          id="senderName" 
                          name="senderName" 
                          placeholder="Enter sender's full name" 
                          value={formData.senderName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="senderAccount">Account Number (IBAN)</Label>
                        <Input 
                          id="senderAccount" 
                          name="senderAccount" 
                          placeholder="Enter IBAN" 
                          value={formData.senderAccount}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Recipient Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientName">Full Name</Label>
                        <Input 
                          id="recipientName" 
                          name="recipientName" 
                          placeholder="Enter recipient's full name" 
                          value={formData.recipientName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recipientAccount">Account Number (IBAN)</Label>
                        <Input 
                          id="recipientAccount" 
                          name="recipientAccount" 
                          placeholder="Enter IBAN" 
                          value={formData.recipientAccount}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bicCode">BIC/SWIFT Code</Label>
                        <Input 
                          id="bicCode" 
                          name="bicCode" 
                          placeholder="Enter BIC/SWIFT code" 
                          value={formData.bicCode}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Destination Country</Label>
                        <Select 
                          value={formData.country} 
                          onValueChange={(value) => handleSelectChange('country', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            {europeanCountries.map(country => (
                              <SelectItem key={country} value={country}>{country}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reference">Reference/Message</Label>
                    <Input 
                      id="reference" 
                      name="reference" 
                      placeholder="Optional reference or message" 
                      value={formData.reference}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">Send Money</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transfer History</CardTitle>
              <CardDescription>
                View your recent international transfers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transferHistory.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No transfer history available.
                </div>
              ) : (
                <div className="space-y-4">
                  {transferHistory.map((transfer, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{transfer.currency} {transfer.amount}</h4>
                        <span className="text-sm text-muted-foreground">To: {transfer.country}</span>
                      </div>
                      <div className="text-sm">
                        <p>Recipient: {transfer.recipientName}</p>
                        <p>Account: {transfer.recipientAccount}</p>
                        <p>BIC: {transfer.bicCode}</p>
                        {transfer.reference && <p>Reference: {transfer.reference}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Toaster />
    </div>
  )
}

export default App
