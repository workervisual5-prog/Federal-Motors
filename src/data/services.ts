import { whatsappMessages } from '@/lib/contact';

export interface Service {
  id: string;
  title: string;
  summary: string;
  description: string;
  benefits: string[];
  steps: string[];
  cta: { label: string; href: string; external?: boolean };
  whatsapp?: string;
}

// Copy is limited to what Federal Motors has described. No guarantees, rates or partnerships.
export const services: Service[] = [
  {
    id: 'buy',
    title: 'Buy a car',
    summary: 'New, used and imported vehicles across economy, family and luxury segments.',
    description:
      'Browse our current stock of pickups, SUVs, hatchbacks and luxury cars, each listed with the details that have been confirmed. New vehicles are subject to market and dealer availability.',
    benefits: ['Real vehicles with stock references', 'Help comparing options within your budget', 'Inspection and document guidance before you commit'],
    steps: ['Browse the inventory or tell us your budget', 'View the car at our PECHS showroom', 'Agree the deal and complete documentation together'],
    cta: { label: 'Browse inventory', href: '/inventory' },
  },
  {
    id: 'sell',
    title: 'Sell your car',
    summary: 'Market-based valuation guidance and a straightforward sale.',
    description:
      'We buy used cars directly from owners and help others sell to buyers in our network. You get pricing guidance based on current Karachi market demand, and support with the transfer paperwork.',
    benefits: ['Valuation guidance based on the local market', 'One point of contact for buyers and paperwork', 'Ownership-transfer support'],
    steps: ['Share your car’s details', 'We inspect the car and discuss its market value', 'Agree a price, then complete payment and transfer'],
    cta: { label: 'Get a valuation', href: '/sell-your-car' },
  },
  {
    id: 'exchange',
    title: 'Car exchange',
    summary: 'Trade in your current car against one from our stock.',
    description:
      'Want to upgrade or change your car? We assess your current vehicle and arrange an exchange against a car from our inventory, so you deal with one showroom instead of two separate sales.',
    benefits: ['One transaction instead of two', 'Your car is valued after an in-person inspection', 'Paperwork handled for both vehicles'],
    steps: ['Tell us about your car and the one you want', 'Bring your car in for inspection', 'Receive an exchange offer and settle any difference'],
    cta: { label: 'Request an exchange valuation', href: '/sell-your-car?type=exchange#sell-form' },
    whatsapp: whatsappMessages.exchange,
  },
  {
    id: 'consignment',
    title: 'Consignment sales',
    summary: 'We present and sell your car on your behalf.',
    description:
      'List your car with Federal Motors and we manage buyer inquiries, vehicle presentation, negotiation and sale coordination for you — useful if you want a market price without the hassle of dealing with buyers yourself.',
    benefits: ['We handle calls, viewings and negotiation', 'Your car is shown alongside our showroom stock', 'You approve the final price'],
    steps: ['Agree the listing terms and asking price', 'We present the car and manage inquiries', 'You approve the sale; we coordinate payment and transfer'],
    cta: { label: 'Ask about consignment', href: '/sell-your-car?type=consignment#sell-form' },
  },
  {
    id: 'sourcing',
    title: 'Imported vehicle sourcing',
    summary: 'Specific vehicles sourced to order, including imports.',
    description:
      'Looking for a model that isn’t in our stock? Tell us the make, model, year range and budget, and we’ll search the local market or arrange an import. Imports are subject to applicable regulations, duties, availability and delivery timelines.',
    benefits: ['Access beyond our current showroom stock', 'Guidance on import costs and timelines', 'Inspection and documentation support on arrival'],
    steps: ['Share the car you want and your budget', 'We search and come back with options', 'Confirm the vehicle and complete purchase and paperwork'],
    cta: { label: 'Request a vehicle', href: '#sourcing-form' },
    whatsapp: whatsappMessages.sourcing,
  },
  {
    id: 'financing',
    title: 'Financing assistance',
    summary: 'Help applying for conventional or Islamic car financing.',
    description:
      'We guide you on eligibility and documents and help you apply for car financing through banks in Karachi, for both new and used cars. Approval and terms are decided by the bank.',
    benefits: ['Conventional and Islamic options', 'Document checklists and application support', 'Vehicle valuation coordination with the bank'],
    steps: ['Choose a vehicle', 'Prepare documents with our guidance', 'Apply to the bank and complete the purchase once approved'],
    cta: { label: 'Explore financing', href: '/financing' },
  },
  {
    id: 'inspection',
    title: 'Vehicle inspection',
    summary: 'Pre-purchase inspection coordinated before you commit.',
    description:
      'Before you buy, we coordinate a pre-purchase inspection so you know the vehicle’s condition. Where a car has an auction sheet, we help you verify it.',
    benefits: ['Clear picture of condition before payment', 'Auction-sheet verification where available', 'Fewer surprises after purchase'],
    steps: ['Choose the car you’re interested in', 'We arrange the inspection', 'Review the findings before deciding'],
    cta: { label: 'Ask about an inspection', href: '/contact' },
  },
  {
    id: 'documentation',
    title: 'Documentation & transfer',
    summary: 'Document verification and ownership-transfer guidance.',
    description:
      'Car paperwork in Pakistan involves registration books, biometric verification and Excise & Taxation transfer. We help verify the documents and guide you through the transfer process to reduce risk for both buyer and seller.',
    benefits: ['Document verification before payment', 'Biometric and transfer guidance', 'Reduced risk of paperwork problems later'],
    steps: ['We review the vehicle’s documents', 'Biometric verification is arranged', 'The transfer is completed in the buyer’s name'],
    cta: { label: 'Ask about documentation', href: '/contact' },
  },
  {
    id: 'auction',
    title: 'Auction & bank-repossessed vehicles',
    summary: 'Assistance with bank-repossessed and auction vehicles.',
    description:
      'Bank-repossessed and auction vehicles can offer value, but they need careful checking. We help you assess these vehicles and their documentation before you commit.',
    benefits: ['Condition and document checks', 'Guidance on the purchase process', 'Support with transfer afterwards'],
    steps: ['Tell us what you’re looking for', 'We check available vehicles and paperwork', 'Proceed with guidance on purchase and transfer'],
    cta: { label: 'Enquire on WhatsApp', href: '#', external: true },
    whatsapp: 'Assalamualaikum Federal Motors, I would like information about bank-repossessed or auction vehicles.',
  },
  {
    id: 'fleet',
    title: 'Corporate & fleet',
    summary: 'Multiple-vehicle requirements for businesses.',
    description:
      'Need several vehicles for your company? Tell us your requirements and we’ll help source suitable cars or pickups and coordinate documentation.',
    benefits: ['One contact for multiple vehicles', 'Sourcing to your specification', 'Documentation coordinated across the order'],
    steps: ['Share your fleet requirements', 'We propose suitable vehicles', 'Agree terms and coordinate delivery and paperwork'],
    cta: { label: 'Enquire on WhatsApp', href: '#', external: true },
    whatsapp: 'Assalamualaikum Federal Motors, I would like to discuss a corporate or fleet vehicle requirement.',
  },
];
