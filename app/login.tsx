import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Redirect } from "expo-router";
import { useSession } from "@/contexts/session";
import useAuthApi from "@/api/useAuthApi";

export default function Login() {
  const { session, signIn } = useSession();
  const api = useAuthApi();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");

  const handleSignin = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/login", { username });
      const { accessToken, refreshToken } = response.data;
      await signIn(accessToken, refreshToken);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  if (session) {
    return <Redirect href={"/home"} />;
  }

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
