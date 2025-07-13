import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { colors, typography } from "../../../theme";
import { router } from "expo-router";
import { useProfile } from "../../../contexts/ProfileContext";
import { Card } from "../../../components/ui/Card";

function NotificationsScreen() {
  const { profile, updateNotificationSettings } = useProfile();
  const [notifications, setNotifications] = useState(profile.notifications);
  const [loading, setLoading] = useState(false);

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    setLoading(true);
    try {
      updateNotificationSettings(notifications);
      Alert.alert("Success", "Notification settings updated successfully");
      router.back();
    } catch (err) {
      Alert.alert("Error", "Failed to update notification settings");
    } finally {
      setLoading(false);
    }
  };

  const renderNotificationItem = (
    title: string,
    description: string,
    key: keyof typeof notifications,
    icon: string
  ) => (
    <Card style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.light.primary,
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
              color: colors.light.text,
              marginBottom: 2,
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
            {description}
          </Text>
        </View>

        <Switch
          value={notifications[key]}
          onValueChange={() => handleToggle(key)}
          trackColor={{
            false: colors.light.border,
            true: colors.light.primary,
          }}
          thumbColor="#fff"
        />
      </View>
    </Card>
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
          Notifications
        </Text>
      </View>

      {/* Notification Channels */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 16,
        }}
      >
        Notification Channels
      </Text>

      {renderNotificationItem(
        "Email Notifications",
        "Receive notifications via email",
        "email",
        "📧"
      )}

      {renderNotificationItem(
        "Push Notifications",
        "Receive notifications on your device",
        "push",
        "📱"
      )}

      {/* Notification Types */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        Notification Types
      </Text>

      {renderNotificationItem(
        "Task Reminders",
        "Get reminded about upcoming task deadlines",
        "taskReminders",
        "⏰"
      )}

      {renderNotificationItem(
        "Project Updates",
        "Receive updates when projects are modified",
        "projectUpdates",
        "📋"
      )}

      {renderNotificationItem(
        "Team Invitations",
        "Get notified when invited to join teams",
        "teamInvitations",
        "👥"
      )}

      {/* Notification Schedule */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        Notification Schedule
      </Text>

      <Card style={{ marginBottom: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.light.primary,
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
              🕐
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.semiBold,
                fontSize: 16,
                color: colors.light.text,
                marginBottom: 2,
              }}
            >
              Quiet Hours
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 14,
                color: colors.light.textSecondary,
              }}
            >
              Mute notifications during quiet hours
            </Text>
          </View>

          <Switch
            value={false}
            onValueChange={() => {
              Alert.alert(
                "Coming Soon",
                "Quiet hours feature will be available soon"
              );
            }}
            trackColor={{
              false: colors.light.border,
              true: colors.light.primary,
            }}
            thumbColor="#fff"
          />
        </View>

        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: 12,
            color: colors.light.textSecondary,
            fontStyle: "italic",
          }}
        >
          Coming soon: Set quiet hours from 10 PM to 8 AM
        </Text>
      </Card>

      {/* Notification Frequency */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        Notification Frequency
      </Text>

      <Card style={{ marginBottom: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.light.primary,
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
              📊
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.semiBold,
                fontSize: 16,
                color: colors.light.text,
                marginBottom: 2,
              }}
            >
              Digest Notifications
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 14,
                color: colors.light.textSecondary,
              }}
            >
              Receive daily summaries instead of individual notifications
            </Text>
          </View>

          <Switch
            value={false}
            onValueChange={() => {
              Alert.alert(
                "Coming Soon",
                "Digest notifications feature will be available soon"
              );
            }}
            trackColor={{
              false: colors.light.border,
              true: colors.light.primary,
            }}
            thumbColor="#fff"
          />
        </View>

        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: 12,
            color: colors.light.textSecondary,
            fontStyle: "italic",
          }}
        >
          Coming soon: Get daily summaries at 9 AM
        </Text>
      </Card>

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={loading}
        style={{
          backgroundColor: colors.light.primary,
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 8,
          marginTop: 24,
          marginBottom: 24,
          opacity: loading ? 0.6 : 1,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontFamily: typography.fontFamily.medium,
            fontSize: 16,
            textAlign: "center",
          }}
        >
          {loading ? "Saving..." : "Save Settings"}
        </Text>
      </TouchableOpacity>

      {/* Additional Info */}
      <Card style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.semiBold,
            fontSize: 16,
            color: colors.light.text,
            marginBottom: 8,
          }}
        >
          💡 Tips
        </Text>
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: 14,
            color: colors.light.textSecondary,
            lineHeight: 20,
            marginBottom: 8,
          }}
        >
          • Enable task reminders to never miss a deadline
        </Text>
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: 14,
            color: colors.light.textSecondary,
            lineHeight: 20,
            marginBottom: 8,
          }}
        >
          • Project updates help you stay informed about changes
        </Text>
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: 14,
            color: colors.light.textSecondary,
            lineHeight: 20,
          }}
        >
          • Team invitations ensure you don't miss collaboration opportunities
        </Text>
      </Card>
    </ScrollView>
  );
}

export default NotificationsScreen;
