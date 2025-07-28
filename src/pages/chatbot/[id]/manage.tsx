import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function ChatbotManage() {
  const router = useRouter();
  const { id: chatbotId } = router.query;
  const { currentUser } = useAuth();
  const { hasPermission, userChatbots } = usePermissions();
  const [chatbotData, setChatbotData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('settings');

  const userAccess = userChatbots.find(access => access.chatbotId === chatbotId);

  useEffect(() => {
    if (!chatbotId || !userAccess) return;

    // Only allow editors and admins
    if (!hasPermission(chatbotId as string, 'settings')) {
      router.push('/');
      return;
    }

    // Get chatbot details
    const chatbotInfo = {
      '67e1a69d8d8897908c0daa05': { name: 'Bot Experts Assistant', description: 'AI assistant for bot queries' },
      '68478243f8ed8305c0fcc8fb': { name: 'Bot Experts Support', description: 'Technical support assistant' }
    };

    setChatbotData(chatbotInfo[chatbotId as string]);
  }, [chatbotId, userAccess, hasPermission, router]);

  const handleFullAccess = async () => {
    if (!userAccess || !currentUser) return;

    // Only admins get full Chat Data access
    if (userAccess.role !== 'admin') {
      alert('Only administrators can access the full Chat Data interface.');
      return;
    }

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
      
      window.location.href = `https://chatbot.chat-data.online/api/v1/auth/sso?companyid=${process.env.NEXT_PUBLIC_COMPANY_ID}&ssoToken=${ssoToken}&redirect=${process.env.NEXT_PUBLIC_REDIRECT_URL}`;
    } catch (error) {
      console.error('SSO redirect error:', error);
    }
  };

  if (!chatbotData || !userAccess) {
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
              <h1 className="text-3xl font-bold">{chatbotData.name} - Management</h1>
              <p className="text-gray-600 mt-2">
                Your access level: <span className="font-medium capitalize">{userAccess.role}</span>
              </p>
            </div>
            <div className="flex gap-3">
              {userAccess.role === 'admin' && (
                <Button onClick={handleFullAccess}>
                  Full Chat Data Access
                </Button>
              )}
              <Link href="/">
                <Button variant="ghost">← Back to Dashboard</Button>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-6 mb-8 border-b">
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-2 px-1 ${activeTab === 'settings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-2 px-1 ${activeTab === 'analytics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              Analytics
            </button>
            {hasPermission(chatbotId as string, 'chatbotConfig') && (
              <button
                onClick={() => setActiveTab('configuration')}
                className={`pb-2 px-1 ${activeTab === 'configuration' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                Configuration
              </button>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Basic Settings</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Chatbot Name</label>
                      <input 
                        type="text" 
                        value={chatbotData.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        readOnly={userAccess.role === 'viewer'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea 
                        value={chatbotData.description}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                        readOnly={userAccess.role === 'viewer'}
                      />
                    </div>
                    {userAccess.role !== 'viewer' && (
                      <Button>Save Changes</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">This Week</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">324</div>
                    <p className="text-sm text-gray-600">Conversations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Response Time</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.2s</div>
                    <p className="text-sm text-gray-600">Average</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Satisfaction</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.1/5</div>
                    <p className="text-sm text-gray-600">User Rating</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'configuration' && hasPermission(chatbotId as string, 'chatbotConfig') && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Advanced Configuration</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Response Style</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option>Professional</option>
                        <option>Friendly</option>
                        <option>Technical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Max Response Length</label>
                      <input 
                        type="number" 
                        value={150}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <Button>Update Configuration</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Access Level Notice */}
          <Card className="mt-8 bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-green-900">
                    {userAccess.role === 'admin' ? 'Administrator Access' : 'Editor Access'}
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    {userAccess.role === 'admin' 
                      ? 'You have full access to all chatbot management features.'
                      : 'You can modify settings and view analytics. Contact an administrator for advanced features.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}