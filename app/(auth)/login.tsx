import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { colors, typography } from "../../theme";
import { router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

// Login Screen Placeholder
export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
    try {
      await login(email, password);
      router.replace("/(main)");
    } catch (e) {
      setError("Login failed");
    }
    setLoading(false);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: colors.light.background,
      }}
    >
      <Text
        style={{
          fontFamily: typography.fontFamily.bold,
          fontSize: 28,
          color: colors.light.primary,
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Login
      </Text>
      <Text
        style={{
          fontFamily: typography.fontFamily.regular,
          fontSize: 16,
          color: colors.light.textSecondary,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        Sign in to your account
      </Text>
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ marginBottom: 12 }}
      />
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry={!showPassword}
        style={{ marginBottom: 4 }}
      />
      <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
        <Text
          style={{
            color: colors.light.primary,
            fontFamily: typography.fontFamily.medium,
            marginBottom: 12,
          }}
        >
          {showPassword ? "Hide password" : "Show password"}
        </Text>
      </TouchableOpacity>
      {error ? (
        <Text
          style={{
            color: colors.light.error,
            fontFamily: typography.fontFamily.medium,
            marginBottom: 8,
          }}
        >
          {error}
        </Text>
      ) : null}
      <Button
        title={loading ? "Login..." : "Login"}
        onPress={handleLogin}
        loading={loading}
      />
      <TouchableOpacity
        onPress={() => router.push("/(auth)/forgot-password")}
        style={{ marginTop: 16 }}
      >
        <Text
          style={{
            color: colors.light.warning,
            fontFamily: typography.fontFamily.medium,
            textAlign: "center",
          }}
        >
          Forgot your password?
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/(auth)/register")}
        style={{ marginTop: 8 }}
      >
        <Text
          style={{
            color: colors.light.secondary,
            fontFamily: typography.fontFamily.medium,
            textAlign: "center",
          }}
        >
          Create a new account
        </Text>
      </TouchableOpacity>
    </View>
  );
}
