import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { colors, typography } from "../../../theme";
import { router } from "expo-router";
import { useProjects } from "../../../contexts/ProjectsContext";

function ProjectsListScreen() {
  const { projects, deleteProject } = useProjects();
  return (
    <View
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
        Projects
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(main)/projects/create")}
        style={{
          backgroundColor: colors.light.primary,
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
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
          + New Project
        </Text>
      </TouchableOpacity>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: colors.light.card,
              borderRadius: 10,
              padding: 16,
              marginBottom: 12,
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => router.push(`/ (main)/projects/${item.id}`)}
            >
              <Text
                style={{
                  fontFamily: typography.fontFamily.semiBold,
                  fontSize: 18,
                  color: colors.light.text,
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: 14,
                  color: colors.light.textSecondary,
                  marginTop: 4,
                }}
              >
                {item.description}
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <TouchableOpacity
                onPress={() => router.push("/(main)/projects/create")}
                style={{ marginRight: 16 }}
              >
                <Text
                  style={{
                    color: colors.light.primary,
                    fontFamily: typography.fontFamily.medium,
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteProject(item.id)}>
                <Text
                  style={{
                    color: colors.light.error,
                    fontFamily: typography.fontFamily.medium,
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export default ProjectsListScreen;
