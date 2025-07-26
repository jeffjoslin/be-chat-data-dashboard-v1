# RBAC Setup Guide

This guide explains how to set up and use the Role-Based Access Control (RBAC) system in the Chat Data SSO demo.

## Prerequisites

1. Firebase project with Authentication and Firestore enabled
2. Chat Data SSO credentials
3. Node.js and npm installed

## Setup Steps

### 1. Configure Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication with Email/Password and Google providers
3. Enable Firestore Database
4. Get your Firebase configuration from Project Settings

### 2. Set Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Add your Firebase configuration:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Initialize Firestore Roles

Run the initialization script to create default roles:

```bash
npx tsx src/scripts/initializeRoles.ts
```

This creates three default roles:
- **Admin**: Full access to all features
- **Editor**: Can modify chatbot content, no user management
- **Viewer**: Read-only access

### 4. Run the Application

```bash
npm run dev
```

Visit http://localhost:3000 to see the application.

## User Flow

1. **Registration/Login**: Users can sign up or log in using email/password or Google
2. **Dashboard**: Users see only the chatbots they have access to
3. **Role Badges**: Each chatbot card shows the user's role
4. **Permission Indicators**: Visual indicators show available permissions
5. **Admin Panel**: Users with user management permission can access `/admin/users`

## Managing Users

### As an Admin:

1. Navigate to the User Management page (click "Manage Users" button)
2. View all users and their current chatbot access
3. Click "Assign Role" to grant access to a chatbot
4. Select the chatbot and role level
5. Click "Remove" to revoke access

### Role Permissions:

| Feature | Admin | Editor | Viewer |
|---------|-------|--------|--------|
| View Dashboard | ✅ | ✅ | ✅ |
| Settings | ✅ | ✅ | ❌ |
| Analytics | ✅ | ✅ | ✅ |
| Chatbot Config | ✅ | ✅ | ❌ |
| User Management | ✅ | ❌ | ❌ |

## Testing the System

1. Create multiple test accounts
2. Assign different roles to each account
3. Log in with each account to verify permissions
4. Try accessing restricted features
5. Verify SSO redirect includes role information

## Security Rules

Add these Firestore security rules to protect your data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own profile
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only backend can write
    }
    
    // Users can read their own roles
    match /userRoles/{userId}/chatbots/{chatbotId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only backend can write
    }
    
    // Anyone authenticated can read role definitions
    match /roles/{roleId} {
      allow read: if request.auth != null;
      allow write: if false; // Only backend can write
    }
  }
}
```

## Troubleshooting

### Users don't see any chatbots
- Check if roles are assigned in Firestore
- Verify environment variables are set correctly
- Check browser console for errors

### Permission denied errors
- Ensure Firebase is properly configured
- Check if the user has the required role
- Verify Firestore security rules

### SSO redirect fails
- Verify Chat Data SSO credentials
- Check if role data is included in JWT token
- Review browser network tab for errors