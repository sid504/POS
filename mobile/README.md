# ModernPOS Mobile App

A React Native mobile application for the ModernPOS system, providing full POS functionality on iOS and Android devices.

## Features

- **Complete POS System**: Full point-of-sale functionality optimized for mobile
- **Product Management**: Browse and search products with categories
- **Shopping Cart**: Add, remove, and modify cart items
- **Customer Management**: Select customers and track loyalty points
- **Checkout Process**: Complete transactions with payment processing
- **Responsive Design**: Optimized for both phones and tablets
- **Offline Capability**: Works without internet connection
- **Real-time Updates**: Sync with web version when connected

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI: `npm install -g expo-cli`
- For iOS: Xcode (Mac only)
- For Android: Android Studio

### Setup
1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on device/simulator:
   - **iOS**: `npm run ios` (Mac only)
   - **Android**: `npm run android`
   - **Web**: `npm run web`

## Building for Production

### iOS (App Store)
```bash
expo build:ios
```

### Android (Google Play Store)
```bash
expo build:android
```

## Demo Accounts

The app includes demo accounts for testing:

- **Admin**: admin@example.com (password: password)
- **Manager**: john@example.com (password: password)
- **Cashier**: jane@example.com (password: password)

## App Structure

```
mobile/
├── App.tsx                 # Main app component
├── package.json           # Dependencies and scripts
├── app.json              # Expo configuration
├── assets/               # Images and icons
└── README.md            # This file
```

## Key Components

- **LoginScreen**: User authentication
- **POSScreen**: Main point-of-sale interface
- **ProductCard**: Individual product display
- **CartItem**: Shopping cart item component
- **Customer Modal**: Customer selection interface

## Features Overview

### 🔐 Authentication
- Secure login system
- Role-based access control
- Demo accounts for testing

### 🛍️ Product Management
- Product grid with images
- Category filtering
- Search functionality
- Stock level indicators

### 🛒 Shopping Cart
- Add/remove items
- Quantity controls
- Real-time total calculation
- Customer selection

### 💳 Checkout
- Tax calculation
- Payment processing simulation
- Receipt generation
- Transaction completion

### 👥 Customer Management
- Customer selection
- Loyalty points display
- Customer information

## Customization

The app can be customized by modifying:

- **Colors**: Update the color scheme in styles
- **Products**: Modify the mockProducts array
- **Features**: Add new screens and functionality
- **Branding**: Update app name, icon, and splash screen

## Deployment

### App Store (iOS)
1. Build the app: `expo build:ios`
2. Download the .ipa file
3. Upload to App Store Connect
4. Submit for review

### Google Play Store (Android)
1. Build the app: `expo build:android`
2. Download the .apk/.aab file
3. Upload to Google Play Console
4. Submit for review

## Support

For support and questions:
- Check the main ModernPOS documentation
- Review React Native and Expo documentation
- Contact the development team

## License

This mobile app is part of the ModernPOS system and follows the same licensing terms.