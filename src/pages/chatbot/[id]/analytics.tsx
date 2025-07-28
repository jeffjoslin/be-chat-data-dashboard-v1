import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function ChatbotAnalytics() {
  const router = useRouter();
  const { id: chatbotId } = router.query;
  const { currentUser } = useAuth();
  const { hasPermission, userChatbots } = usePermissions();
  const [dashboardUrl, setDashboardUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [chatbotData, setChatbotData] = useState<any>(null);

  const userAccess = userChatbots.find(access => access.chatbotId === chatbotId);

  useEffect(() => {
    if (!chatbotId || !userAccess || !currentUser) return;

    // Only allow users with analytics permission
    if (!hasPermission(chatbotId as string, 'analytics')) {
      router.push('/');
      return;
    }

    // Get chatbot details
    const chatbotInfo = {
      '67e1a69d8d8897908c0daa05': { name: 'Bot Experts Assistant', description: 'AI assistant for bot queries' },
      '68478243f8ed8305c0fcc8fb': { name: 'Bot Experts Support', description: 'Technical support assistant' }
    };

    setChatbotData(chatbotInfo[chatbotId as string]);

    // Generate SSO token for Chat Data access
    const generateDashboardUrl = async () => {
      try {
        const response = await fetch('/api/get-sso-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatbotId: chatbotId,
            name: currentUser.displayName || 'User',
            email: currentUser.email || '',
            avatar: currentUser.photoURL || 'https://www.chat-data.com/storage/public/image/avatar_654d8b8bc90461189b362f35.png',
            role: userAccess.role,
            permissions: userAccess.permissions,
          }),
        });

        const { ssoToken } = await response.json();
        // Use the whitelabel domain for SSO
        const url = `https://chatbot.botexperts.ai/api/v1/auth/sso?companyid=${process.env.NEXT_PUBLIC_COMPANY_ID}&ssoToken=${ssoToken}&redirect=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URL || '')}`;
        setDashboardUrl(url);
      } catch (error) {
        console.error('Error generating dashboard URL:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateDashboardUrl();
  }, [chatbotId, userAccess, hasPermission, router, currentUser]);

  if (!chatbotData || !userAccess || isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">{chatbotData.name}</h1>
              <p className="text-gray-600 mt-2">
                Your access level: <span className="font-medium capitalize">{userAccess.role}</span> - Dashboard Only
              </p>
            </div>
            <Link href="/">
              <Button variant="ghost">← Back to Chatbots</Button>
            </Link>
          </div>

          {/* Tab Navigation - Only Dashboard visible */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
                  Dashboard
                </button>
                <span className="py-2 px-1 text-sm font-medium text-gray-400 cursor-not-allowed">
                  Settings (No Access)
                </span>
                <span className="py-2 px-1 text-sm font-medium text-gray-400 cursor-not-allowed">
                  Sources (No Access)
                </span>
                <span className="py-2 px-1 text-sm font-medium text-gray-400 cursor-not-allowed">
                  Integrations (No Access)
                </span>
              </nav>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="space-y-6">
            {/* HTTPS Notice for Local Development */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-amber-900">Local Development Notice</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Chat Data requires HTTPS for iframe embedding. Since you're on localhost, the dashboard will open in a new tab instead.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Access Chat Data Button */}
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Chat Data Analytics Dashboard</h3>
                    <p className="text-gray-600">Access your chatbot's real-time analytics and performance metrics</p>
                  </div>
                  
                  {dashboardUrl ? (
                    <div className="space-y-3">
                      <Button 
                        onClick={() => {
                          console.log('Opening dashboard URL:', dashboardUrl);
                          window.open(dashboardUrl, '_blank')
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M14 1l6 6m0 0l-6 6m6-6H10" />
                        </svg>
                        Open Chat Data Dashboard
                      </Button>
                      <details className="text-xs text-gray-500">
                        <summary className="cursor-pointer">Debug: View SSO URL</summary>
                        <div className="mt-2 p-2 bg-gray-100 rounded text-xs break-all">
                          {dashboardUrl}
                        </div>
                      </details>
                    </div>
                  ) : (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Opens in a new tab with your viewer permissions
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Role Restrictions Notice */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-blue-900">Viewer Access Restrictions</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      You have read-only access to the Dashboard tab only. You cannot access Settings, Sources, or Integrations. 
                      To modify chatbot configurations, contact your administrator.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}