import { usePermissions } from '@/contexts/PermissionContext';
import { Permission } from '@/types/rbac';

interface PermissionWrapperProps {
  chatbotId: string;
  permission: keyof Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionWrapper: React.FC<PermissionWrapperProps> = ({ 
  chatbotId, 
  permission, 
  children, 
  fallback = null 
}) => {
  const { hasPermission } = usePermissions();
  
  if (hasPermission(chatbotId, permission)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};