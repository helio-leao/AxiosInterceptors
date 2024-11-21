import useAuthApi from "@/api/useAuthApi";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";

export default function Account() {
  const api = useAuthApi();
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api("/accounts");
        setAccounts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccounts();
  }, []);

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} size={"large"} />;
  }

  return (
    <View style={{ margin: 20 }}>
      <Text>{JSON.stringify(accounts, null, 2)}</Text>
    </View>
  );
}
