# Deployment Guide - Chat Data RBAC SSO

Since you're experiencing local networking issues, here are several ways to deploy and test your RBAC application:

## Option 1: Vercel (Recommended - Free)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy from your project directory**:
   ```bash
   vercel --prod
   ```

3. **Add environment variables** in Vercel dashboard or via CLI:
   ```bash
   vercel env add NEXT_PUBLIC_CHATBOT_ID_1
   vercel env add NEXT_PUBLIC_CHATBOT_ID_2
   vercel env add NEXT_PUBLIC_COMPANY_ID
   vercel env add NEXT_PUBLIC_REDIRECT_URL
   vercel env add PRIVATE_JWT_SECRET
   ```

## Option 2: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and deploy**:
   ```bash
   npm run build
   netlify deploy --prod --dir=.next
   ```

## Option 3: Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy**:
   ```bash
   railway login
   railway init
   railway up
   ```

## Option 4: GitHub + Vercel (No CLI needed)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Complete RBAC implementation"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add environment variables in the dashboard
   - Deploy automatically

## Environment Variables for Deployment

```
NEXT_PUBLIC_CHATBOT_ID_1=67e1a69d8d8897908c0daa05
NEXT_PUBLIC_CHATBOT_ID_2=68478243f8ed8305c0fcc8fb
NEXT_PUBLIC_COMPANY_ID=67e1c2403b3fe6cdd0ae360a
NEXT_PUBLIC_REDIRECT_URL=https://your-deployed-url.vercel.app
PRIVATE_JWT_SECRET=f6ae713bc41eeb0b04e8063c952f12a30ed306f47ffc4888831ac8a772d4c9c6
```

**Note**: Update `NEXT_PUBLIC_REDIRECT_URL` to your actual deployed domain.

## Testing Your Deployment

1. Visit your deployed URL
2. Sign up with email or Google
3. Test the authentication system
4. Create multiple accounts to test role assignments
5. Use Firebase Console to manually assign roles initially

Your RBAC system is ready - it just needs to run on a platform without networking restrictions!