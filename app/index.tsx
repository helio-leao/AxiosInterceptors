import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import axios from "@/api/axios";
import { router } from "expo-router";
import storage from "@react-native-async-storage/async-storage";
import {
  STORAGE_ACCESS_TOKEN_KEY,
  STORAGE_REFRESH_TOKEN_KEY,
} from "@/constants/storageKeys";
import { login } from "@/utils/auth";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const verifySignedIn = async () => {
      const refreshToken = await storage.getItem(STORAGE_REFRESH_TOKEN_KEY);
      if (refreshToken) {
        router.replace("/home");
      }
    };
    verifySignedIn();
  }, []);

  const handleSignin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/login", { username });
      const { accessToken, refreshToken } = response.data;
      await login(accessToken, refreshToken);
      router.replace("/home");
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <View style={{ margin: 20, gap: 10 }}>
      <TextInput
        style={{ borderWidth: 1, borderRadius: 6, paddingHorizontal: 10 }}
        placeholder="username"
        value={username}
        onChangeText={setUsername}
      />
      <TouchableOpacity
        style={{
          backgroundColor: "#77f",
          padding: 10,
          borderRadius: 6,
        }}
        onPress={handleSignin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={"#fff"} />
        ) : (
          <Text style={{ textAlign: "center", color: "#fff" }}>SIGNIN</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
