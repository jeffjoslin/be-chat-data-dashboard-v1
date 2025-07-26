import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ChatbotCard } from "@/components/ChatbotCard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// This would typically come from an environment variable or API
const chatbots = [
  {
    id: process.env.NEXT_PUBLIC_CHATBOT_ID_1!,
    name: "Bot Experts Assistant",
    imageUrl: "https://www.chat-data.com/logo.png",
    description: "Your AI-powered assistant for all bot-related queries",
  },
  {
    id: process.env.NEXT_PUBLIC_CHATBOT_ID_2!,
    name: "Bot Experts Support",
    imageUrl: "https://www.chat-data.com/storage/public/image/avatar_654d8b8bc90461189b362f35.png",
    description: "Technical support and troubleshooting assistant",
  },
];

export default function Home() {
  const { currentUser, logout } = useAuth();
  const { userChatbots, loading: permissionsLoading } = usePermissions();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
              <h1 className="text-4xl font-bold">My Chatbots</h1>
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
          {permissionsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
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

              {/* No access message */}
              {userChatbots.length === 0 && (
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
        </div>
      </div>
    </ProtectedRoute>
  );
}