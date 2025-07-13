import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { colors, typography } from "../../../theme";
import { router } from "expo-router";
import { Card } from "../../../components/ui/Card";

export default function PrivacyScreen() {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    showEmail: false,
    showPhone: false,
    allowNotifications: true,
    allowAnalytics: true,
    allowCrashReports: true,
    allowMarketing: false,
    autoSync: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDataExport = () => {
    Alert.alert(
      "Export Data",
      "Your data export request has been submitted. You will receive an email with the download link within 24 hours."
    );
  };

  const handleDataDeletion = () => {
    Alert.alert(
      "Delete Data",
      "Are you sure you want to delete all your data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Data Deletion",
              "Your data deletion request has been submitted. This process may take up to 30 days to complete."
            );
          },
        },
      ]
    );
  };

  const privacyOptions = [
    {
      title: "Profile Visibility",
      description: "Allow other team members to see your profile",
      value: settings.profileVisibility,
      onToggle: () => toggleSetting("profileVisibility"),
    },
    {
      title: "Show Email Address",
      description: "Display your email address to team members",
      value: settings.showEmail,
      onToggle: () => toggleSetting("showEmail"),
    },
    {
      title: "Show Phone Number",
      description: "Display your phone number to team members",
      value: settings.showPhone,
      onToggle: () => toggleSetting("showPhone"),
    },
    {
      title: "Push Notifications",
      description: "Receive push notifications for updates",
      value: settings.allowNotifications,
      onToggle: () => toggleSetting("allowNotifications"),
    },
    {
      title: "Analytics & Usage",
      description: "Help improve the app by sharing usage data",
      value: settings.allowAnalytics,
      onToggle: () => toggleSetting("allowAnalytics"),
    },
    {
      title: "Crash Reports",
      description: "Automatically send crash reports to help fix issues",
      value: settings.allowCrashReports,
      onToggle: () => toggleSetting("allowCrashReports"),
    },
    {
      title: "Marketing Communications",
      description: "Receive emails about new features and updates",
      value: settings.allowMarketing,
      onToggle: () => toggleSetting("allowMarketing"),
    },
    {
      title: "Auto Sync",
      description: "Automatically sync data when online",
      value: settings.autoSync,
      onToggle: () => toggleSetting("autoSync"),
    },
  ];

  const dataOptions = [
    {
      title: "Export My Data",
      subtitle: "Download a copy of your data",
      icon: "📤",
      onPress: handleDataExport,
    },
    {
      title: "Delete My Data",
      subtitle: "Permanently delete all your data",
      icon: "🗑️",
      onPress: handleDataDeletion,
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
          Privacy & Data
        </Text>
      </View>

      {/* Privacy Settings */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 16,
        }}
      >
        Privacy Settings
      </Text>

      {privacyOptions.map((option, index) => (
        <Card key={index} style={{ marginBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text
                style={{
                  fontFamily: typography.fontFamily.semiBold,
                  fontSize: 16,
                  color: colors.light.text,
                  marginBottom: 4,
                }}
              >
                {option.title}
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: 14,
                  color: colors.light.textSecondary,
                }}
              >
                {option.description}
              </Text>
            </View>
            <Switch
              value={option.value}
              onValueChange={option.onToggle}
              trackColor={{
                false: colors.light.border,
                true: colors.light.primary,
              }}
              thumbColor={colors.light.card}
            />
          </View>
        </Card>
      ))}

      {/* Data Management */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        Data Management
      </Text>

      {dataOptions.map((option, index) =>
        renderMenuItem(
          option.title,
          option.subtitle,
          option.icon,
          option.onPress,
          option.destructive
        )
      )}

      {/* Privacy Information */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        Privacy Information
      </Text>

      <Card style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: 16,
            color: colors.light.textSecondary,
            lineHeight: 24,
            marginBottom: 16,
          }}
        >
          We respect your privacy and are committed to protecting your personal
          data. Your data is encrypted and stored securely. We never sell your
          personal information to third parties.
        </Text>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Read Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Read Terms of Service</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: colors.light.primary,
  },
});
