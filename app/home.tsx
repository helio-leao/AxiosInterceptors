import { View, Button } from "react-native";
import { router } from "expo-router";
import storage from "@react-native-async-storage/async-storage";
import { STORAGE_REFRESH_TOKEN_KEY } from "@/constants/storageKeys";
import api from "@/api/axios";
import { logout } from "@/utils/auth";

export default function Home() {
  const handleShowAccounts = () => {
    router.push("/accounts");
  };

  const handleSignOut = async () => {
    try {
      const refreshToken = await storage.getItem(STORAGE_REFRESH_TOKEN_KEY);
      await api.delete("/logout", { data: { refreshToken } });
      await logout();
      router.replace("/");
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
