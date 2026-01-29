# Quinipolo Mobile App

A React Native mobile application for Quinipolo, built with Expo and TypeScript. This app shares the same backend as the web frontend (`quinipolo-fe`) and provides a native mobile experience.

## Features

- **Authentication**: Login with email/password or Google OAuth
- **Internationalization**: Multi-language support (EN, ES, CA, FR, DE, IT, PT, JA, ZH)
- **Secure Storage**: Uses Expo SecureStore for sensitive data
- **Code Quality**: 80% code coverage requirement and strict linting rules
- **TypeScript**: Full type safety throughout the application

## Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory with the following variables:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run type-check` - Run TypeScript type checking

## Code Quality Requirements

### Code Coverage

- **Minimum 80% coverage** required for all branches, functions, lines, and statements
- Coverage is enforced through Jest configuration and pre-commit hooks
- Run `npm run test:coverage` to check current coverage
- **Commits will be blocked if coverage is below 80%**

### Linting Rules

- **Unused variables are treated as errors** (blockers)
- **Commits will be blocked if there are unused variables or imports**
- TypeScript strict mode enabled
- React Native specific rules enforced
- Prettier formatting applied automatically

### Pre-commit Hooks

- Husky and lint-staged configured
- **Automatic checks before each commit:**
  - ESLint validation (unused variables check)
  - TypeScript type checking
  - Test coverage validation (80% minimum)
  - Prettier formatting
- **Commits will fail if any check fails**

### Commit Requirements

- All commits must pass the pre-commit hooks
- No unused variables or imports allowed
- 80% code coverage must be maintained
- All TypeScript types must be valid
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React Context providers
│   └── UserContext.tsx # Authentication context
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── screens/           # Screen components
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   └── __tests__/     # Screen tests
├── services/          # API and external services
│   └── supabaseClient.ts
├── utils/             # Utility functions
│   ├── config.ts
│   └── i18n.ts
├── locales/           # Translation files
│   ├── en/
│   ├── es/
│   └── ...
└── types/             # TypeScript type definitions
```

## Authentication Flow

The app uses Supabase for authentication with the following features:

1. **Email/Password Login**: Traditional login with email and password
2. **Google OAuth**: Sign in with Google account
3. **Password Reset**: Forgot password functionality with email
4. **Secure Storage**: Authentication tokens stored securely using Expo SecureStore
5. **Auto-login**: Persistent sessions across app restarts

## Internationalization

The app supports multiple languages using `react-i18next` and `react-native-localize`:

- **Automatic Detection**: Uses device locale to set initial language
- **Fallback**: English as fallback for unsupported languages
- **Dynamic Switching**: Language can be changed at runtime (to be implemented)

## Testing

### Test Structure

- **Unit Tests**: Individual component and utility function tests
- **Integration Tests**: Navigation and context integration tests
- **Coverage**: Comprehensive coverage reporting

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## Backend Integration

This mobile app shares the same backend as the web frontend (`quinipolo-fe`). The backend provides:

- User authentication and management
- League management
- Quinipolo (quiz) functionality
- Leaderboards and scoring
- Subscription management

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint rules strictly
- Use Prettier for consistent formatting
- Write tests for all new features

### Component Guidelines

- Use React Native Paper for UI components
- Implement proper error handling
- Add loading states for async operations
- Use proper TypeScript types

### State Management

- Use React Context for global state
- Keep component state local when possible
- Use secure storage for sensitive data

## Deployment

### Expo Build

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas build:configure

# Build for production
eas build --platform all
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `expo start -c`
2. **iOS build issues**: Clean build folder and reinstall pods
3. **Android build issues**: Clean gradle cache and rebuild
4. **TypeScript errors**: Run `npm run type-check` to identify issues

### Getting Help

- Check the [Expo documentation](https://docs.expo.dev/)
- Review [React Native documentation](https://reactnative.dev/)
- Check existing issues in the project repository

## Contributing

1. Ensure code coverage is above 80%
2. Fix all linting errors before committing
3. Write tests for new features
4. Follow the established code style
5. Update documentation as needed

## License

This project is part of the Quinipolo application suite and follows the same licensing terms as the main project.
