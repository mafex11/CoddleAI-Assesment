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
- Node.js 16+
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (Mac) or Android Emulator
- Expo Go app for physical device testing

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd BabyGrowthApp

# Install dependencies
npm install

# Start the development server
npm run start

# Run on specific platforms
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web browser
```

### Development Scripts

```bash
npm run start      # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run in web browser
npm run test       # Run Jest tests
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript compiler check
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
npm run test -- --watch        # Run in watch mode
npm run test -- --coverage     # Generate coverage report
```

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

## 🐛 Known Issues

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