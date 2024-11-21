import { ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useSession } from "@/contexts/session";

export default function Index() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} size={"large"} />;
  }

  if (session) {
    return <Redirect href={"home"} />;
  } else {
    return <Redirect href={"login"} />;
  }
}
