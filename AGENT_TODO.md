# Missing Routes and Features in quinipolo-mobile

## Routes

1. **/sign-in**
   - **Component**: LoginForm

2. **/signup**
   - **Component**: SignUpForm

3. **/email-confirmation**
   - **Component**: EmailConfirmation

4. **/reset-password**
   - **Component**: ResetPassword

5. **/join-league/:shareToken**
   - **Component**: JoinLeague

6. **/about**
   - **Component**: About

7. **/terms**
   - **Component**: Terms

8. **/privacy**
   - **Component**: Privacy

9. **/dashboard**
   - **Component**: Dashboard

10. **/crear-quinipolo**
    - **Component**: SurveyForm

11. **/quinipolo-success**
    - **Component**: QuinipoloSuccess

12. **/correction-success**
    - **Component**: CorrectionSuccess

13. **/quinipolo**
    - **Component**: AnswersForm
    - **Sub-route**: /correct (element: AnswersForm)

14. **/league-dashboard**
    - **Component**: LeagueDashboard

15. **/profile**
    - **Component**: Profile

16. **/join-league**
    - **Component**: LeagueList

17. **/crear-liga**
    - **Component**: NewLeague

18. **/create-league**
    - **Component**: CreateLeague

19. **/league-success**
    - **Component**: LeagueSuccess

20. **/admin**
    - **Component**: Admin
    - **Protected Route**: requireAdmin = true

21. **/graphics** (Development only)
    - **Component**: GraphicsGeneratorPage
    - **Protected Route**: fallbackPath = "/"

## Features

1. **OAuth Callback Handling**
   - **Component**: OAuthCallbackHandler

2. **Protected Routes**
   - **Component**: ProtectedRoute

3. **Layout Component**
   - **Component**: Layout

4. **User Authentication Context**
   - **Context**: UserProvider

5. **Feedback Context**
   - **Context**: FeedbackProvider

6. **Theme Context**
   - **Context**: ThemeProvider

7. **Analytics Tracking**
   - **Function**: trackPageView

8. **URL Cleanup**
   - **Custom Hook**: useUrlCleanup

9. **Error Banner**
   - **Component**: ErrorBanner

10. **Error Message**
    - **Component**: ErrorMessage

11. **Input Component**
    - **Component**: Input

12. **League Icon Badge**
    - **Component**: LeagueIconBadge

13. **Loading Card**
    - **Component**: LoadingCard

14. **Loading Spinner**
    - **Component**: LoadingSpinner

15. **Match Winner Buttons**
    - **Component**: MatchWinnerButtons

16. **Quinipolo Card**
    - **Component**: QuinipoloCard

17. **Section Header**
    - **Component**: SectionHeader

18. **Segmented Button Group**
    - **Component**: SegmentedButtonGroup
