import { useMemo } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { detectLang, getT } from "./utils/i18n";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatPage from "./pages/ChatPage";
import { Loader2 } from "lucide-react";

function AppRouter() {
  const lang = useMemo(() => detectLang(), []);
  const t = getT(lang);
  const { user, facilityProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </div>
    );
  }

  // 미인증 → Google 로그인
  if (!user) {
    return <LoginPage t={t} />;
  }

  // 인증됨 + 시설 프로필 없음 → 시설 등록
  if (!facilityProfile) {
    return <SignupPage t={t} />;
  }

  // 인증됨 + 시설 프로필 있음 → 채팅
  return <ChatPage t={t} />;
}

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
