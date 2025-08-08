import "../global.css";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

export default function Login() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <SafeAreaView className="flex-1 mt-10 bg-gray-100">
      <StatusBar barStyle="light-content" backgroundColor="#F37021" />

      {/* Top header */}


      {/* Content */}
      <View className="px-6 pt-7">
        <Text className="text-black text-[40px] leading-[44px] font-extrabold text-center tracking-tight">
          KANTOR POS 
          {"\n"}
          CIRRBON
        </Text>

        {/* Username */}
        <View className="mt-8">
          <Text className="text-neutral-400 text-[20px] mb-2">Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="test123"
            placeholderTextColor="#9CA3AF"
            keyboardType="default"
            autoCapitalize="none"
            className="w-full rounded-2xl bg-neutral-100 px-5 py-4 text-[18px] text-black"
          />
        </View>

        {/* Password */}
        <View className="mt-6">
          <Text className="text-neutral-400 text-[20px] mb-2">Password</Text>
          <View className="relative">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              className="w-full rounded-2xl bg-neutral-100 px-5 py-4 text-[18px] text-black pr-12"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((prev: boolean) => !prev)}
              style={{
                position: "absolute",
                right: 16,
                top: 0,
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Text className="text-neutral-400 text-[18px]">
                {showPassword ? "🙈" : "👁️"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (username === "test123" && password === "testpass123") {
              navigation.navigate("Maps" as never);
            } else {
              Alert.alert("Login failed", "Invalid username or password");
            }
          }}
          className="mt-7 rounded-2xl bg-[#F37021] py-4 items-center"
        >
          <Text className="text-white text-[22px] font-semibold">Log in</Text>
        </TouchableOpacity>

        {/* Forgot password */}
        <Text className="text-center text-neutral-400 text-[20px] mt-6">
          Lupa password?
        </Text>
      </View>
    </SafeAreaView>
  );
}