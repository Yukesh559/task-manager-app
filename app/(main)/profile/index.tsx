import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { colors, typography } from "../../../theme";
import { router } from "expo-router";
import { useProfile } from "../../../contexts/ProfileContext";
import { useAuth } from "../../../contexts/AuthContext";
import { Card } from "../../../components/ui/Card";
import { ProgressBar } from "../../../components/ui/ProgressBar";

function ProfileScreen() {
  const { profile, stats } = useProfile();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getCompletionRate = () => {
    return stats.totalTasks > 0
      ? (stats.completedTasks / stats.totalTasks) * 100
      : 0;
  };

  const getStreakColor = (days: number) => {
    if (days >= 7) return "#10b981";
    if (days >= 3) return "#f59e0b";
    return "#ef4444";
  };

  const renderStatCard = (
    title: string,
    value: number,
    subtitle: string,
    color: string
  ) => (
    <Card style={{ flex: 1, marginHorizontal: 4 }}>
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 14,
          color: colors.light.text,
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: typography.fontFamily.bold,
          fontSize: 20,
          color: color,
          marginBottom: 2,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: typography.fontFamily.regular,
          fontSize: 12,
          color: colors.light.textSecondary,
        }}
      >
        {subtitle}
      </Text>
    </Card>
  );

  const renderMenuItem = (
    title: string,
    subtitle: string,
    icon: string,
    onPress: () => void
  ) => (
    <TouchableOpacity onPress={onPress}>
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
      style={{ flex: 1, backgroundColor: colors.light.background, padding: 24 }}
    >
      <Text
        style={{
          fontFamily: typography.fontFamily.bold,
          fontSize: 24,
          color: colors.light.primary,
          marginBottom: 16,
        }}
      >
        Profile
      </Text>

      {/* Profile Header */}
      <Card style={{ marginBottom: 24 }}>
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.light.primary,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            {profile.avatar ? (
              <Image
                source={{ uri: profile.avatar }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
            ) : (
              <Text
                style={{
                  color: "#fff",
                  fontFamily: typography.fontFamily.bold,
                  fontSize: 32,
                }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          <Text
            style={{
              fontFamily: typography.fontFamily.bold,
              fontSize: 20,
              color: colors.light.text,
              marginBottom: 4,
            }}
          >
            {profile.name}
          </Text>

          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: 14,
              color: colors.light.textSecondary,
              marginBottom: 8,
            }}
          >
            {profile.email}
          </Text>

          {profile.bio && (
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 14,
                color: colors.light.text,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              {profile.bio}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(main)/profile/edit")}
          style={{
            backgroundColor: colors.light.primary,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 6,
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: typography.fontFamily.medium,
              fontSize: 14,
            }}
          >
            Edit Profile
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Stats Overview */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 12,
        }}
      >
        Your Stats
      </Text>

      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        {renderStatCard("Tasks", stats.totalTasks, "Total", colors.light.text)}
        {renderStatCard("Completed", stats.completedTasks, "Done", "#10b981")}
        {renderStatCard("Projects", stats.totalProjects, "Active", "#3b82f6")}
      </View>

      <View style={{ flexDirection: "row", marginBottom: 24 }}>
        {renderStatCard("Boards", stats.totalBoards, "Created", "#8b5cf6")}
        {renderStatCard(
          "Streak",
          stats.streakDays,
          "Days",
          getStreakColor(stats.streakDays)
        )}
        {renderStatCard(
          "Avg Time",
          stats.averageCompletionTime,
          "Days",
          "#f59e0b"
        )}
      </View>

      {/* Progress Section */}
      <Card style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.semiBold,
            fontSize: 16,
            color: colors.light.text,
            marginBottom: 8,
          }}
        >
          Task Completion Rate
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontFamily: typography.fontFamily.bold,
              fontSize: 24,
              color: colors.light.primary,
            }}
          >
            {getCompletionRate().toFixed(1)}%
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: 14,
              color: colors.light.textSecondary,
            }}
          >
            {stats.completedTasks}/{stats.totalTasks} tasks
          </Text>
        </View>

        <ProgressBar
          progress={getCompletionRate() / 100}
          style={{ marginBottom: 8 }}
        />

        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: 12,
            color: colors.light.textSecondary,
          }}
        >
          Last active: {new Date(stats.lastActive).toLocaleDateString()}
        </Text>
      </Card>

      {/* Settings Menu */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 12,
        }}
      >
        Settings
      </Text>

      {renderMenuItem(
        "Account Settings",
        "Manage your account information",
        "👤",
        () => router.push("/(main)/profile/account")
      )}

      {renderMenuItem(
        "Notifications",
        "Configure notification preferences",
        "🔔",
        () => router.push("/(main)/profile/notifications")
      )}

      {renderMenuItem(
        "Preferences",
        "Customize your app experience",
        "⚙️",
        () => router.push("/(main)/profile/preferences")
      )}

      {renderMenuItem(
        "Privacy & Security",
        "Manage privacy and security settings",
        "🔒",
        () => router.push("/(main)/profile/privacy")
      )}

      {renderMenuItem(
        "Help & Support",
        "Get help and contact support",
        "❓",
        () => router.push("/(main)/profile/help")
      )}

      {renderMenuItem("Export Data", "Download your data", "📤", () => {
        router.push("/(main)/profile/export");
      })}

      {/* Danger Zone */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.error,
          marginTop: 24,
          marginBottom: 12,
        }}
      >
        Danger Zone
      </Text>

      <Card
        style={{
          marginBottom: 16,
          borderColor: colors.light.error,
          borderWidth: 1,
        }}
      >
        <TouchableOpacity
          onPress={handleLogout}
          style={{ paddingVertical: 12 }}
        >
          <Text
            style={{
              fontFamily: typography.fontFamily.medium,
              fontSize: 16,
              color: colors.light.error,
              textAlign: "center",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </Card>

      <Card
        style={{
          marginBottom: 24,
          borderColor: colors.light.error,
          borderWidth: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            // Handle account deletion
            console.log("Delete account");
          }}
          style={{ paddingVertical: 12 }}
        >
          <Text
            style={{
              fontFamily: typography.fontFamily.medium,
              fontSize: 16,
              color: colors.light.error,
              textAlign: "center",
            }}
          >
            Delete Account
          </Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

export default ProfileScreen;
