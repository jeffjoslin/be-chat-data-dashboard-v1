# Chat Data Role-Based Integration Guide

## Current Status
Your RBAC system correctly passes role information to Chat Data via JWT tokens, but Chat Data's interface currently shows all tabs regardless of user role.

## JWT Token Structure Being Sent
```json
{
  "chatbotId": "67e1a69d8d8897908c0daa05",
  "name": "User Name",
  "email": "user@email.com",
  "avatar": "avatar_url",
  "role": "viewer|editor|admin",
  "permissions": {
    "settings": boolean,
    "analytics": boolean,
    "chatbotConfig": boolean,
    "userManagement": boolean
  },
  "roleLevel": "viewer|editor|admin"
}
```

## Next Steps

### Option 1: Contact Chat Data Support (Recommended)
Email: admin@chat-data.com

**Request:**
"We're implementing role-based access control with your SSO system. Our JWT tokens include role and permission data. Can Chat Data's interface restrict tabs/features based on custom JWT claims?"

**Provide:**
- Your company ID: 67e1c2403b3fe6cdd0ae360a
- Sample JWT token structure (above)
- Desired restrictions per role:
  - **Viewer**: Only Dashboard/Analytics access
  - **Editor**: Dashboard, Settings, Sources - no user management
  - **Admin**: Full access

### Option 2: Custom Integration Script
If Chat Data doesn't support server-side restrictions, you could inject JavaScript to hide UI elements based on role stored in sessionStorage.

### Option 3: Proxy/Wrapper Approach
Create a wrapper interface that embeds Chat Data's iframe and controls which features are accessible.

## Current Working Features ✅
- SSO authentication working
- Role data passed in JWT
- Your RBAC app correctly shows role-based permissions
- Users successfully redirected to Chat Data interface

## What Needs Chat Data Support ❌
- Tab visibility based on role
- Feature restrictions within tabs
- UI element hiding/disabling based permissions

## Testing the Integration
1. Test with viewer account - should only see limited features
2. Test with editor account - should see most features except user management  
3. Test with admin account - should see all features

The technical integration is complete - this is now a Chat Data configuration/support issue.