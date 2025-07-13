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
import { Dropdown } from "../../../components/ui/Dropdown";

function PreferencesScreen() {
  const { profile, updatePreferences, updateTheme } = useProfile();
  const [preferences, setPreferences] = useState(profile.preferences);
  const [theme, setTheme] = useState(profile.theme);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    try {
      updatePreferences(preferences);
      updateTheme(theme);
      Alert.alert("Success", "Preferences updated successfully");
      router.back();
    } catch (err) {
      Alert.alert("Error", "Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  const renderPreferenceItem = (
    title: string,
    description: string,
    key: keyof typeof preferences,
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
          value={preferences[key] as boolean}
          onValueChange={(value) => {
            setPreferences((prev) => ({
              ...prev,
              [key]: value,
            }));
          }}
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
          Preferences
        </Text>
      </View>

      {/* Appearance */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 16,
        }}
      >
        Appearance
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
              🎨
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
              Theme
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 14,
                color: colors.light.textSecondary,
              }}
            >
              Choose your preferred theme
            </Text>
          </View>
        </View>

        <Dropdown
          options={[
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
            { label: "Auto", value: "auto" },
          ]}
          value={theme}
          onChange={setTheme}
          placeholder="Select Theme"
        />
      </Card>

      {/* Default View */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        Default View
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
              📋
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
              Default Task View
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 14,
                color: colors.light.textSecondary,
              }}
            >
              Choose how tasks are displayed by default
            </Text>
          </View>
        </View>

        <Dropdown
          options={[
            { label: "Board View", value: "board" },
            { label: "List View", value: "list" },
            { label: "Calendar View", value: "calendar" },
          ]}
          value={preferences.defaultView}
          onChange={(value) => {
            setPreferences((prev) => ({
              ...prev,
              defaultView: value as "board" | "list" | "calendar",
            }));
          }}
          placeholder="Select Default View"
        />
      </Card>

      {/* Task Sorting */}
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
              🔄
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
              Task Sort By
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 14,
                color: colors.light.textSecondary,
              }}
            >
              Choose how tasks are sorted by default
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Dropdown
              options={[
                { label: "Priority", value: "priority" },
                { label: "Due Date", value: "dueDate" },
                { label: "Created Date", value: "createdAt" },
                { label: "Title", value: "title" },
              ]}
              value={preferences.taskSortBy}
              onChange={(value) => {
                setPreferences((prev) => ({
                  ...prev,
                  taskSortBy: value as
                    | "priority"
                    | "dueDate"
                    | "createdAt"
                    | "title",
                }));
              }}
              placeholder="Sort By"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Dropdown
              options={[
                { label: "Descending", value: "desc" },
                { label: "Ascending", value: "asc" },
              ]}
              value={preferences.taskSortOrder}
              onChange={(value) => {
                setPreferences((prev) => ({
                  ...prev,
                  taskSortOrder: value as "asc" | "desc",
                }));
              }}
              placeholder="Order"
            />
          </View>
        </View>
      </Card>

      {/* Task Management */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        Task Management
      </Text>

      {renderPreferenceItem(
        "Auto Archive",
        "Automatically archive completed tasks after 30 days",
        "autoArchive",
        "📦"
      )}

      {renderPreferenceItem(
        "Show Completed Tasks",
        "Display completed tasks in task lists",
        "showCompletedTasks",
        "✅"
      )}

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

      <Card style={{ marginBottom: 12 }}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Export Data",
              "This will export all your data as a JSON file. Continue?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Export",
                  onPress: () => {
                    Alert.alert(
                      "Success",
                      "Data export started. You'll receive a download link via email."
                    );
                  },
                },
              ]
            );
          }}
        >
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
                📤
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
                Export Data
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: 14,
                  color: colors.light.textSecondary,
                }}
              >
                Download all your data as a backup
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
        </TouchableOpacity>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Clear Cache",
              "This will clear all cached data. This action cannot be undone. Continue?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Clear",
                  style: "destructive",
                  onPress: () => {
                    Alert.alert("Success", "Cache cleared successfully");
                  },
                },
              ]
            );
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#f59e0b",
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
                🗑️
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
                Clear Cache
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: 14,
                  color: colors.light.textSecondary,
                }}
              >
                Clear all cached data to free up space
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
        </TouchableOpacity>
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
          {loading ? "Saving..." : "Save Preferences"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default PreferencesScreen;
