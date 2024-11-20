import Session from "@/types/Session";
import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
} from "react";

const AuthContext = createContext<{
  signIn: (accessToken: string, refreshToken: string) => void;
  signOut: () => void;
  session: Session | null;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
});

export function useSession() {
  const value = useContext(AuthContext);

  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);

  return (
    <AuthContext.Provider
      value={{
        signIn: (accessToken: string, refreshToken: string) => {
          setSession({ accessToken, refreshToken });
        },
        signOut: () => {
          setSession(null);
        },
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
