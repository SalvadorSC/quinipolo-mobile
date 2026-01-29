# Code Validation Setup

## Overview
This document explains the code validation system implemented to catch common errors like undefined imports, unused variables, and type issues early in development.

## What Was Implemented

### 1. Stricter TypeScript Configuration
**File**: `tsconfig.json`

Added strict compiler options:
- `noUncheckedIndexedAccess`: Prevents unsafe array access
- `noImplicitReturns`: Ensures all code paths return a value
- `noFallthroughCasesInSwitch`: Catches missing break statements
- `noUnusedLocals`: Blocks unused local variables
- `noUnusedParameters`: Blocks unused function parameters
- `exactOptionalPropertyTypes`: Stricter optional property handling
- `noPropertyAccessFromIndexSignature`: Safer object property access

### 2. Enhanced ESLint Rules
**File**: `.eslintrc.js`

Changed to errors (blocking):
- `@typescript-eslint/no-explicit-any`: Now blocks `any` types
- `@typescript-eslint/no-non-null-assertion`: Blocks `!` assertions

Added new rules:
- `@typescript-eslint/no-unnecessary-condition`: Warns about unnecessary conditions
- Already had: `unused-imports/no-unused-imports` (error)
- Already had: `@typescript-eslint/no-unused-vars` (error)

### 3. Validation Script
**File**: `scripts/validate-code.sh`

Comprehensive validation that runs:
1. Import/export mismatch checks (catches apiClient-type issues)
2. TypeScript type checking (`tsc --noEmit`)
3. ESLint linting
4. Test coverage (80% minimum)

**Usage**:
```bash
npm run validate
```

### 4. Pre-commit Hooks
**File**: `.husky/pre-commit`

Already configured to run:
1. Linting
2. Type checking
3. Test coverage

These hooks run automatically before each commit, preventing problematic code from being committed.

## How It Catches Undefined Issues

### Example: apiClient Import Error

**Before** (incorrect):
```typescript
import { apiClient } from '../../services/api'; // Named import
```

**After** (correct):
```typescript
import apiClient from '../../services/api'; // Default import
```

**How it's caught**:
1. **TypeScript** now catches this at compile time:
   ```
   error TS2614: Module '"../../services/api"' has no exported member 'apiClient'.
   Did you mean to use 'import apiClient from "../../services/api"' instead?
   ```

2. **Pre-commit hook** runs `npm run type-check` before commit

3. **Validation script** can be run manually: `npm run validate`

## Fixed Issues

### 1. apiClient Import Errors
**Files Fixed**:
- `src/hooks/dashboard/useLeagueDetails.ts`
- `src/hooks/dashboard/useLeaderboard.ts`
- `src/hooks/answers/useAnswerSubmission.ts`
- `src/hooks/answers/useQuinipoloData.ts`

**Error**: `Cannot read properties of undefined (reading 'get')`
**Cause**: Named import instead of default import
**Fix**: Changed to default import syntax

### 2. Type Mismatch: userData.leagues
**File Fixed**: `src/context/UserContext.tsx`

**Error**: `Property 'trim' does not exist on type 'never'`
**Cause**: Type definition said `Leagues[]` (objects) but actual data was `string[]` (IDs)
**Fix**: Updated type definition to match reality: `leagues: string[]`

## Development Workflow

### During Development
```bash
# Watch mode for tests (recommended)
npm run test:watch

# Type check on demand
npm run type-check

# Run full validation
npm run validate
```

### Before Committing
Pre-commit hooks run automatically, but you can run manually:
```bash
npm run validate
```

If validation fails, fix the issues before committing.

### Bypassing Hooks (NOT RECOMMENDED)
```bash
git commit --no-verify  # Skips pre-commit hooks
```

**Warning**: Only use this in emergencies. It defeats the purpose of the validation system.

## Common Errors and Fixes

### 1. Unused Variable Error
```
error TS6133: 'foo' is declared but its value is never read.
```

**Fix**: Remove the unused variable or prefix with underscore if it's required:
```typescript
const _unusedButRequired = value; // Ignored by linter
```

### 2. Unsafe Any Type
```
error: Unexpected any. Specify a different type
```

**Fix**: Add proper types:
```typescript
// Before
const data: any = response.data;

// After
const data: QuinipoloData = response.data;
```

### 3. Possibly Undefined
```
error TS18048: 'variable' is possibly 'undefined'.
```

**Fix**: Add null check or use optional chaining:
```typescript
// Option 1: Null check
if (variable) {
  variable.doSomething();
}

// Option 2: Optional chaining
variable?.doSomething();

// Option 3: Non-null assertion (use sparingly)
variable!.doSomething();
```

### 4. Missing Return Statement
```
error TS7030: Not all code paths return a value.
```

**Fix**: Ensure all branches return a value:
```typescript
function getValue(condition: boolean): string {
  if (condition) {
    return 'yes';
  }
  return 'no'; // Add this
}
```

## Test Coverage Requirements

**Minimum**: 80% coverage across:
- Branches
- Functions
- Lines
- Statements

**Enforcement**: Pre-commit hooks block commits if coverage < 80%

**Check coverage**:
```bash
npm run test:coverage
```

## Benefits

1. **Catch errors early**: Many runtime errors are caught at compile time
2. **Better code quality**: Unused code is automatically flagged
3. **Type safety**: Stricter type checking prevents many bugs
4. **Consistent codebase**: Everyone follows the same standards
5. **Faster debugging**: Errors are caught before they reach production

## Future Improvements

Consider adding:
- Stricter null checks: `strictNullChecks: true` (already enabled via `strict: true`)
- Import order linting
- Consistent naming conventions enforcement
- Automated code formatting on commit (Prettier)
- Bundle size monitoring

## Questions?

If you encounter validation errors you don't understand:
1. Read the error message carefully - TypeScript errors are usually descriptive
2. Check this document for common fixes
3. Run `npm run type-check` to see all errors
4. Ask for help if stuck!
