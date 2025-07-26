import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface User {
  uid: string;
  email: string;
  name: string;
  createdAt: Timestamp;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: {
    settings: boolean;
    analytics: boolean;
    chatbotConfig: boolean;
    userManagement: boolean;
  };
}

export interface UserRole {
  roleId: string;
  assignedAt: Timestamp;
  assignedBy: string;
}

// User functions
export const createUser = async (uid: string, email: string, name: string) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    uid,
    email,
    name,
    createdAt: serverTimestamp(),
  });
};

export const getUser = async (uid: string): Promise<User | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as User;
  }
  return null;
};

// Role functions
export const getRole = async (roleId: string): Promise<Role | null> => {
  const roleRef = doc(db, 'roles', roleId);
  const roleSnap = await getDoc(roleRef);
  
  if (roleSnap.exists()) {
    return { id: roleSnap.id, ...roleSnap.data() } as Role;
  }
  return null;
};

export const getUserRoleForChatbot = async (
  userId: string, 
  chatbotId: string
): Promise<UserRole | null> => {
  const roleRef = doc(db, 'userRoles', userId, 'chatbots', chatbotId);
  const roleSnap = await getDoc(roleRef);
  
  if (roleSnap.exists()) {
    return roleSnap.data() as UserRole;
  }
  return null;
};

export const assignUserRole = async (
  userId: string,
  chatbotId: string,
  roleId: string,
  assignedBy: string
) => {
  const roleRef = doc(db, 'userRoles', userId, 'chatbots', chatbotId);
  await setDoc(roleRef, {
    roleId,
    assignedAt: serverTimestamp(),
    assignedBy,
  });
};

export const getUserChatbots = async (userId: string): Promise<Array<{chatbotId: string, role: UserRole}>> => {
  const chatbotsRef = collection(db, 'userRoles', userId, 'chatbots');
  const snapshot = await getDocs(chatbotsRef);
  
  return snapshot.docs.map(doc => ({
    chatbotId: doc.id,
    role: doc.data() as UserRole,
  }));
};

// Initialize default roles (run once during setup)
export const initializeDefaultRoles = async () => {
  const roles = [
    {
      id: 'admin',
      name: 'Admin',
      description: 'Full access to all features',
      permissions: {
        settings: true,
        analytics: true,
        chatbotConfig: true,
        userManagement: true,
      },
    },
    {
      id: 'editor',
      name: 'Editor',
      description: 'Can modify chatbot content and view analytics',
      permissions: {
        settings: true,
        analytics: true,
        chatbotConfig: true,
        userManagement: false,
      },
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access',
      permissions: {
        settings: false,
        analytics: true,
        chatbotConfig: false,
        userManagement: false,
      },
    },
  ];

  for (const role of roles) {
    const roleRef = doc(db, 'roles', role.id);
    await setDoc(roleRef, {
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
  }
};