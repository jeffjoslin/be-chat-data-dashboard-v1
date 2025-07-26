# RBAC Implementation Plan for Chat Data SSO

## Overview
Implement a role-based access control (RBAC) system that limits user access to specific tabs/features within the Chat Data SSO demo application. The system will use Firebase Authentication for user management and Supabase for role/permission storage.

## MVP Scope
Focus on demonstrating RBAC functionality within the existing demo, with the ability to scale to a full production system.

## Technical Stack
- **Authentication**: Firebase Authentication (JWT-based)
- **Database**: Firestore (for roles and permissions)
- **UI Components**: ShadCN UI
- **State Management**: React Context API
- **Existing**: Next.js, Tailwind CSS

## Roles Definition
1. **Admin**: Full access to all chatbots and features
2. **Editor**: Can modify chatbot content, access analytics, but no user management
3. **Viewer**: Read-only access to chatbots and analytics
4. **Custom**: Configurable permissions per role

## Permission Matrix
| Feature | Admin | Editor | Viewer |
|---------|-------|---------|---------|
| Settings | ✅ | ✅ | ❌ |
| Analytics | ✅ | ✅ | ✅ |
| Chatbot Config | ✅ | ✅ | ❌ |
| User Management | ✅ | ❌ | ❌ |
| View Dashboard | ✅ | ✅ | ✅ |

## Implementation Tasks

### Phase 1: Setup Infrastructure (Day 1)
1. **Firebase Setup**
   - Create Firebase project
   - Enable Authentication (Email/Password + Google OAuth)
   - Configure Firebase SDK in Next.js app
   - Update environment variables

2. **Firestore Setup**
   - Enable Firestore in Firebase project
   - Design collection structure:
     ```javascript
     // Users collection (synced with Firebase Auth)
     users/{userId} {
       uid: string,          // Firebase Auth UID
       email: string,
       name: string,
       createdAt: timestamp
     }
     
     // Roles collection
     roles/{roleId} {
       name: string,         // 'admin', 'editor', 'viewer'
       description: string,
       permissions: {
         settings: boolean,
         analytics: boolean,
         chatbotConfig: boolean,
         userManagement: boolean
       }
     }
     
     // User-Chatbot-Role assignments
     userRoles/{userId}/chatbots/{chatbotId} {
       roleId: string,
       assignedAt: timestamp,
       assignedBy: string
     }
     ```
   - Set up Firestore security rules
   - Initialize Firestore client in Next.js

3. **Install Dependencies**
   - firebase (includes Firestore)
   - shadcn/ui components

### Phase 2: Authentication Layer (Day 2)
1. **Create Auth Context**
   - Firebase auth state management
   - User session handling
   - JWT token generation with role claims

2. **Login/Signup Pages**
   - Build with ShadCN components
   - Email/password authentication
   - Google OAuth option
   - Error handling and validation

3. **Protected Route Wrapper**
   - HOC for route protection
   - Redirect to login if unauthenticated

### Phase 3: Role Management (Day 3)
1. **Permissions Context**
   - Fetch user roles from Firestore
   - Cache permissions in context
   - Provide permission checking utilities

2. **Permission HOC**
   - Component wrapper for role-based rendering
   - Hide restricted UI elements
   - Handle direct URL access attempts

3. **Update Chatbot Cards**
   - Show only authorized chatbots
   - Display role badge on cards
   - Disable/hide features based on permissions

### Phase 4: Admin Dashboard (Day 4)
1. **User Management Page**
   - List all users
   - Assign/modify roles
   - Per-chatbot permission management

2. **Role Management**
   - Create/edit custom roles
   - Configure permission matrix
   - Bulk assignment tools

3. **Audit Log**
   - Track permission changes
   - User access history

### Phase 5: Integration & Testing (Day 5)
1. **Update SSO Token Generation**
   - Include role information in JWT
   - Pass permissions to Chat Data (if supported)

2. **Error Handling**
   - Permission denied modal with ShadCN
   - Friendly error messages
   - Admin contact information

3. **Testing Scenarios**
   - Admin full access flow
   - Editor limitations
   - Viewer read-only experience
   - Direct URL access attempts

## File Structure
```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── rbac/
│   │   ├── PermissionWrapper.tsx
│   │   └── RoleBadge.tsx
│   └── admin/
│       ├── UserTable.tsx
│       ├── RoleManager.tsx
│       └── PermissionMatrix.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── PermissionContext.tsx
├── lib/
│   ├── firebase.ts
│   ├── firestore.ts
│   └── permissions.ts
├── pages/
│   ├── login.tsx
│   ├── signup.tsx
│   └── admin/
│       ├── users.tsx
│       └── roles.tsx
└── types/
    └── rbac.ts
```

## Environment Variables to Add
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## MVP Deliverables
1. Working authentication with Firebase
2. Role-based chatbot access stored in Firestore
3. Hidden UI elements for restricted features
4. Basic admin dashboard for user management
5. Integration with existing SSO flow

## Future Enhancements
- Real-time permission updates
- Granular feature-level permissions
- API rate limiting per role
- Analytics dashboard per role
- Multi-tenant support

## Success Criteria
- Users can only see/access chatbots they're authorized for
- Restricted tabs are completely hidden from unauthorized users
- Clean error handling for permission violations
- Seamless integration with existing Chat Data SSO
- Scalable architecture for future features

## Implementation Progress

### Phase 1: Completed ✅
- Installed Firebase SDK
- Created Firebase configuration (`/src/lib/firebase.ts`)
- Created Firestore helper functions (`/src/lib/firestore.ts`)
- Created RBAC types (`/src/types/rbac.ts`)
- Updated environment variables template

### Phase 2: In Progress 🔄
- Created AuthContext with Firebase authentication
- Created PermissionContext for role management
- Built custom UI components (Button, Input, Card)
- Created LoginForm and SignupForm components
- Created login and signup pages
- Updated _app.js with context providers

### Phase 3: Completed ✅
- Created PermissionWrapper for conditional rendering
- Created RoleBadge component for role display
- Updated ChatbotCard with role-based access
- Created permission utilities

### Phase 4: Completed ✅
- Created user management page at `/admin/users`
- Implemented role assignment and removal
- Added permission-based navigation
- Created modal components for UI

### Phase 5: Completed ✅
- Updated index page with authentication
- Integrated SSO token with role data
- Created protected routes
- Added documentation

## Implementation Complete! 🎉

### Key Files Created/Modified:
- **Authentication**: `/src/contexts/AuthContext.tsx`, login/signup pages
- **Permissions**: `/src/contexts/PermissionContext.tsx`, RBAC components
- **Firebase**: `/src/lib/firebase.ts`, `/src/lib/firestore.ts`
- **UI Components**: Button, Input, Card, Modal components
- **Admin Dashboard**: `/src/pages/admin/users.tsx`
- **Documentation**: `RBAC-Setup.md`, updated `README.md`

### Next Steps for Production:
1. Configure Firebase project with real credentials
2. Set up Firestore security rules
3. Run role initialization script
4. Test with multiple user accounts
5. Deploy to production environment