import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [facilityProfile, setFacilityProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    // 리다이렉트 결과 처리
    getRedirectResult(auth).catch(() => {});
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && db) {
        const docRef = doc(db, "facilities", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFacilityProfile(docSnap.data());
        } else {
          setFacilityProfile(null);
        }
      } else {
        setFacilityProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function loginWithGoogle() {
    return signInWithRedirect(auth, googleProvider);
  }

  async function saveFacilityProfile(facilityData) {
    if (!user || !db) return;
    const profile = {
      facilityType: facilityData.facilityType,
      facilityName: facilityData.facilityName,
      ownerUid: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, "facilities", user.uid), profile);
    setFacilityProfile(profile);
  }

  async function logout() {
    setFacilityProfile(null);
    return signOut(auth);
  }

  const value = {
    user,
    facilityProfile,
    loading,
    loginWithGoogle,
    saveFacilityProfile,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
