export type InvoiceType = 'telecom' | 'electric' | 'water' | 'other';

export interface Company {
  id: string;
  name: string;
  type: InvoiceType;
  logo: string;
}

export const companies: Company[] = [
  {
    id: 'turkcell',
    name: 'Turkcell',
    type: 'telecom',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Turkcell_logo.svg/1200px-Turkcell_logo.svg.png'
  },
  {
    id: 'vodafone',
    name: 'Vodafone',
    type: 'telecom',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Vodafone_icon.svg/1200px-Vodafone_icon.svg.png'
  },
  {
    id: 'turktelekom',
    name: 'Türk Telekom',
    type: 'telecom',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/T%C3%BCrk_Telekom_logo.svg/1200px-T%C3%BCrk_Telekom_logo.svg.png'
  },
  {
    id: 'ckenerji',
    name: 'CK Enerji',
    type: 'electric',
    logo: 'https://www.ckbogazici.com.tr/assets/img/logo.png'
  },
  {
    id: 'enerjisa',
    name: 'Enerjisa',
    type: 'electric',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Enerjisa_logo.svg/1200px-Enerjisa_logo.svg.png'
  },
  {
    id: 'iski',
    name: 'İSKİ',
    type: 'water',
    logo: 'https://www.iski.istanbul/web/assets/images/logo.png'
  },
  {
    id: 'aski',
    name: 'ASKİ',
    type: 'water',
    logo: 'https://www.aski.gov.tr/media/1001/aski-logo.png'
  }
];
