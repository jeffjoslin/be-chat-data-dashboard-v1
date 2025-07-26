# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js SSO integration example for Chat Data, demonstrating how to implement white-label chatbot management. The project uses JWT tokens for secure authentication and redirects users to Chat Data's SSO endpoint.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Architecture

The project uses Next.js Pages Router with the following structure:

- **API Routes**: Server-side JWT token generation in `/src/pages/api/get-sso-token.js`
- **Component Pattern**: Reusable UI components in `/src/components/`
- **SSO Flow**: 
  1. User clicks chatbot card → 
  2. Frontend requests JWT from API → 
  3. Backend signs user data → 
  4. Frontend redirects to Chat Data SSO

## Environment Variables

Required environment variables (create `.env.local`):

```
NEXT_PUBLIC_CHATBOT_ID_1=<your-chatbot-id-1>
NEXT_PUBLIC_CHATBOT_ID_2=<your-chatbot-id-2>
NEXT_PUBLIC_COMPANY_ID=<your-company-id>
NEXT_PUBLIC_REDIRECT_URL=<logout/error-redirect-url>
PRIVATE_JWT_SECRET=<your-private-jwt-secret>
```

Get these values from your Chat Data SSO Login page.

## SSO Implementation Guide

For detailed instructions on setting up SSO redirect, including available features and limitations, see [sso-redirect.md](./sso-redirect.md).

## Key Implementation Details

- **JWT Signing**: The `jsonwebtoken` library signs user data with the private key
- **Mock User Data**: Currently hardcoded in `/src/pages/api/get-sso-token.js` - replace with actual user authentication
- **Styling**: Uses Tailwind CSS v4 with PostCSS configuration
- **Path Aliases**: Use `@/` to import from `src/` directory

## Testing SSO Integration

1. Set up environment variables
2. Run `npm run dev`
3. Click on a chatbot card
4. Verify JWT token generation in browser network tab
5. Confirm redirect to Chat Data SSO endpoint

## Plan & Review

### Before starting work
- Always in plan mode to make a plan
- After get the plan, make sure you Write the plan to .claude/tasks/TASK_NAME.md.
- The plan should be a detailed implementation plan and the reasoning behind them, as well as tasks broken down.
- If the task require external knowledge or certain package, also research to get latest knowledge (Use Task tool for research)
- Don't over plan it, always think MVP.
- Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

### While implementing
- You should update the plan as you work.
- After you complete tasks in the plan, you should update and append detailed descriptions of the changes you made, so following tasks can be easily hand over to other engineers.