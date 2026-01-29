# Contributing to Quinipolo Mobile

Thank you for your interest in contributing to the Quinipolo Mobile app! This document outlines the requirements and guidelines for contributing to this project.

## 🚨 Commit Requirements

**IMPORTANT**: All commits must meet the following requirements before they can be pushed:

### 1. Code Coverage (80% Minimum)

- **Branches**: 80% minimum
- **Functions**: 80% minimum
- **Lines**: 80% minimum
- **Statements**: 80% minimum

### 2. Code Quality

- **No unused variables** - This is a blocker (error)
- **No unused imports** - This is a blocker (error)
- **All ESLint rules must pass** - No warnings or errors
- **TypeScript types must be valid** - No type errors

### 3. Pre-commit Hooks

The following checks run automatically before each commit:

- ESLint validation
- TypeScript type checking
- Test coverage validation
- Prettier formatting

## 🛠️ Development Setup

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm start
```

## 📝 Development Workflow

### 1. Before Making Changes

```bash
# Ensure you're on the latest main branch
git checkout main
git pull origin main

# Create a feature branch
git checkout -b feature/your-feature-name
```

### 2. During Development

```bash
# Run tests to ensure coverage
npm run test:coverage

# Check for linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Check TypeScript types
npm run type-check
```

### 3. Before Committing

```bash
# Stage your changes
git add .

# Run pre-commit checks manually (optional, they run automatically)
npm run lint
npm run type-check
npm run test:coverage
```

### 4. Committing

```bash
# Commit with the template
git commit
# This will open the commit message template

# Or commit with a simple message (template will still be used)
git commit -m "feat: add new login feature"
```

## 🧪 Testing Requirements

### Writing Tests

- Write tests for all new features
- Write tests for bug fixes
- Ensure tests cover edge cases
- Use descriptive test names

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should do something specific', () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🔍 Code Quality Tools

### ESLint

- Enforces code style and catches errors
- Unused variables are treated as errors (blockers)
- Run with: `npm run lint`
- Fix automatically: `npm run lint:fix`

### Prettier

- Ensures consistent code formatting
- Runs automatically on commit
- Configured in `.prettierrc`

### TypeScript

- Provides type safety
- Run type checking: `npm run type-check`
- No type errors allowed

## 📋 Commit Message Format

Use the provided commit message template or follow this format:

```
type: subject line (50 chars or less)

Body explaining what and why, not how.

Requirements met:
✅ 80% code coverage maintained
✅ No unused variables
✅ All linting rules passed
✅ TypeScript types checked
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## 🚫 What Will Block Your Commit

The following will prevent your commit from being accepted:

1. **Code coverage below 80%** - Add more tests
2. **Unused variables or imports** - Remove or use them
3. **ESLint errors** - Fix all linting issues
4. **TypeScript errors** - Fix type issues
5. **Failing tests** - Fix broken tests

## 🆘 Getting Help

If you encounter issues with the commit requirements:

1. **Coverage too low**: Add more test cases
2. **Unused variables**: Remove them or mark with underscore prefix (`_unused`)
3. **Linting errors**: Run `npm run lint:fix` to auto-fix many issues
4. **Type errors**: Check TypeScript documentation and fix type issues

## 📚 Additional Resources

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Code Review Process

1. Create a pull request
2. Ensure all CI checks pass
3. Request review from team members
4. Address feedback and make changes
5. Merge when approved

Remember: **Quality over speed**. It's better to take time to write good tests and maintain code quality than to rush and create technical debt.
