# Baby Growth Tracker - React Native App

A production-quality React Native application for tracking baby growth measurements with WHO percentile charts and comprehensive data visualization.

## 🎯 Features

### Core Functionality
- **Baby Profile Management**: Create and manage baby profiles with birth information
- **Measurement Tracking**: Record weight, height, and head circumference with date tracking
- **WHO Percentile Charts**: Interactive growth charts with WHO growth standard percentiles
- **Data Persistence**: Local storage using AsyncStorage with data migration support
- **Unit Conversion**: Real-time conversion between metric and imperial units
- **Measurement History**: Complete chronological history with trend indicators

### Technical Highlights
- **TypeScript**: Full type safety and IntelliSense support
- **React Hook Form**: Robust form validation and error handling
- **Victory Native**: Professional-grade charts with percentile curves
- **WHO Growth Standards**: Local WHO LMS data for accurate percentile calculations
- **Responsive Design**: Optimized for both phones and tablets
- **Performance**: Handles 50+ measurements without performance degradation

## 🛠️ Technology Stack

### Core Framework
- **React Native**: 0.76.9
- **Expo SDK**: ~54.0.0 (pinned for stability)
- **TypeScript**: ^5.1.3
- **Runtime Version**: exposdk:54.0.0

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

## 🏗 Architecture

### State Management
- React Context for global baby profile state
- Local component state with hooks for UI interactions
- AsyncStorage for persistent data storage

### Data Flow
1. **Input**: Form validation → Unit conversion → SI unit storage
2. **Processing**: Age calculation → WHO percentile calculation → Data persistence
3. **Display**: Data retrieval → Chart rendering → History visualization

### Chart Implementation
- **Library Choice**: Victory Native
  - **Justification**: Native performance, extensive chart types, excellent React Native integration
  - **Alternatives Considered**: react-native-chart-kit (limited customization), react-native-svg-charts (discontinued)
- **Percentile Calculation**: WHO LMS method with linear interpolation
- **Performance**: Memoized chart components, efficient data structures

## 🗂 Project Structure

```
src/
├── components/          # React Native components
│   ├── BabySetup.tsx   # Initial baby profile setup
│   ├── MainScreen.tsx  # Main app interface with tabs
│   ├── Header.tsx      # App header with baby info
│   ├── MeasurementForm.tsx # Add/edit measurements
│   ├── GrowthChart.tsx # Victory Native charts
│   ├── MeasurementHistory.tsx # History list
│   └── LoadingScreen.tsx # Loading state
├── types/              # TypeScript definitions
├── utils/              # Utility functions
│   ├── calculations.ts # Age, percentile, conversion calculations
│   └── storage.ts      # AsyncStorage operations
├── data/               # Static data
│   └── whoGrowthData.ts # WHO growth reference data
└── __tests__/          # Unit tests
```

## 📊 WHO Growth Standards

### Data Source
- **Primary**: WHO Child Growth Standards (0-24 months)
- **URL**: https://www.who.int/tools/child-growth-standards/standards
- **Method**: LMS parameters (Lambda, Mu, Sigma) for percentile calculation

### Implementation
- **Storage**: Local JSON data (no network calls)
- **Calculation**: LMS method with Z-score to percentile conversion
- **Interpolation**: Linear interpolation between monthly data points
- **Coverage**: Weight-for-age, length/height-for-age, head-circumference-for-age

### Processing Steps
1. Downloaded WHO LMS tables from official source
2. Converted to TypeScript interfaces with proper typing
3. Implemented LMS formula: `Z = (((value/M)^L) - 1) / (L*S)`
4. Added normal CDF approximation for percentile conversion

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- For iOS development: Xcode and iOS Simulator
- For Android development: Android Studio and Android Emulator
- Expo Go app for physical device testing

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

## 🧪 Testing

### Unit Tests
- **Framework**: Jest with React Native preset
- **Coverage**: Critical calculations, data validation, utility functions
- **Location**: `src/__tests__/`

### Test Categories
1. **Age Calculations**: Birth date to measurement date conversion
2. **Unit Conversions**: Metric ↔ Imperial conversions with precision
3. **Percentile Calculations**: WHO LMS method validation
4. **Data Validation**: Input validation and error handling
5. **Trend Analysis**: Growth trend detection

### Running Tests
```bash
npm run test                    # Run all tests
npm run test:watch             # Run in watch mode
npm run test:coverage          # Generate coverage report
```

## 🚀 Deployment

### EAS Build Configuration
The project is configured with EAS Build for streamlined deployment:

```bash
# Development build
eas build --profile development --platform all

# Preview build for testing
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all
```

### Build Profiles
- **Development**: Development client with debugging enabled
- **Preview**: Internal distribution for testing
- **Production**: Optimized builds for app stores

### Platform Configuration
- **iOS**: M1-medium resource class, proper bundle identifier
- **Android**: Adaptive icons, proper package name and permissions

## 📱 Usage Guide

### First Launch
1. **Baby Setup**: Enter baby's name, birth date, gender, and optional birth measurements
2. **Profile Creation**: App automatically calculates current age and sets up data storage

### Adding Measurements
1. **Tap Add Button**: Plus icon in header
2. **Enter Data**: Date, weight, height, head circumference
3. **Unit Selection**: Toggle between metric and imperial
4. **Real-time Conversion**: Units convert automatically
5. **Save**: Automatic percentile calculation and storage

### Viewing Progress
- **Overview Tab**: Latest measurements, key stats, quick chart
- **Charts Tab**: Detailed growth charts with WHO percentiles
- **History Tab**: Chronological list with trends and editing

### Data Management
- **Edit**: Tap pencil icon on any measurement
- **Delete**: Tap trash icon with confirmation dialog
- **Persistence**: All data stored locally, survives app restarts

## 🔧 Configuration

### Storage Schema
```typescript
{
  version: "1.0.0",
  babyProfile: BabyProfile,
  measurements: GrowthMeasurement[],
  lastUpdated: string
}
```

### Migration Support
- Schema versioning for future updates
- Graceful handling of corrupted data
- Automatic fallback to default state

## 📈 Performance

### Optimization Strategies
1. **Chart Rendering**: Memoized components, efficient data structures
2. **List Performance**: FlatList with key extractors
3. **Storage**: Batched AsyncStorage operations
4. **Memory**: Proper cleanup of event listeners and subscriptions

### Performance Targets
- **Chart Render**: < 500ms initial render (60 measurements)
- **Form Submission**: < 200ms save operation
- **App Launch**: < 2s cold start
- **Memory**: < 100MB peak usage

## 🔮 Future Improvements

### Planned Features
1. **Export/Import**: JSON data export for backup/sharing
2. **Multiple Babies**: Support for multiple children
3. **Photo Tracking**: Visual progress with photo timeline
4. **Milestone Tracking**: Developmental milestones
5. **Growth Predictions**: Trend-based growth projections
6. **Pediatrician Sharing**: PDF reports for medical visits

### Technical Enhancements
1. **Offline Sync**: Cloud backup with offline-first approach
2. **Advanced Charts**: Growth velocity, BMI tracking
3. **Accessibility**: Full screen reader support
4. **Internationalization**: Multi-language support
5. **Push Notifications**: Measurement reminders

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

### Known Issues

1. **Chart Performance**: Large datasets (100+ points) may cause slight lag on older devices
2. **Date Input**: Manual date entry on some Android keyboards
3. **Unit Conversion**: Slight rounding differences in edge cases

## 🤝 Contributing

### Development Guidelines
1. **TypeScript**: All code must be properly typed
2. **Testing**: Unit tests required for utility functions
3. **Performance**: Consider mobile performance implications
4. **Accessibility**: Follow React Native accessibility guidelines

### Code Style
- ESLint configuration with Expo and TypeScript rules
- Prettier for code formatting
- Conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **WHO**: World Health Organization for growth standards
- **Victory**: Formidable Labs for excellent charting library
- **Expo**: For streamlined React Native development
- **React Hook Form**: For robust form handling

---

**Note**: This application is for tracking purposes only and should not replace professional medical advice. Always consult with your pediatrician for medical concerns about your baby's growth and development.