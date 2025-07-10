# B&L Motorcycles Ltd - Full Stack Website

A complete e-commerce website for B&L Motorcycles Ltd with automated inventory synchronization, Stripe payments, and dropshipping automation.

## 🚀 Features

- **Modern Frontend**: React with Tailwind CSS, responsive design
- **Robust Backend**: Flask API with Supabase PostgreSQL database
- **Payment Processing**: Stripe integration for secure payments
- **Inventory Automation**: FTP synchronization with Bike It supplier every 2 hours
- **Dropshipping**: Automated order forwarding to suppliers
- **Webhook Support**: Ready for eBay, Facebook, and Instagram integrations
- **Smart Pricing**: Automatic pricing calculation (cost × 1.5 + £6 delivery)
- **Real-time Updates**: Live inventory and order management

## 🛠 Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Responsive design (mobile-first)

### Backend
- Python Flask REST API
- Supabase PostgreSQL database
- Stripe payment processing
- FTP client for inventory sync
- Email automation for dropshipping
- Comprehensive logging and error handling

### Infrastructure
- CapRover deployment
- GitHub version control
- Automated cron jobs for synchronization

## 📁 Project Structure

```
bl-motorcycles-ltd/
├── frontend/
│   └── bl-motorcycles-frontend/    # React application
│       ├── src/
│       │   ├── App.jsx            # Main application component
│       │   ├── App.css            # Black & gold theme styles
│       │   └── assets/            # Logo and static assets
│       ├── index.html             # HTML template
│       └── package.json           # Frontend dependencies
├── backend/
│   └── bl-motorcycles-backend/    # Flask API
│       ├── src/
│       │   ├── main_supabase.py   # Main Flask application
│       │   ├── routes/            # API endpoints
│       │   ├── services/          # Business logic services
│       │   └── models/            # Database models
│       ├── requirements.txt       # Python dependencies
│       ├── setup_cron.sh         # Cron job setup script
│       └── ftp_sync_cron.py      # FTP synchronization script
├── .env                          # Environment variables
└── README.md                     # This file
```

## 🔧 Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/jonnyallum/blmotorcyclesltd.git
cd blmotorcyclesltd
```

### 2. Backend Setup
```bash
cd backend/bl-motorcycles-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend/bl-motorcycles-frontend
npm install
```

### 4. Environment Configuration
Copy `.env.example` to `.env` and configure:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# FTP Configuration (Bike It)
FTP_HOST=your_ftp_host
FTP_USERNAME=your_ftp_username
FTP_PASSWORD=your_ftp_password

# Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USERNAME=your_email
SMTP_PASSWORD=your_email_password
```

## 🚀 Running the Application

### Development Mode

1. **Start Backend**:
```bash
cd backend/bl-motorcycles-backend
source venv/bin/activate
python src/main_supabase.py
```
Backend runs on: http://localhost:5001

2. **Start Frontend**:
```bash
cd frontend/bl-motorcycles-frontend
npm run dev
```
Frontend runs on: http://localhost:5173

### Production Deployment

The application is configured for CapRover deployment with automatic builds and environment variable management.

## 📊 API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/categories` - Get product categories
- `POST /api/sync-products` - Manual inventory sync

### Orders
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/orders` - Create new order
- `GET /api/orders` - List orders

### Webhooks
- `POST /api/webhook/stripe` - Stripe payment webhooks
- `POST /api/webhook/ebay` - eBay integration (placeholder)
- `POST /api/webhook/facebook` - Facebook integration (placeholder)
- `POST /api/webhook/instagram` - Instagram integration (placeholder)

### System
- `GET /api/health` - Health check
- `GET /api/info` - API information

## ⚙️ Automation Features

### FTP Synchronization
- Runs every 2 hours via cron job
- Downloads latest inventory from Bike It
- Updates product database with new items and stock levels
- Applies pricing formula: `selling_price = cost_price × 1.5 + 6`

### Dropshipping Automation
- Automatically forwards orders to suppliers via email
- Sends order confirmations to customers
- Tracks order status and updates

### Error Handling & Retry Logic
- Comprehensive logging system
- Automatic retry for failed operations
- Failed operation queue for manual review

## 🎨 Design Theme

The website features a **black and gold** theme matching the B&L Motorcycles brand:
- Primary: Gold (#FFD700)
- Background: Black (#000000)
- Accent: Dark gray (#1a1a1a)
- Text: White/Light gray

## 📱 Responsive Design

Fully responsive design supporting:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔐 Security Features

- Environment variable protection
- Stripe webhook signature verification
- CORS configuration
- Input validation and sanitization
- Secure database connections

## 📈 Monitoring & Logging

- Comprehensive logging for all operations
- Error tracking and reporting
- Performance monitoring
- Failed operation queue management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical support or business inquiries:
- **Email**: brett@blmotorcyclesltd.co.uk
- **Phone**: 07881274193
- **Company**: B&L Motorcycles Ltd (Company No: 14122962)

## 📄 License

© 2024 B&L Motorcycles Ltd. All rights reserved.

---

**Built with ❤️ for the motorcycle community**

