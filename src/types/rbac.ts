export type RoleName = 'admin' | 'editor' | 'viewer';

export interface Permission {
  settings: boolean;
  analytics: boolean;
  chatbotConfig: boolean;
  userManagement: boolean;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ChatbotAccess {
  chatbotId: string;
  chatbotName?: string;
  role: RoleName;
  permissions: Permission;
}