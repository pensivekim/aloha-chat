import { useState } from "react";
import { Baby, Heart, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../contexts/AuthContext";

export default function SignupPage({ t }) {
  const { saveFacilityProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [facilityType, setFacilityType] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (!facilityType) return;
    setStep(2);
  };

  const handleBack = () => {
    setError("");
    setStep(1);
  };

  const handleComplete = async () => {
    if (!facilityName.trim()) return;
    setError("");
    setLoading(true);
    try {
      await saveFacilityProfile({
        facilityType,
        facilityName: facilityName.trim(),
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      handleComplete();
    }
  };

  return (
    <AuthLayout title="Aloha" subtitle={`${t.facilitySetup} — ${t.step} ${step}/2`}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center font-medium">{t.selectFacilityType}</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFacilityType("child")}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                facilityType === "child"
                  ? "border-orange-400 bg-orange-50"
                  : "border-gray-200 hover:border-orange-200"
              }`}
            >
              <Baby className={`w-8 h-8 ${facilityType === "child" ? "text-orange-500" : "text-gray-400"}`} />
              <span className="text-sm font-medium text-gray-700">{t.childCare}</span>
              <span className="text-xs text-gray-400">{t.childCareDesc}</span>
            </button>
            <button
              onClick={() => setFacilityType("elderly")}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                facilityType === "elderly"
                  ? "border-orange-400 bg-orange-50"
                  : "border-gray-200 hover:border-orange-200"
              }`}
            >
              <Heart className={`w-8 h-8 ${facilityType === "elderly" ? "text-orange-500" : "text-gray-400"}`} />
              <span className="text-sm font-medium text-gray-700">{t.elderlyCare}</span>
              <span className="text-xs text-gray-400">{t.elderlyCareDesc}</span>
            </button>
          </div>
          <button
            onClick={handleNext}
            disabled={!facilityType}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.next} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t.facilityName}</label>
            <input
              type="text"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.facilityNamePlaceholder}
              autoFocus
              className="w-full rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBack}
              className="flex-1 border border-orange-200 text-orange-500 rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-orange-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> {t.back}
            </button>
            <button
              onClick={handleComplete}
              disabled={!facilityName.trim() || loading}
              className="flex-1 bg-orange-400 hover:bg-orange-500 text-white rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" /> {t.complete}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
