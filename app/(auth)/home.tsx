import { View, Button } from "react-native";
import { router } from "expo-router";
import { useSession } from "@/contexts/session";

export default function Home() {
  const { signOut } = useSession();

  const handleShowAccounts = () => {
    router.push("accounts");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ margin: 20, gap: 10 }}>
      <Button title="ACCOUNTS" onPress={handleShowAccounts} />
      <Button title="SAIR" onPress={handleSignOut} />
    </View>
  );
}
