import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionContext';

export const PermissionsDebug: React.FC = () => {
  const { currentUser } = useAuth();
  const { userChatbots, loading } = usePermissions();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>Debug Info:</h4>
      <p><strong>User ID:</strong> {currentUser?.uid || 'Not logged in'}</p>
      <p><strong>Email:</strong> {currentUser?.email || 'N/A'}</p>
      <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
      <p><strong>Chatbot Access Count:</strong> {userChatbots.length}</p>
      
      {userChatbots.map((chatbot, index) => (
        <div key={index} style={{ marginTop: '10px', border: '1px solid #eee', padding: '5px' }}>
          <p><strong>Chatbot:</strong> {chatbot.chatbotId}</p>
          <p><strong>Role:</strong> {chatbot.role}</p>
          <p><strong>Permissions:</strong></p>
          <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
            <li>Settings: {chatbot.permissions.settings ? '✅' : '❌'}</li>
            <li>Analytics: {chatbot.permissions.analytics ? '✅' : '❌'}</li>
            <li>Config: {chatbot.permissions.chatbotConfig ? '✅' : '❌'}</li>
            <li>Users: {chatbot.permissions.userManagement ? '✅' : '❌'}</li>
          </ul>
        </div>
      ))}
    </div>
  );
};