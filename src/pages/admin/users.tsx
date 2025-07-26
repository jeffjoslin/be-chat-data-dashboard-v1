import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { RoleBadge } from '@/components/rbac/RoleBadge';
import { Modal } from '@/components/ui/modal';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc,
  deleteDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface UserWithRoles {
  uid: string;
  email: string;
  name: string;
  chatbotRoles: Array<{
    chatbotId: string;
    chatbotName: string;
    role: string;
  }>;
}

export default function UserManagementPage() {
  const { currentUser } = useAuth();
  const { hasPermission, userChatbots } = usePermissions();
  const router = useRouter();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState('');
  const [selectedRole, setSelectedRole] = useState('viewer');

  // Check if current user has admin access to any chatbot
  const isAdmin = userChatbots.some(access => access.permissions.userManagement);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
    } else {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      
      const usersData: UserWithRoles[] = [];
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userRolesSnapshot = await getDocs(
          collection(db, 'userRoles', userDoc.id, 'chatbots')
        );
        
        const chatbotRoles = userRolesSnapshot.docs.map(doc => ({
          chatbotId: doc.id,
          chatbotName: getChatbotName(doc.id),
          role: doc.data().roleId,
        }));
        
        usersData.push({
          uid: userDoc.id,
          email: userData.email,
          name: userData.name,
          chatbotRoles,
        });
      }
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedChatbot || !currentUser) return;
    
    try {
      await setDoc(
        doc(db, 'userRoles', selectedUser.uid, 'chatbots', selectedChatbot),
        {
          roleId: selectedRole,
          assignedAt: new Date(),
          assignedBy: currentUser.uid,
        }
      );
      
      await fetchUsers();
      setShowRoleModal(false);
      setSelectedUser(null);
      setSelectedChatbot('');
      setSelectedRole('viewer');
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  };

  const handleRemoveRole = async (userId: string, chatbotId: string) => {
    if (!confirm('Are you sure you want to remove this user\'s access?')) return;
    
    try {
      await deleteDoc(doc(db, 'userRoles', userId, 'chatbots', chatbotId));
      await fetchUsers();
    } catch (error) {
      console.error('Error removing role:', error);
    }
  };

  const getChatbotName = (chatbotId: string): string => {
    const chatbotNames: Record<string, string> = {
      [process.env.NEXT_PUBLIC_CHATBOT_ID_1 || '']: 'Bot Experts Assistant',
      [process.env.NEXT_PUBLIC_CHATBOT_ID_2 || '']: 'Bot Experts Support',
    };
    return chatbotNames[chatbotId] || 'Unknown Chatbot';
  };

  const adminChatbots = userChatbots.filter(access => access.permissions.userManagement);

  if (!isAdmin) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">User Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage user access and permissions
              </p>
            </div>
            
            <Link href="/">
              <Button variant="ghost">
                Back to Chatbots
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map(user => (
                <Card key={user.uid}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleModal(true);
                        }}
                      >
                        Assign Role
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {user.chatbotRoles.length > 0 ? (
                      <div className="space-y-2">
                        {user.chatbotRoles.map(({ chatbotId, chatbotName, role }) => {
                          // Only show chatbots the admin has access to
                          if (!adminChatbots.some(c => c.chatbotId === chatbotId)) {
                            return null;
                          }
                          
                          return (
                            <div 
                              key={chatbotId}
                              className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded"
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{chatbotName}</span>
                                <RoleBadge role={role} />
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleRemoveRole(user.uid, chatbotId)}
                              >
                                Remove
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500">No chatbot access assigned</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Role Assignment Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedUser(null);
          setSelectedChatbot('');
          setSelectedRole('viewer');
        }}
        title="Assign Role"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Assigning role for: <strong>{selectedUser?.name}</strong>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Select Chatbot</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={selectedChatbot}
              onChange={(e) => setSelectedChatbot(e.target.value)}
            >
              <option value="">Choose a chatbot...</option>
              {adminChatbots.map(chatbot => (
                <option key={chatbot.chatbotId} value={chatbot.chatbotId}>
                  {chatbot.chatbotName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Select Role</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setShowRoleModal(false);
                setSelectedUser(null);
                setSelectedChatbot('');
                setSelectedRole('viewer');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignRole}
              disabled={!selectedChatbot}
            >
              Assign Role
            </Button>
          </div>
        </div>
      </Modal>
    </ProtectedRoute>
  );
}