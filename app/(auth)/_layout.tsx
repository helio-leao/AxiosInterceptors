import { useSession } from "@/contexts/session";
import { Redirect, Stack } from "expo-router";

export default () => {
  const { session } = useSession();

  if (!session) {
    return <Redirect href={"/"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="home" options={{ title: "Home" }} />
      <Stack.Screen name="accounts" options={{ title: "Accounts" }} />
    </Stack>
  );
};
