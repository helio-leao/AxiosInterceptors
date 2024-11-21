import axios from "@/api/axios";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function Account() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios("/accounts");
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
