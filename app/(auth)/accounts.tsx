import useAuthApi from "@/api/useAuthApi";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function Account() {
  const api = useAuthApi();
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api("/accounts");
        setAccounts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccounts();
  }, []);

  return (
    <View style={{ margin: 20 }}>
      <Text>{JSON.stringify(accounts, null, 2)}</Text>
    </View>
  );
}
