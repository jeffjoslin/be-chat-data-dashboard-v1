import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getUserChatbots, getRole, getUserRoleForChatbot } from '@/lib/firestore';
import { ChatbotAccess, Permission } from '@/types/rbac';

interface PermissionContextType {
  userChatbots: ChatbotAccess[];
  loading: boolean;
  hasPermission: (chatbotId: string, permission: keyof Permission) => boolean;
  getUserPermissionsForChatbot: (chatbotId: string) => Permission | null;
  refreshPermissions: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [userChatbots, setUserChatbots] = useState<ChatbotAccess[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPermissions = async () => {
    if (!currentUser) {
      setUserChatbots([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const chatbots = await getUserChatbots(currentUser.uid);
      
      const chatbotAccess: ChatbotAccess[] = await Promise.all(
        chatbots.map(async ({ chatbotId, role }) => {
          const roleData = await getRole(role.roleId);
          
          // Get chatbot name from environment variables or a mapping
          const chatbotName = getChatbotName(chatbotId);
          
          return {
            chatbotId,
            chatbotName,
            role: role.roleId as 'admin' | 'editor' | 'viewer',
            permissions: roleData?.permissions || {
              settings: false,
              analytics: false,
              chatbotConfig: false,
              userManagement: false,
            },
          };
        })
      );

      setUserChatbots(chatbotAccess);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      setUserChatbots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPermissions();
  }, [currentUser]);

  const hasPermission = (chatbotId: string, permission: keyof Permission): boolean => {
    const chatbot = userChatbots.find(c => c.chatbotId === chatbotId);
    return chatbot?.permissions[permission] || false;
  };

  const getUserPermissionsForChatbot = (chatbotId: string): Permission | null => {
    const chatbot = userChatbots.find(c => c.chatbotId === chatbotId);
    return chatbot?.permissions || null;
  };

  const refreshPermissions = async () => {
    await fetchUserPermissions();
  };

  const value = {
    userChatbots,
    loading,
    hasPermission,
    getUserPermissionsForChatbot,
    refreshPermissions,
  };

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
};

// Helper function to get chatbot name from ID
function getChatbotName(chatbotId: string): string {
  // In a real app, this would come from a database or API
  const chatbotNames: Record<string, string> = {
    [process.env.NEXT_PUBLIC_CHATBOT_ID_1 || '']: 'Bot Experts Assistant',
    [process.env.NEXT_PUBLIC_CHATBOT_ID_2 || '']: 'Bot Experts Support',
  };
  
  return chatbotNames[chatbotId] || 'Unnamed Chatbot';
}