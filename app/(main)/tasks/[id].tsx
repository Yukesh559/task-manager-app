import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { colors, typography } from "../../../theme";
import { useTasks } from "../../../contexts/TasksContext";
import { useProjects } from "../../../contexts/ProjectsContext";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Input } from "../../../components/ui/Input";

function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const { tasks, updateTask, deleteTask } = useTasks();
  const { projects } = useProjects();
  const task = tasks.find((t) => t.id === id);
  const project = task ? projects.find((p) => p.id === task.projectId) : null;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "");
  const [status, setStatus] = useState(task?.status || "");
  const [assignee, setAssignee] = useState(task?.assignee || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [tags, setTags] = useState(task?.tags.join(", ") || "");
  const [loading, setLoading] = useState(false);

  if (!task) {
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
          Task Not Found
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return colors.light.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "#e2e8f0";
      case "in-progress":
        return "#fef3c7";
      case "review":
        return "#dbeafe";
      case "done":
        return "#dcfce7";
      default:
        return colors.light.textSecondary;
    }
  };

  const handleSave = () => {
    setLoading(true);
    try {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        priority: priority as "low" | "medium" | "high",
        status: status as "todo" | "in-progress" | "review" | "done",
        assignee: assignee.trim() || undefined,
        dueDate: dueDate.trim() || undefined,
        tags: tagArray,
      });

      setIsEditing(false);
    } catch (err) {
      Alert.alert("Error", "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteTask(task.id);
          router.replace("/(main)/tasks");
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.light.background, padding: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
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

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={{ marginRight: 12 }}
          >
            <Text
              style={{
                color: colors.light.primary,
                fontFamily: typography.fontFamily.medium,
                fontSize: 16,
              }}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Text>
          </TouchableOpacity>

          {isEditing ? (
            <TouchableOpacity onPress={handleSave} disabled={loading}>
              <Text
                style={{
                  color: colors.light.primary,
                  fontFamily: typography.fontFamily.medium,
                  fontSize: 16,
                }}
              >
                {loading ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleDelete}>
              <Text
                style={{
                  color: colors.light.error,
                  fontFamily: typography.fontFamily.medium,
                  fontSize: 16,
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Card>
        {isEditing ? (
          <View>
            <Input
              value={title}
              onChangeText={setTitle}
              placeholder="Task Title"
              style={{ marginBottom: 12 }}
            />
            <Input
              value={description}
              onChangeText={setDescription}
              placeholder="Task Description"
              style={{ marginBottom: 12 }}
            />
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Dropdown
                  options={[
                    { label: "Low", value: "low" },
                    { label: "Medium", value: "medium" },
                    { label: "High", value: "high" },
                  ]}
                  value={priority}
                  onChange={setPriority}
                  placeholder="Priority"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Dropdown
                  options={[
                    { label: "To Do", value: "todo" },
                    { label: "In Progress", value: "in-progress" },
                    { label: "Review", value: "review" },
                    { label: "Done", value: "done" },
                  ]}
                  value={status}
                  onChange={setStatus}
                  placeholder="Status"
                />
              </View>
            </View>
            <Input
              value={assignee}
              onChangeText={setAssignee}
              placeholder="Assignee"
              style={{ marginBottom: 12 }}
            />
            <Input
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="Due Date (YYYY-MM-DD)"
              style={{ marginBottom: 12 }}
            />
            <Input
              value={tags}
              onChangeText={setTags}
              placeholder="Tags (comma separated)"
              style={{ marginBottom: 12 }}
            />
          </View>
        ) : (
          <View>
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: 20,
                color: colors.light.text,
                marginBottom: 8,
              }}
            >
              {task.title}
            </Text>

            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 16,
                color: colors.light.textSecondary,
                marginBottom: 16,
              }}
            >
              {task.description}
            </Text>

            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              <View
                style={{
                  backgroundColor: getPriorityColor(task.priority),
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: typography.fontFamily.medium,
                    fontSize: 12,
                    color: "#fff",
                    textTransform: "uppercase",
                  }}
                >
                  {task.priority}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: getStatusColor(task.status),
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
                    textTransform: "capitalize",
                  }}
                >
                  {task.status.replace("-", " ")}
                </Text>
              </View>
            </View>

            {task.assignee && (
              <View style={{ marginBottom: 8 }}>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.medium,
                    fontSize: 14,
                    color: colors.light.text,
                  }}
                >
                  Assignee: {task.assignee}
                </Text>
              </View>
            )}

            {task.dueDate && (
              <View style={{ marginBottom: 8 }}>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.medium,
                    fontSize: 14,
                    color: colors.light.text,
                  }}
                >
                  Due Date: {task.dueDate}
                </Text>
              </View>
            )}

            {project && (
              <View style={{ marginBottom: 8 }}>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.medium,
                    fontSize: 14,
                    color: colors.light.primary,
                  }}
                >
                  Project: {project.name}
                </Text>
              </View>
            )}

            {task.tags.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.medium,
                    fontSize: 14,
                    color: colors.light.text,
                    marginBottom: 8,
                  }}
                >
                  Tags:
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {task.tags.map((tag, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: colors.light.border,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                        marginRight: 8,
                        marginBottom: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: typography.fontFamily.regular,
                          fontSize: 12,
                          color: colors.light.textSecondary,
                        }}
                      >
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: 12,
                  color: colors.light.textSecondary,
                }}
              >
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: 12,
                  color: colors.light.textSecondary,
                }}
              >
                Updated: {new Date(task.updatedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}
      </Card>
    </ScrollView>
  );
}

export default TaskDetailScreen;
