# AgriChain - Farm to Fork Transparency

A full-stack-ready frontend for an agricultural supply chain web application built with React, TypeScript, and Tailwind CSS. AgriChain provides complete transparency from farm to fork using blockchain technology.

## 🌱 Features

### Multi-Role Dashboard System
- **Farmer Dashboard**: Upload crop batches, generate QR codes, track harvest details
- **Transporter Dashboard**: Manage logistics, update transport conditions, track deliveries
- **Retailer Dashboard**: Inventory management, pricing controls, stock tracking
- **Consumer Dashboard**: Product verification, QR code scanning, supply chain tracking

### Core Functionality
- ✅ Role-based authentication and routing
- ✅ QR code generation and scanning
- ✅ Blockchain integration hooks (ethers.js ready)
- ✅ Responsive design with agricultural theme
- ✅ Complete supply chain tracking
- ✅ Real-time status updates
- ✅ Modern UI with shadcn/ui components

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 🔐 Authentication

The app includes a complete authentication system with role-based access:

### Demo Login
Use any email and password with one of these roles:
- **Farmer**: Access crop management and batch creation
- **Transporter**: Manage logistics and delivery tracking  
- **Retailer**: Control inventory and pricing
- **Consumer**: Verify products and scan QR codes

### Routes
- `/login` - Authentication page
- `/farmer` - Farmer dashboard
- `/transporter` - Transporter dashboard
- `/retailer` - Retailer dashboard
- `/consumer` - Consumer dashboard
- `/profile` - User profile management

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Routing**: React Router v6
- **State Management**: Context API
- **QR Codes**: qrcode.react, react-qr-reader
- **Blockchain Ready**: ethers.js integration hooks

### Project Structure
```
src/
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── Layout.tsx     # Main layout wrapper
│   ├── Navbar.tsx     # Navigation header
│   └── Sidebar.tsx    # Role-based sidebar
├── contexts/          # React Context providers
│   └── AuthContext.tsx
├── pages/             # Route components
│   ├── Login.tsx
│   ├── FarmerDashboard.tsx
│   ├── TransporterDashboard.tsx
│   ├── RetailerDashboard.tsx
│   ├── ConsumerDashboard.tsx
│   └── Profile.tsx
├── utils/             # Utility functions
│   └── blockchain.js  # Blockchain integration hooks
└── hooks/             # Custom React hooks
```

## 🔗 Blockchain Integration

The app includes placeholder functions for blockchain integration:

```javascript
// utils/blockchain.js
export async function connectWallet() { /* ethers.js implementation */ }
export async function addBatchToChain(batchData) { /* Smart contract call */ }
export async function getBatchDetails(batchId) { /* Blockchain query */ }
export async function updateTransportStatus(batchId, data) { /* Update on-chain */ }
```

### Ready for Integration
- Smart contract calls with ethers.js
- Hardhat development environment
- MetaMask wallet connection
- On-chain data verification

## 🎨 Design System

Agricultural-themed design with:
- **Green color palette**: Representing nature and growth
- **Rounded corners**: Modern, friendly appearance  
- **Soft shadows**: Depth and elevation
- **Responsive layout**: Mobile-first approach
- **Semantic tokens**: Consistent design language

## 📱 Mobile Support

Fully responsive design with:
- Touch-friendly navigation
- Collapsible sidebar
- Mobile-optimized forms
- QR scanner integration ready

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 🔧 Customization

### Adding New Features
1. Create components in `src/components/`
2. Add routes in `src/App.tsx`
3. Update navigation in `src/components/Sidebar.tsx`
4. Implement blockchain calls in `src/utils/blockchain.js`

### Styling
- Edit design tokens in `src/index.css`
- Update component variants in `src/components/ui/`
- Customize Tailwind config in `tailwind.config.ts`

## 📋 Next Steps

### Blockchain Integration
1. Set up Hardhat development environment
2. Deploy smart contracts for batch tracking
3. Implement ethers.js wallet connection
4. Add transaction confirmation flows

### Enhanced Features
- Real-time notifications
- Advanced analytics dashboard
- Multi-language support
- PDF certificate generation
- IoT sensor integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**AgriChain** - Bringing transparency and trust to the agricultural supply chain through blockchain technology.