import { Permission } from '@/types/rbac';

export const DEFAULT_PERMISSIONS: Record<string, Permission> = {
  admin: {
    settings: true,
    analytics: true,
    chatbotConfig: true,
    userManagement: true,
  },
  editor: {
    settings: true,
    analytics: true,
    chatbotConfig: true,
    userManagement: false,
  },
  viewer: {
    settings: false,
    analytics: true,
    chatbotConfig: false,
    userManagement: false,
  },
};

export const getPermissionLabel = (permission: keyof Permission): string => {
  const labels: Record<keyof Permission, string> = {
    settings: 'Settings',
    analytics: 'Analytics & Reports',
    chatbotConfig: 'Chatbot Configuration',
    userManagement: 'User Management',
  };
  
  return labels[permission];
};

export const getRoleLabel = (role: string): string => {
  const labels: Record<string, string> = {
    admin: 'Administrator',
    editor: 'Editor',
    viewer: 'Viewer',
  };
  
  return labels[role] || role;
};

export const getRoleColor = (role: string): string => {
  const colors: Record<string, string> = {
    admin: 'bg-red-100 text-red-800',
    editor: 'bg-blue-100 text-blue-800',
    viewer: 'bg-gray-100 text-gray-800',
  };
  
  return colors[role] || 'bg-gray-100 text-gray-800';
};