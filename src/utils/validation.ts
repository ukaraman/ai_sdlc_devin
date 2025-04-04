
export const validateIBAN = (iban: string): boolean => {
  const ibanRegex = /^[A-Z0-9]{15,34}$/;
  return ibanRegex.test(iban.replace(/\s/g, '').toUpperCase());
};

export const validateBIC = (bic: string): boolean => {
  const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  return bicRegex.test(bic.replace(/\s/g, '').toUpperCase());
};

export const validateAmount = (amount: string, currency: string): boolean => {
  const numAmount = Number(amount);
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return false;
  }
  
  const decimalParts = amount.split('.');
  if (decimalParts.length > 1 && decimalParts[1].length > 2) {
    return false;
  }
  
  const maxLimits: Record<string, number> = {
    'EUR': 1000000,
    'USD': 1000000,
    'GBP': 1000000
  };
  
  return numAmount <= maxLimits[currency];
};

export const isEuropeanCountry = (country: string): boolean => {
  const europeanCountries = [
    'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
    'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
    'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands',
    'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden'
  ];
  
  return europeanCountries.includes(country);
};

export const validateReference = (reference: string): boolean => {
  const allowedChars = /^[0-9a-zA-Z\/\-\?:\(\)\.,'\+ !#$%&\*=^_`\{\|\}~";<>@\[\\\]]+$/;
  return reference === '' || allowedChars.test(reference);
};

export const validateTransferForm = (formData: {
  senderName: string;
  senderAccount: string;
  recipientName: string;
  recipientAccount: string;
  amount: string;
  currency: string;
  country: string;
  bicCode: string;
  reference: string;
}): { isValid: boolean; error?: string } => {
  if (!formData.senderName || !formData.senderAccount) {
    return { isValid: false, error: "Sender information is required" };
  }
  
  if (!validateIBAN(formData.senderAccount)) {
    return { isValid: false, error: "Invalid sender IBAN format" };
  }
  
  if (!formData.recipientName || !formData.recipientAccount) {
    return { isValid: false, error: "Recipient information is required" };
  }
  
  if (!validateIBAN(formData.recipientAccount)) {
    return { isValid: false, error: "Invalid recipient IBAN format" };
  }
  
  if (!formData.bicCode) {
    return { isValid: false, error: "BIC/SWIFT code is required" };
  }
  
  if (!validateBIC(formData.bicCode)) {
    return { isValid: false, error: "Invalid BIC/SWIFT code format" };
  }
  
  if (!formData.amount) {
    return { isValid: false, error: "Amount is required" };
  }
  
  if (!validateAmount(formData.amount, formData.currency)) {
    return { isValid: false, error: "Invalid amount for selected currency" };
  }
  
  if (!formData.country) {
    return { isValid: false, error: "Destination country is required" };
  }
  
  if (!isEuropeanCountry(formData.country)) {
    return { isValid: false, error: "Only European countries are supported" };
  }
  
  if (formData.reference && !validateReference(formData.reference)) {
    return { isValid: false, error: "Reference contains invalid characters" };
  }
  
  return { isValid: true };
};
