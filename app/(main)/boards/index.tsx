import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { colors, typography } from "../../../theme";
import { router } from "expo-router";
import { useBoards } from "../../../contexts/BoardsContext";
import { useProjects } from "../../../contexts/ProjectsContext";

function BoardsListScreen() {
  const { boards } = useBoards();
  const { projects } = useProjects();
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
        Boards
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(main)/boards/create")}
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
          + New Board
        </Text>
      </TouchableOpacity>
      <FlatList
        data={boards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const project = projects.find((p) => p.id === item.projectId);
          return (
            <TouchableOpacity
              onPress={() => router.push(`/(main)/boards/${item.id}`)}
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
                {project?.name || "Unknown Project"}
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: 12,
                  color: colors.light.textSecondary,
                  marginTop: 2,
                }}
              >
                {item.columns.length} columns •{" "}
                {item.columns.reduce(
                  (total, col) => total + col.tasks.length,
                  0
                )}{" "}
                tasks
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

export default BoardsListScreen;
