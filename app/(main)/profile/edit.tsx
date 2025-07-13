import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { colors, typography } from "../../../theme";
import { router } from "expo-router";
import { useProfile } from "../../../contexts/ProfileContext";
import { Dropdown } from "../../../components/ui/Dropdown";

function ProfileEditScreen() {
  const { profile, updateProfile } = useProfile();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [timezone, setTimezone] = useState(profile.timezone);
  const [language, setLanguage] = useState(profile.language);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const timezones = [
    { label: "Eastern Time (ET)", value: "America/New_York" },
    { label: "Central Time (CT)", value: "America/Chicago" },
    { label: "Mountain Time (MT)", value: "America/Denver" },
    { label: "Pacific Time (PT)", value: "America/Los_Angeles" },
    { label: "UTC", value: "UTC" },
    { label: "London (GMT)", value: "Europe/London" },
    { label: "Paris (CET)", value: "Europe/Paris" },
    { label: "Tokyo (JST)", value: "Asia/Tokyo" },
    { label: "Sydney (AEDT)", value: "Australia/Sydney" },
  ];

  const languages = [
    { label: "English", value: "en" },
    { label: "Spanish", value: "es" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Italian", value: "it" },
    { label: "Portuguese", value: "pt" },
    { label: "Russian", value: "ru" },
    { label: "Chinese", value: "zh" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
  ];

  const handleSave = () => {
    setLoading(true);
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      updateProfile({
        name: name.trim(),
        email: email.trim(),
        bio: bio.trim() || undefined,
        phone: phone.trim() || undefined,
        timezone,
        language,
      });

      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    // In a real app, this would open image picker
    Alert.alert(
      "Avatar Upload",
      "This feature would open image picker in a real app"
    );
  };

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
          Edit Profile
        </Text>
      </View>

      {/* Avatar Section */}
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <TouchableOpacity onPress={handleAvatarUpload}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: colors.light.primary,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 12,
              borderWidth: 3,
              borderColor: colors.light.border,
            }}
          >
            {profile.avatar ? (
              <Image
                source={{ uri: profile.avatar }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <Text
                style={{
                  color: "#fff",
                  fontFamily: typography.fontFamily.bold,
                  fontSize: 40,
                }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAvatarUpload}>
          <Text
            style={{
              color: colors.light.primary,
              fontFamily: typography.fontFamily.medium,
              fontSize: 14,
            }}
          >
            Change Photo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Personal Information */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 16,
        }}
      >
        Personal Information
      </Text>

      <Input
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
        style={{ marginBottom: 12 }}
      />

      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Email Address"
        style={{ marginBottom: 12 }}
      />

      <Input
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone Number (optional)"
        style={{ marginBottom: 12 }}
      />

      <Input
        value={bio}
        onChangeText={setBio}
        placeholder="Bio (optional)"
        style={{ marginBottom: 16 }}
      />

      {/* Preferences */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 16,
        }}
      >
        Preferences
      </Text>

      <Dropdown
        options={timezones}
        value={timezone}
        onChange={setTimezone}
        placeholder="Select Timezone"
        style={{ marginBottom: 12 }}
      />

      <Dropdown
        options={languages}
        value={language}
        onChange={setLanguage}
        placeholder="Select Language"
        style={{ marginBottom: 16 }}
      />

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

      <View
        style={{
          backgroundColor: colors.light.border,
          padding: 16,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontFamily: typography.fontFamily.medium,
            fontSize: 14,
            color: colors.light.text,
            marginBottom: 4,
          }}
        >
          Member Since
        </Text>
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: 14,
            color: colors.light.textSecondary,
            marginBottom: 12,
          }}
        >
          {new Date(profile.createdAt).toLocaleDateString()}
        </Text>

        <Text
          style={{
            fontFamily: typography.fontFamily.medium,
            fontSize: 14,
            color: colors.light.text,
            marginBottom: 4,
          }}
        >
          Last Updated
        </Text>
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: 14,
            color: colors.light.textSecondary,
          }}
        >
          {new Date(profile.updatedAt).toLocaleDateString()}
        </Text>
      </View>

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
        title={loading ? "Saving..." : "Save Changes"}
        onPress={handleSave}
        loading={loading}
        style={{ marginBottom: 24 }}
      />

      {/* Additional Actions */}
      <View style={{ marginBottom: 24 }}>
        <TouchableOpacity
          onPress={() => router.push("/(main)/profile/change-password")}
          style={{
            backgroundColor: colors.light.card,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: colors.light.border,
          }}
        >
          <Text
            style={{
              color: colors.light.primary,
              fontFamily: typography.fontFamily.medium,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Change Password
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Delete Account",
              "Are you sure you want to delete your account? This action cannot be undone.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    // Handle account deletion
                    console.log("Delete account");
                  },
                },
              ]
            );
          }}
          style={{
            backgroundColor: colors.light.error,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
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
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default ProfileEditScreen;
