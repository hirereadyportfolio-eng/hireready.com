# HireReady Platform Build Summary

HireReady is a production-grade hackathon platform built with **Next.js**, **Firebase**, and **Tailwind CSS**.

## Key Features
- **Public Site**: Home, About, Hackathons, Contact.
- **Authentication**: Role-based access (Student/Admin).
- **User Dashboard**: Register for hackathons, submit projects, track rankings.
- **Admin Panel**: Manage hackathons, view platform metrics, review submissions.
- **Premium Design**: Dark mode, glass cards, smooth transitions.

## Firebase Configuration
To get the platform fully functional, please follow these steps:

### 1. Enable Services in Firebase Console
- **Authentication**: Enable `Email/Password` and `Google` providers.
- **Firestore Database**: Create a database.
- **Firebase Storage**: Enable storage for project assets.

### 2. Set Up Environment Variables
Paste your Firebase configuration into the `.env.local` file at the root of the project:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_id
```

### 3. Firestore Security Rules
Use these rules in your Firebase Console for production-ready security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /hackathons/{hackathonId} {
      allow read: if true;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /registrations/{regId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /submissions/{subId} {
      allow read: if true;
      allow create, update: if request.auth != null;
      allow delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /scores/{scoreId} {
      allow read: if true;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## How to Run
```bash
npm install
npm run dev
```
