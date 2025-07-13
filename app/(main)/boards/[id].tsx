import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { colors, typography } from "../../../theme";
import { useBoards } from "../../../contexts/BoardsContext";
import { useProjects } from "../../../contexts/ProjectsContext";
import { Card } from "../../../components/ui/Card";

function BoardDetailScreen() {
  const { id } = useLocalSearchParams();
  const { boards } = useBoards();
  const { projects } = useProjects();
  const board = boards.find((b) => b.id === id);
  const project = board ? projects.find((p) => p.id === board.projectId) : null;

  if (!board) {
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
          Board Not Found
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
        {board.name}
      </Text>
      <Text
        style={{
          fontFamily: typography.fontFamily.regular,
          fontSize: 16,
          color: colors.light.textSecondary,
        }}
      >
        {project?.name || "Unknown Project"}
      </Text>
      <Text
        style={{
          fontFamily: typography.fontFamily.regular,
          fontSize: 14,
          color: colors.light.textSecondary,
          marginTop: 4,
        }}
      >
        {board.description}
      </Text>

      {/* Kanban Board View */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 24 }}
        contentContainerStyle={{ paddingRight: 24 }}
      >
        {board.columns.map((column) => (
          <View
            key={column.id}
            style={{
              width: 280,
              marginRight: 16,
              backgroundColor: colors.light.card,
              borderRadius: 12,
              padding: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: typography.fontFamily.semiBold,
                  fontSize: 16,
                  color: colors.light.text,
                }}
              >
                {column.name}
              </Text>
              <View
                style={{
                  backgroundColor: column.color,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: typography.fontFamily.medium,
                    fontSize: 12,
                    color: colors.light.text,
                  }}
                >
                  {column.tasks.length}
                </Text>
              </View>
            </View>

            <FlatList
              data={column.tasks}
              keyExtractor={(task) => task.id}
              renderItem={({ item: task }) => (
                <Card style={{ marginBottom: 8 }}>
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.semiBold,
                      fontSize: 14,
                      color: colors.light.text,
                      marginBottom: 4,
                    }}
                  >
                    {task.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.regular,
                      fontSize: 12,
                      color: colors.light.textSecondary,
                      marginBottom: 8,
                    }}
                    numberOfLines={2}
                  >
                    {task.description}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor:
                          task.priority === "high"
                            ? "#ef4444"
                            : task.priority === "medium"
                            ? "#f59e0b"
                            : "#10b981",
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: typography.fontFamily.medium,
                          fontSize: 10,
                          color: "#fff",
                          textTransform: "uppercase",
                        }}
                      >
                        {task.priority}
                      </Text>
                    </View>
                    {task.assignee && (
                      <Text
                        style={{
                          fontFamily: typography.fontFamily.regular,
                          fontSize: 11,
                          color: colors.light.textSecondary,
                        }}
                      >
                        {task.assignee}
                      </Text>
                    )}
                  </View>
                </Card>
              )}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default BoardDetailScreen;
