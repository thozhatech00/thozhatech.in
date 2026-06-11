# Thozha Tech Website + Firebase Client Portal

This package contains a professional IAM consulting website with real Firebase authentication and a protected dashboard.

## Files to upload to GitHub

Upload/replace these files in your GitHub repository:

- index.html
- style.css
- script.js
- login.html
- dashboard.html
- auth.js
- dashboard.js
- firebase-config.js
- CNAME

Keep CNAME as:

thozhatech.in

## Firebase setup steps

1. Go to Firebase Console.
2. Create a project, for example: thozhatech-portal.
3. Add a Web App.
4. Copy the Firebase SDK config.
5. Open firebase-config.js.
6. Replace the placeholder values with your real Firebase config.
7. In Firebase Authentication:
   - Enable Google provider.
   - Enable Email/Password provider.
8. In Firebase Authentication settings:
   - Add authorized domains:
     - thozhatech.in
     - www.thozhatech.in
     - thozhatech00.github.io
9. In Firestore:
   - Create database.
   - Start in production mode.
   - Paste rules from firestore.rules.
10. Upload all files to GitHub.
11. Test:
   - https://thozhatech.in/login.html
   - Create account or login with Google.
   - After login it should redirect to dashboard.html.

## What happens after login

- Google login or email/password authentication happens in Firebase Auth.
- User profile is stored in Firestore under users/{uid}.
- dashboard.html is protected.
- If user is not logged in, dashboard redirects to login.html.

## Security note

Do not store passwords in Firestore. Firebase Auth handles passwords securely.
