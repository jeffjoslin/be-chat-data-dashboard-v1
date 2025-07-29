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
    visibility: string;
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

    // For viewers, redirect to analytics page
    if (userAccess.role === 'viewer') {
      router.push(`/chatbot/${chatbot.id}/analytics`);
      return;
    }

    // For editors, redirect to limited Chat Data access
    if (userAccess.role === 'editor') {
      router.push(`/chatbot/${chatbot.id}/manage`);
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
          permissions: userAccess?.permissions, // Include detailed permissions
          roleLevel: userAccess?.role === 'admin' ? 'admin' : userAccess?.role === 'editor' ? 'editor' : 'viewer'
        }),
      });

      const { ssoToken } = await response.json();
      
      // Use whitelabel domain for SSO
      const ssoUrl = 'https://chatbot.botexperts.ai/api/v1/auth/sso?companyid=' +
            process.env.NEXT_PUBLIC_COMPANY_ID +
            '&ssoToken=' +
            ssoToken +
            '&redirect=' +
            encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URL || '');
      console.log('Admin SSO URL:', ssoUrl);
      router.push(ssoUrl);
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
        <Card className="w-[300px] h-[400px] flex items-center justify-center hover:shadow-lg bg-gradient-to-b from-blue-25 to-blue-100 border border-blue-200 shadow-md">
          <div className="text-center space-y-4">
            {/* Chatbot Icon - 20% larger */}
            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden">
              <img
                src={chatbot.imageUrl}
                alt={chatbot.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Chatbot Name */}
            <h3 className="text-xl font-semibold text-center text-gray-700">{chatbot.name}</h3>
            
            {/* Visibility Badge */}
            <div className="flex justify-center">
              <span className={`px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1 ${
                chatbot.visibility === 'public' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  chatbot.visibility === 'public' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></span>
                {chatbot.visibility === 'public' ? 'Public' : 'Private'}
              </span>
            </div>
          </div>
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