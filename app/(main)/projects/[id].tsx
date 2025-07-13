import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { colors, typography } from "../../../theme";
import { useProjects } from "../../../contexts/ProjectsContext";

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const { projects } = useProjects();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.light.background,
        }}
      >
        <Text
          style={{
            color: colors.light.error,
            fontFamily: typography.fontFamily.bold,
            fontSize: 20,
          }}
        >
          Project Not Found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 24 }}
        >
          <Text
            style={{
              color: colors.light.primary,
              fontFamily: typography.fontFamily.medium,
              fontSize: 16,
            }}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.light.background, padding: 24 }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginBottom: 24 }}
      >
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
          fontSize: 24,
          color: colors.light.primary,
          marginBottom: 8,
        }}
      >
        {project.name}
      </Text>
      <Text
        style={{
          fontFamily: typography.fontFamily.regular,
          fontSize: 16,
          color: colors.light.textSecondary,
        }}
      >
        {project.description}
      </Text>
    </View>
  );
}
