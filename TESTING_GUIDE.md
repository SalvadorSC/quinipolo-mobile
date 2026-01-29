# Quinipolo Mobile App - Testing Guide

## Overview
This guide covers testing all MVP features implemented in the Quinipolo mobile app.

## Prerequisites
- Expo Go app installed on your device
- Test user account with access to leagues and quinipolos
- Active backend API running

## Test Environment Setup

1. **Start the mobile app**:
   ```bash
   cd quinipolo-mobile
   npm start
   ```

2. **Scan QR code** with Expo Go app

## Feature Testing

### 1. Authentication Features ✅

#### 1.1 Login
- [ ] Open app and see login screen
- [ ] Enter valid email and password
- [ ] Tap "Login" button
- [ ] Verify successful login and redirect to home screen
- [ ] Check that user data loads correctly

#### 1.2 Signup (if implemented)
- [ ] Navigate to signup screen
- [ ] Fill in registration form
- [ ] Submit and verify account creation
- [ ] Verify automatic login after signup

#### 1.3 Logout
- [ ] From Profile screen or Home screen, tap logout
- [ ] Verify return to login screen
- [ ] Verify user data is cleared

### 2. Dashboard & View Features ✅

#### 2.1 Home Screen - Quinipolo List
- [ ] View user's pending quinipolos
- [ ] See quinipolo cards with:
  - League name
  - Deadline date and time
  - Status chip (Pending/Answered/Expired)
  - Countdown timer for pending quinipolos
- [ ] Test tab switching:
  - **Pending tab**: Only unanswered, non-expired quinipolos
  - **Previous tab**: Answered or expired quinipolos
  - **All tab**: All non-deleted quinipolos
- [ ] Test pull-to-refresh functionality
- [ ] Verify empty state messages for each tab

#### 2.2 Leagues Screen
- [ ] Navigate to Leagues tab
- [ ] View list of user's leagues
- [ ] See league cards with:
  - League icon with custom colors
  - League name
  - Participant count
- [ ] Tap a league card to navigate to league dashboard
- [ ] Test pull-to-refresh
- [ ] Verify empty state message

#### 2.3 League Dashboard Screen
- [ ] Open a league from Leagues screen
- [ ] View league header with:
  - Custom league icon and colors
  - League name
  - Participant count
  - Description (if available)
- [ ] Test tab switching:
  - **Quinipolos tab**: League-specific quinipolos
  - **Leaderboard tab**: Rankings with points and stats
- [ ] Verify leaderboard displays:
  - Position with medals (🥇🥈🥉) for top 3
  - Username (highlight current user)
  - Total points
  - Quinipolos participated
  - Perfect quinipolos
- [ ] Test pull-to-refresh
- [ ] Test back navigation

### 3. Answer Quinipolo Features ✅

#### 3.1 Navigation to Answer Screen
- [ ] From Home screen, tap a **pending** quinipolo card
- [ ] Verify navigation to Answer Quinipolo screen
- [ ] Verify screen shows:
  - League name
  - Deadline information
  - Instructions card

#### 3.2 Answering Matches 1-14
- [ ] View all 15 match rows
- [ ] For matches 1-14, test:
  - Select winner using 1/X/2 buttons
  - Verify visual feedback on selection
  - Change selection and verify update
  - Mark match as cancelled
  - Uncancel a match
- [ ] Verify team names display correctly
- [ ] Scroll through all matches smoothly

#### 3.3 Answering Match 15
- [ ] Select winner (1/X/2)
- [ ] Verify goal selector appears for both teams
- [ ] Select home team goals (0-30)
- [ ] Select away team goals (0-30)
- [ ] Verify selections are saved
- [ ] Test changing selections

#### 3.4 Answer Validation
- [ ] Try to submit with missing answers
- [ ] Verify:
  - Missing matches highlighted in red
  - Warning message appears
  - Submit is prevented
  - Error message shows match numbers
- [ ] For match 15, verify validation requires:
  - Winner selection
  - Both team goals
- [ ] Verify cancelled matches don't require answers

#### 3.5 Answer Submission
- [ ] Fill in all 15 matches correctly
- [ ] Tap "Submit Answers" button
- [ ] Verify:
  - Loading indicator appears
  - Submit button is disabled during submission
- [ ] On success:
  - Alert shows success message
  - Navigation back to home screen
  - Quinipolo moves to "Previous" tab
  - Status changes to "Answered"
- [ ] On error:
  - Alert shows error message
  - User can retry submission

#### 3.6 Expired Quinipolo Handling
- [ ] Try to open an expired quinipolo
- [ ] Verify screen shows:
  - Clock icon
  - "Quinipolo has expired" message
  - Deadline timestamp
  - "Go Back" button
- [ ] Tap "Go Back" and verify return to home

### 4. Profile Screen

- [ ] View user profile information:
  - Username
  - Email
  - User ID
  - Role (if applicable)
- [ ] Verify logout button works
- [ ] Check "Coming soon" placeholder for statistics

## Edge Cases & Error Handling

### Network Errors
- [ ] Disable internet connection
- [ ] Try to load data
- [ ] Verify appropriate error messages
- [ ] Re-enable connection and pull-to-refresh
- [ ] Verify data loads correctly

### Invalid Data
- [ ] Test with empty leagues list
- [ ] Test with empty quinipolos list
- [ ] Verify empty state messages display

### Concurrent Operations
- [ ] Start loading data on one screen
- [ ] Navigate to another screen quickly
- [ ] Verify no crashes or errors
- [ ] Verify loading states are correct

### Form Validation
- [ ] Test all validation rules:
  - Empty answers
  - Partial answers (missing goals for match 15)
  - All cancelled matches
- [ ] Verify validation messages are clear

## Performance Testing

### Load Times
- [ ] Time home screen load with 10+ quinipolos
- [ ] Time league dashboard with 20+ participants
- [ ] Verify smooth scrolling with many items

### Memory Usage
- [ ] Open and close multiple screens
- [ ] Navigate between tabs repeatedly
- [ ] Verify no memory leaks (app doesn't slow down)

### Responsiveness
- [ ] Test on different device sizes
- [ ] Verify layouts adapt correctly
- [ ] Test on both iOS and Android

## Data Integrity

### Answer Persistence
- [ ] Fill in partial answers
- [ ] Close app (don't kill it)
- [ ] Reopen and verify answers are still there
- [ ] Complete and submit
- [ ] Verify submission includes all answers

### Data Refresh
- [ ] Make changes on web app
- [ ] Pull-to-refresh on mobile
- [ ] Verify changes appear

## Security Testing

### Authentication
- [ ] Verify unauthenticated users redirected to login
- [ ] Verify token expiration handled gracefully
- [ ] Test logout clears all sensitive data

### Authorization
- [ ] Verify users only see their quinipolos
- [ ] Verify users only see their leagues
- [ ] Test accessing invalid quinipolo IDs

## Known Issues (To Be Addressed)

1. **Results Screen**: Not yet implemented - users can't view their submitted answers and scores
2. **Statistics**: Admin-only statistics feature not implemented for mobile
3. **Edit Answers**: No ability to modify answers before deadline
4. **Push Notifications**: No deadline reminders
5. **Offline Mode**: No offline answer caching

## Success Criteria

All MVP features are considered working if:
- [ ] Users can log in successfully
- [ ] Users can view all their quinipolos (pending, previous, all)
- [ ] Users can view all their leagues
- [ ] Users can view league dashboards and leaderboards
- [ ] Users can answer pending quinipolos
- [ ] Answer validation works correctly
- [ ] Answer submission succeeds with valid data
- [ ] Navigation flows work smoothly
- [ ] Pull-to-refresh updates data
- [ ] Error handling provides clear feedback
- [ ] App doesn't crash during normal use
- [ ] Performance is acceptable (< 3s load times)

## Reporting Issues

When reporting issues, include:
1. Device type and OS version
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots or screen recordings
5. Console error messages (if available)
6. User account used for testing

## Test Coverage Goals

- **Authentication**: 100% (all flows tested)
- **Navigation**: 100% (all screens accessible)
- **Data Display**: 100% (all data types shown correctly)
- **Answer Form**: 100% (all interactions tested)
- **Error Handling**: 80%+ (common errors covered)
- **Edge Cases**: 70%+ (unusual scenarios tested)
