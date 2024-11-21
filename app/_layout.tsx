import { SessionProvider } from "@/contexts/session";
import { Slot } from "expo-router";

export default () => {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
};
