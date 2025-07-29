import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionContext';

export default function ChatbotAnalytics() {
  const router = useRouter();
  const { id: chatbotId } = router.query;
  const { currentUser } = useAuth();
  const { hasPermission, userChatbots } = usePermissions();
  const [isLoading, setIsLoading] = useState(true);

  const userAccess = userChatbots.find(access => access.chatbotId === chatbotId);

  useEffect(() => {
    if (!chatbotId || !userAccess || !currentUser) return;

    // Only allow users with analytics permission
    if (!hasPermission(chatbotId as string, 'analytics')) {
      router.push('/');
      return;
    }

    // Generate SSO token and redirect immediately
    const redirectToChatData = async () => {
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
        const url = `https://chatbot.botexperts.ai/api/v1/auth/sso?companyid=${process.env.NEXT_PUBLIC_COMPANY_ID}&ssoToken=${ssoToken}&redirect=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URL || '')}`;
        
        // Redirect immediately
        window.location.href = url;
      } catch (error) {
        console.error('Error generating SSO URL:', error);
        setIsLoading(false);
      }
    };

    redirectToChatData();
  }, [chatbotId, userAccess, hasPermission, router, currentUser]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to Chat Data...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}