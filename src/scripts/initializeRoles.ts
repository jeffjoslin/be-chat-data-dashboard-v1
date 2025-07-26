import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCc233TnkKRbgC8fNNBTup21OzyvjVji6c",
  authDomain: "be-chat-data-dashboard.firebaseapp.com",
  projectId: "be-chat-data-dashboard",
  storageBucket: "be-chat-data-dashboard.firebasestorage.app",
  messagingSenderId: "1002828430896",
  appId: "1:1002828430896:web:3e4145f7456c2b3a7af7f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeDefaultRoles() {
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

  console.log('Starting role initialization...\n');

  for (const role of roles) {
    try {
      console.log(`Creating role: ${role.name} (${role.id})`);
      const roleRef = doc(db, 'roles', role.id);
      await setDoc(roleRef, {
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
      console.log(`✅ Successfully created ${role.name} role`);
    } catch (error) {
      console.error(`❌ Failed to create ${role.name} role:`, error);
    }
  }

  console.log('\nRole initialization complete!');
  console.log('\nIMPORTANT: Remember to update your Firestore security rules to restrict write access after initialization.');
}

// Run the initialization
initializeDefaultRoles()
  .then(() => {
    console.log('\nExiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nError during initialization:', error);
    process.exit(1);
  });