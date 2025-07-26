import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionContext";
import { RoleBadge } from "@/components/rbac/RoleBadge";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ChatbotAccess } from "@/types/rbac";

interface ChatbotCardProps {
  chatbot: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  };
  userAccess?: ChatbotAccess;
}

export function ChatbotCard({ chatbot, userAccess }: ChatbotCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPermissionDenied, setShowPermissionDenied] = useState(false);
  const router = useRouter();
  const { currentUser } = useAuth();
  const { hasPermission } = usePermissions();

  const handleClick = async () => {
    if (isLoading || !currentUser) return;

    // Check if user has at least analytics permission (minimum required)
    if (!userAccess || !hasPermission(chatbot.id, 'analytics')) {
      setShowPermissionDenied(true);
      return;
    }
    
    try {
      setIsLoading(true);

      const response = await fetch('/api/get-sso-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          chatbotId: chatbot.id,
          name: currentUser.displayName || 'User',
          email: currentUser.email || '',
          avatar: currentUser.photoURL || 'https://www.chat-data.com/storage/public/image/avatar_654d8b8bc90461189b362f35.png',
          role: userAccess?.role, // Include role in SSO token
        }),
      });

      const { ssoToken } = await response.json();
      
      router.push('https://chatbot.chat-data.online/api/v1/auth/sso?companyid=' +
            process.env.NEXT_PUBLIC_COMPANY_ID +
            '&ssoToken=' +
            ssoToken +
            '&redirect=' +
            process.env.NEXT_PUBLIC_REDIRECT_URL)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        className={`
          cursor-pointer 
          transition-all duration-200 
          hover:scale-105
          ${isLoading ? 'opacity-70 pointer-events-none' : ''}
          ${!userAccess ? 'opacity-50' : ''}
        `}
        onClick={handleClick}
      >
        <Card className="w-[300px] h-[400px] flex flex-col hover:shadow-lg">
        <CardHeader className="flex-none text-center relative">
          {userAccess && (
            <div className="absolute top-2 right-2">
              <RoleBadge role={userAccess.role} />
            </div>
          )}
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
            <img
              src={chatbot.imageUrl}
              alt={chatbot.name}
              className="w-full h-full object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <h3 className="text-xl font-semibold text-center mb-2">{chatbot.name}</h3>
          <p className="text-sm text-muted-foreground text-center">
            {chatbot.description}
          </p>
          
          {userAccess && (
            <div className="mt-4 text-xs text-center text-gray-500">
              <p>Access Level: {userAccess.role}</p>
              <div className="mt-2 flex flex-wrap gap-1 justify-center">
                {userAccess.permissions.analytics && (
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">Analytics</span>
                )}
                {userAccess.permissions.settings && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Settings</span>
                )}
                {userAccess.permissions.chatbotConfig && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Config</span>
                )}
                {userAccess.permissions.userManagement && (
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded">Users</span>
                )}
              </div>
            </div>
          )}
          
          {!userAccess && (
            <p className="mt-4 text-sm text-center text-red-600">
              No Access
            </p>
          )}
        </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={showPermissionDenied}
        onClose={() => setShowPermissionDenied(false)}
        title="Permission Denied"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            You don&apos;t have permission to access this chatbot. Please contact your administrator.
          </p>
          <Button onClick={() => setShowPermissionDenied(false)}>
            OK
          </Button>
        </div>
      </Modal>
    </>
  );
}