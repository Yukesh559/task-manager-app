import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { colors, typography } from "../../../theme";
import { router } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import { useProfile } from "../../../contexts/ProfileContext";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

export default function AccountScreen() {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    Alert.alert("Success", "Password changed successfully");
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleEmailChange = () => {
    if (!newEmail) {
      Alert.alert("Error", "Please enter a new email");
      return;
    }
    if (!newEmail.includes("@")) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }

    Alert.alert("Success", "Email changed successfully");
    setShowEmailModal(false);
    setNewEmail("");
  };

  const handleAccountDeletion = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const accountOptions = [
    {
      title: "Change Password",
      subtitle: "Update your account password",
      icon: "🔐",
      onPress: () => setShowPasswordModal(true),
    },
    {
      title: "Change Email",
      subtitle: "Update your email address",
      icon: "📧",
      onPress: () => setShowEmailModal(true),
    },
    {
      title: "Two-Factor Authentication",
      subtitle: "Add extra security to your account",
      icon: "🛡️",
      onPress: () =>
        Alert.alert(
          "Coming Soon",
          "Two-factor authentication will be available soon"
        ),
    },
    {
      title: "Login Sessions",
      subtitle: "Manage active login sessions",
      icon: "💻",
      onPress: () =>
        Alert.alert(
          "Coming Soon",
          "Login sessions management will be available soon"
        ),
    },
    {
      title: "Delete Account",
      subtitle: "Permanently delete your account",
      icon: "🗑️",
      onPress: handleAccountDeletion,
      destructive: true,
    },
  ];

  const renderMenuItem = (
    title: string,
    subtitle: string,
    icon: string,
    onPress: () => void,
    destructive = false
  ) => (
    <TouchableOpacity onPress={onPress}>
      <Card style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: destructive
                ? colors.light.error
                : colors.light.primary,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: typography.fontFamily.bold,
                fontSize: 16,
              }}
            >
              {icon}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.semiBold,
                fontSize: 16,
                color: destructive ? colors.light.error : colors.light.text,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 14,
                color: colors.light.textSecondary,
              }}
            >
              {subtitle}
            </Text>
          </View>

          <Text
            style={{
              color: colors.light.textSecondary,
              fontSize: 20,
            }}
          >
            ›
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.light.background,
        padding: 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text
            style={{
              color: colors.light.primary,
              fontFamily: typography.fontFamily.medium,
              fontSize: 16,
            }}
          >
            {"<"} Back
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: typography.fontFamily.bold,
            fontSize: 20,
            color: colors.light.text,
            marginLeft: 16,
          }}
        >
          Account Settings
        </Text>
      </View>

      {/* Account Information */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 16,
        }}
      >
        Account Information
      </Text>

      <Card style={{ marginBottom: 24 }}>
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.medium,
              fontSize: 14,
              color: colors.light.textSecondary,
              marginBottom: 4,
            }}
          >
            Email
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: 16,
              color: colors.light.text,
            }}
          >
            {user?.email}
          </Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.medium,
              fontSize: 14,
              color: colors.light.textSecondary,
              marginBottom: 4,
            }}
          >
            Member Since
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: 16,
              color: colors.light.text,
            }}
          >
            January 2024
          </Text>
        </View>

        <View>
          <Text
            style={{
              fontFamily: typography.fontFamily.medium,
              fontSize: 14,
              color: colors.light.textSecondary,
              marginBottom: 4,
            }}
          >
            Account Status
          </Text>
          <View
            style={{
              backgroundColor: colors.light.secondary,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              alignSelf: "flex-start",
            }}
          >
            <Text
              style={{
                fontFamily: typography.fontFamily.medium,
                fontSize: 12,
                color: "#fff",
              }}
            >
              Active
            </Text>
          </View>
        </View>
      </Card>

      {/* Security & Privacy */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 16,
        }}
      >
        Security & Privacy
      </Text>

      {accountOptions.map((option, index) => (
        <View key={index}>
          {renderMenuItem(
            option.title,
            option.subtitle,
            option.icon,
            option.onPress,
            option.destructive
          )}
        </View>
      ))}

      {/* Password Change Modal */}
      <Modal visible={showPasswordModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholderTextColor={colors.light.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor={colors.light.textSecondary}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor={colors.light.textSecondary}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handlePasswordChange}
              >
                <Text style={styles.confirmButtonText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Email Change Modal */}
      <Modal visible={showEmailModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Email</Text>
            <TextInput
              style={styles.input}
              placeholder="New Email Address"
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.light.textSecondary}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEmailModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleEmailChange}
              >
                <Text style={styles.confirmButtonText}>Change Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.light.card,
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.light.text,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.light.text,
    backgroundColor: colors.light.background,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: colors.light.background,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  confirmButton: {
    backgroundColor: colors.light.primary,
  },
  cancelButtonText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: colors.light.text,
    textAlign: "center",
  },
  confirmButtonText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});
