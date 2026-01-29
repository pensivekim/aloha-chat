import { MessageCircle } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl flex flex-col overflow-hidden border border-orange-100">
        <header className="bg-gradient-to-r from-orange-300 to-rose-300 px-5 py-6 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">{title}</h1>
          {subtitle && (
            <p className="text-sm text-white/80">{subtitle}</p>
          )}
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
