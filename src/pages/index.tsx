import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ChatbotCard } from "@/components/ChatbotCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionContext";
import { Button } from "@/components/ui/button";
import { ErrorPopup } from "@/components/ui/error-popup";
import Link from "next/link";

// Test chatbot ID for development
const TEST_CHATBOT_ID = "67e1a69d8d8897908c0daa05";

interface ChatbotData {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  visibility: string;
}

export default function Home() {
  const { currentUser, logout } = useAuth();
  const { userChatbots, loading: permissionsLoading } = usePermissions();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [chatbots, setChatbots] = useState<ChatbotData[]>([]);
  const [loadingChatbots, setLoadingChatbots] = useState(true);
  const [error, setError] = useState<{message: string; details?: string} | null>(null);

  // Fetch chatbot data from API
  const fetchChatbotData = async () => {
    try {
      setLoadingChatbots(true);
      setError(null);
      
      console.log(`Fetching chatbot data for ID: ${TEST_CHATBOT_ID}`);
      
      const response = await fetch(`/api/get-chatbot-info?chatbotId=${TEST_CHATBOT_ID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to fetch chatbot data');
      }

      const chatbotData = await response.json();
      // Debug the API response
      console.log('=== API RESPONSE DEBUG ===');
      console.log('Raw API Response:', JSON.stringify(chatbotData, null, 2));
      console.log('Available fields:', Object.keys(chatbotData));
      console.log('profilePictureFile:', chatbotData.profilePictureFile);
      console.log('name:', chatbotData.name);
      console.log('visibility:', chatbotData.visibility);
      
      // Store in window for debugging
      (window as any).lastApiResponse = chatbotData;

      // Extract chatbot data from nested response
      const botData = chatbotData.chatbot || chatbotData;
      
      // Transform API response to our format
      const transformedChatbot: ChatbotData = {
        id: botData.chatbotId || TEST_CHATBOT_ID,
        name: botData.chatbotName || botData.styles?.displayName || 'Unknown Bot',
        imageUrl: botData.styles?.profilePictureFile ? `https://www.chat-data.com${botData.styles.profilePictureFile}` : 'https://www.chat-data.com/logo.png',
        description: botData.basePrompt ? botData.basePrompt.substring(0, 100) + '...' : 'AI assistant for your queries',
        visibility: botData.visibility || 'private'
      };

      console.log('Transformed chatbot:', transformedChatbot);

      setChatbots([transformedChatbot]);
    } catch (err: any) {
      console.error('Error fetching chatbot data:', err);
      setError({
        message: 'Failed to load chatbot information',
        details: err.message
      });
    } finally {
      setLoadingChatbots(false);
    }
  };

  // Load chatbot data when component mounts
  useEffect(() => {
    if (currentUser) {
      fetchChatbotData();
    }
  }, [currentUser]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">Your Chatbots</h1>
              <p className="text-muted-foreground mt-2">
                Welcome, {currentUser?.displayName || currentUser?.email}
              </p>
            </div>
            
            <div className="flex gap-4">
              {/* Check if user has any admin permissions */}
              {userChatbots.some(access => access.permissions.userManagement) && (
                <Link href="/admin/users">
                  <Button variant="secondary">
                    Manage Users
                  </Button>
                </Link>
              )}
              
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>

          {/* Loading state */}
          {permissionsLoading || loadingChatbots ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-600">
                  {permissionsLoading ? 'Loading permissions...' : 'Loading chatbots...'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chatbots with access */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {chatbots.map((chatbot) => {
                  const userAccess = userChatbots.find(
                    access => access.chatbotId === chatbot.id
                  );
                  
                  return (
                    <ChatbotCard 
                      key={chatbot.id} 
                      chatbot={chatbot}
                      userAccess={userAccess}
                    />
                  );
                })}
              </div>

              {/* No chatbots loaded */}
              {chatbots.length === 0 && !error && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">
                    No chatbots available.
                  </p>
                  <Button 
                    onClick={fetchChatbotData}
                    variant="ghost"
                    className="mt-4"
                  >
                    Refresh
                  </Button>
                </div>
              )}

              {/* No access message */}
              {userChatbots.length === 0 && chatbots.length > 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">
                    You don&apos;t have access to any chatbots yet.
                  </p>
                  <p className="text-gray-400 mt-2">
                    Please contact your administrator to request access.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Error Popup */}
          <ErrorPopup
            isOpen={!!error}
            onClose={() => setError(null)}
            onRetry={fetchChatbotData}
            title="Failed to Load Chatbot"
            message={error?.message || ''}
            details={error?.details}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}