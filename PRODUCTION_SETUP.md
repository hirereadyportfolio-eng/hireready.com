# HireReady — Production Setup Guide

Follow these steps to deploy your production-ready hackathon platform.

## 1. Firebase Console Configuration

### Authentication
- Enable **Email/Password**.
- Enable **Google** sign-in.

### Cloud Firestore (Database)
Create the following collections:
- `users`: Stores participant profiles.
- `hackathons`: Stores competition tracks.
- `registrations`: Stores mapping between users and hackathons.
- `submissions`: Stores project links and descriptions.
- `teams`: Stores the "Squad" data and invite codes.
- `scores`: Stores the verified leaderboard entries.

### Storage
- Enable Firebase Storage.
- Create folders: `banners/` (for hackathon images) and `submissions/` (for PPT/PDF uploads).

---

## 2. Firestore Security Rules

Copy and paste these into your Firebase Firestore Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow update: if isAdmin();
    }
    
    match /hackathons/{hackathonId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /registrations/{regId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }
    
    match /submissions/{subId} {
      allow read: if true;
      allow create, update: if request.auth != null;
      allow delete: if isAdmin();
    }

    match /teams/{teamId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (request.auth.uid in resource.data.memberIds || request.auth.uid in request.resource.data.memberIds);
      allow delete: if isAdmin();
    }
    
    match /scores/{scoreId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

---

## 3. Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /banners/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /submissions/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 4. Vercel Deployment

1. **Connect Repository**: Link your GitHub repo to Vercel.
2. **Environment Variables**: Add all `NEXT_PUBLIC_FIREBASE_*` variables from your `.env.local` to the Vercel Project Settings.
3. **Build Command**: `npm run build`
4. **Deploy**: Trigger a manual deploy.

---

## 5. Administrative Access
Your first account will be a `user` by default. To become an admin:
1. Sign up on the platform.
2. Go to the Firebase Firestore Console.
3. Find your document in the `users` collection.
4. Change the `role` field from `"user"` to `"admin"`.
5. Refresh the platform.

---
**HireReady Production Build Complete.**
