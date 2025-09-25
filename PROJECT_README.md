# Baby Growth Tracker - React Native Project

A comprehensive React Native application built with Expo SDK for tracking baby growth with WHO growth standards integration.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- For iOS development: Xcode and iOS Simulator
- For Android development: Android Studio and Android Emulator

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd BabyGrowthApp

# Install dependencies
npm install

# Start the development server
npm start
```

## 📱 Available Scripts

### Development Scripts

```bash
# Start Expo development server
npm start

# Start with dev client
npm run start:dev

# Start with tunnel (for external device testing)
npm run start:tunnel

# Platform-specific starts
npm run android    # Start Android
npm run ios        # Start iOS
npm run web        # Start Web
```

### Build Scripts

```bash
# Build for all platforms
npm run build

# Platform-specific builds
npm run build:android
npm run build:ios

# Prebuild (generate native code)
npm run prebuild
npm run prebuild:clean  # Clean prebuild
```

### Quality Assurance Scripts

```bash
# Run tests
npm test                    # Run tests once
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage

# Linting
npm run lint              # Fix linting issues
npm run lint:check        # Check linting without fixing

# Type checking
npm run typecheck         # Check TypeScript types

# Code formatting
npm run format            # Format code with Prettier
npm run format:check      # Check formatting without fixing

# Validate everything
npm run validate          # Run typecheck + lint + tests
```

### Utility Scripts

```bash
# Clean cache and restart
npm run clean

# Reset and clear cache
expo r -c
```

## 🏗️ Project Structure

```
BabyGrowthApp/
├── src/
│   ├── components/          # React components
│   │   ├── BabySetup.tsx
│   │   ├── MainScreen.tsx
│   │   ├── GrowthChart.tsx
│   │   ├── MeasurementForm.tsx
│   │   ├── MeasurementHistory.tsx
│   │   ├── Header.tsx
│   │   ├── LoadingScreen.tsx
│   │   └── BabyProfileEdit.tsx
│   ├── utils/              # Utility functions
│   │   ├── storage.ts
│   │   └── calculations.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── data/               # Static data
│   │   └── whoGrowthData.ts
│   └── __tests__/          # Test files
│       ├── setup.ts
│       └── calculations.test.ts
├── assets/                 # Static assets
├── App.tsx                # Main app component
├── app.json               # Expo configuration
├── eas.json              # EAS Build configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest test configuration
├── eslint.config.js      # ESLint configuration
├── .prettierrc.js        # Prettier configuration
└── babel.config.js       # Babel configuration
```

## 🛠️ Technology Stack

### Core Framework
- **React Native**: 0.76.9
- **Expo SDK**: ~54.0.0 (pinned)
- **TypeScript**: ^5.1.3

### UI & Styling
- **Expo Vector Icons**: ^14.0.4
- **Expo Linear Gradient**: ~14.0.2
- **React Native SVG**: ^15.8.0
- **React Native Chart Kit**: ^6.12.0

### State & Data Management
- **React Hook Form**: ^7.63.0
- **AsyncStorage**: 1.23.1
- **Date-fns**: ^4.1.0

### Development Tools
- **Jest**: ^29.2.1 (Testing)
- **ESLint**: ^8.53.0 (Linting)
- **Prettier**: ^3.0.3 (Code formatting)
- **TypeScript**: ^5.1.3 (Type checking)

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Files
- Unit tests for calculations and utilities
- Component testing setup
- Mock configurations for React Native modules

## 📝 Code Quality

### ESLint Configuration
- TypeScript support
- React and React Native rules
- Automatic fixing on save

### Prettier Configuration
- Consistent code formatting
- Integrated with ESLint
- Pre-commit formatting

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured
- Comprehensive type checking

## 🚀 Deployment

### Development Build
```bash
# Create development build
eas build --profile development --platform all
```

### Production Build
```bash
# Create production build
eas build --profile production --platform all
```

### Preview Build
```bash
# Create preview build for testing
eas build --profile preview --platform all
```

## 📱 Features

### Baby Profile Management
- Create and edit baby profiles
- Support for multiple babies
- Birth date and growth tracking

### Growth Tracking
- Weight, height, and head circumference tracking
- WHO growth standards integration
- Percentile calculations
- Visual growth charts

### Data Management
- Local data storage with AsyncStorage
- Data export/import functionality
- Measurement history and editing

### Charts & Analytics
- Interactive growth charts
- WHO percentile curves
- Growth trend analysis
- Responsive chart design

## 🔧 Configuration

### Environment Setup
1. Install Node.js and npm
2. Install Expo CLI globally
3. Install project dependencies
4. Configure development environment

### Platform Setup

#### iOS Development
- Install Xcode from Mac App Store
- Install iOS Simulator
- Configure code signing (for device testing)

#### Android Development
- Install Android Studio
- Set up Android SDK
- Create Android Virtual Device (AVD)

### Web Development
- No additional setup required
- Runs in browser with Metro bundler

## 📚 Documentation

### API Reference
- Component props and interfaces
- Utility function documentation
- Type definitions

### WHO Growth Standards
- LMS (Lambda, Mu, Sigma) parameter implementation
- Percentile calculation algorithms
- Growth curve generation

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npm run clean
   expo r -c
   ```

2. **TypeScript errors**
   ```bash
   npm run typecheck
   ```

3. **Linting issues**
   ```bash
   npm run lint
   ```

4. **Test failures**
   ```bash
   npm run test:coverage
   ```

### Platform-Specific Issues

#### iOS
- Ensure Xcode is updated
- Check iOS Simulator version
- Verify bundle identifier

#### Android
- Check Android SDK installation
- Verify AVD configuration
- Check package name

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run quality checks: `npm run validate`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Check the troubleshooting section
- Review the documentation
- Create an issue in the repository

---

**Happy coding! 👶📱**
