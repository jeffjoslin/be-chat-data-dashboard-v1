import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { PermissionProvider } from "@/contexts/PermissionContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <PermissionProvider>
        <Component {...pageProps} />
      </PermissionProvider>
    </AuthProvider>
  );
}
