# Swift Money Transfer App

A React application for international money transfers following CBPR+ rules.

## Features

- Send money to European countries using SWIFT/CBPR+ network
- Support for EUR, USD, and GBP currencies
- CBPR+ compliant validation rules
- Transfer history tracking

## CBPR+ Compliance

This application implements the CBPR+ (Cross-Border Payments and Reporting Plus) rules for international money transfers, including:

- Proper account identification (IBAN)
- BIC/SWIFT code validation
- Currency restrictions (EUR, USD, GBP only)
- European country destination validation
- Reference message character validation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone <repository-url>
cd swift-money-transfer
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Fill in the transfer form with:
   - Currency and amount
   - Sender information (name and IBAN)
   - Recipient information (name, IBAN, BIC/SWIFT code)
   - Destination country (European countries only)
   - Optional reference message

2. Submit the form to initiate the transfer

3. View your transfer history in the "Transfer History" tab

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- shadcn/ui components

## Project Structure

- `src/App.tsx` - Main application component
- `src/utils/validation.ts` - CBPR+ validation rules
- `src/components/ui/` - UI components from shadcn/ui
