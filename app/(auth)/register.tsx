import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { colors, typography } from "../../theme";
import { router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

// Register Screen Placeholder
export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    if (!name || !email || !password || !confirm) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      await register(name, email, password);
      router.replace("/(main)");
    } catch (e) {
      setError("Register failed");
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
          color: colors.light.secondary,
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Register
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
        Create a new account
      </Text>
      <Input
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={{ marginBottom: 12 }}
      />
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
        secureTextEntry
        style={{ marginBottom: 12 }}
      />
      <Input
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Confirm Password"
        secureTextEntry
        style={{ marginBottom: 4 }}
      />
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
        title={loading ? "Register..." : "Register"}
        onPress={handleRegister}
        loading={loading}
      />
      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        style={{ marginTop: 16 }}
      >
        <Text
          style={{
            color: colors.light.primary,
            fontFamily: typography.fontFamily.medium,
            textAlign: "center",
          }}
        >
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
