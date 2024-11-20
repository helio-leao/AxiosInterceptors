import { SessionProvider } from "@/contexts/auth";
import { Stack } from "expo-router";

export default () => {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Login" }} />
        <Stack.Screen name="home" options={{ title: "Home" }} />
        <Stack.Screen name="accounts" options={{ title: "Accounts" }} />
      </Stack>
    </SessionProvider>
  );
};
