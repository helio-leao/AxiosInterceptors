import {
  STORAGE_ACCESS_TOKEN_KEY,
  STORAGE_REFRESH_TOKEN_KEY,
} from "@/constants/storageKeys";
import storage from "@react-native-async-storage/async-storage";

export async function logout() {
  await storage.removeItem(STORAGE_ACCESS_TOKEN_KEY);
  await storage.removeItem(STORAGE_REFRESH_TOKEN_KEY);
}

export async function login(accessToken: string, refreshToken: string) {
  await storage.setItem(STORAGE_ACCESS_TOKEN_KEY, accessToken);
  await storage.setItem(STORAGE_REFRESH_TOKEN_KEY, refreshToken);
}
