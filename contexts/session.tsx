import { STORAGE_REFRESH_TOKEN_KEY } from "@/constants/storageKeys";
import Session from "@/types/Session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
  useEffect,
} from "react";

const api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL });

const AuthContext = createContext<{
  signIn: (accessToken: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  session: Session | null;
  isLoading: boolean;
}>({
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  session: null,
  isLoading: true,
});

export function useSession() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const initSession = async () => {
      const refreshToken = await AsyncStorage.getItem(
        STORAGE_REFRESH_TOKEN_KEY
      );

      if (!refreshToken) return setIsLoading(false);

      try {
        const { data } = await api.post("/token", {
          refreshToken,
        });
        setSession({ accessToken: data.accessToken, refreshToken });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status) {
          await signOut();
        } else {
          console.error(error);
        }
      }
      setIsLoading(false);
    };
    initSession();
  }, []);

  const signIn = async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, refreshToken);
    setSession({ accessToken, refreshToken });
  };

  const signOut = async () => {
    const refreshToken = session?.refreshToken;
    if (refreshToken) {
      await api.delete("/logout", {
        data: { refreshToken },
      });
    }
    await AsyncStorage.removeItem(STORAGE_REFRESH_TOKEN_KEY);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
