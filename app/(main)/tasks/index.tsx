import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { colors, typography } from "../../../theme";
import { router } from "expo-router";
import { useTasks } from "../../../contexts/TasksContext";
import { useProjects } from "../../../contexts/ProjectsContext";
import { Card } from "../../../components/ui/Card";
import { Dropdown } from "../../../components/ui/Dropdown";

function TasksListScreen() {
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority =
        !priorityFilter || task.priority === priorityFilter;
      const matchesProject = !projectFilter || task.projectId === projectFilter;

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesProject
      );
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, projectFilter]);

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

  const renderTask = ({ item: task }: { item: any }) => {
    const project = projects.find((p) => p.id === task.projectId);

    return (
      <TouchableOpacity
        onPress={() => router.push(`/(main)/tasks/${task.id}`)}
        style={{ marginBottom: 12 }}
      >
        <Card>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontFamily: typography.fontFamily.semiBold,
                fontSize: 16,
                color: colors.light.text,
                flex: 1,
                marginRight: 8,
              }}
              numberOfLines={2}
            >
              {task.title}
            </Text>
            <View
              style={{
                backgroundColor: getPriorityColor(task.priority),
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
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
          </View>

          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: 14,
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

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {task.assignee && (
                <Text
                  style={{
                    fontFamily: typography.fontFamily.regular,
                    fontSize: 12,
                    color: colors.light.textSecondary,
                    marginRight: 8,
                  }}
                >
                  {task.assignee}
                </Text>
              )}
              {project && (
                <Text
                  style={{
                    fontFamily: typography.fontFamily.regular,
                    fontSize: 12,
                    color: colors.light.primary,
                  }}
                >
                  {project.name}
                </Text>
              )}
            </View>
          </View>

          {task.tags.length > 0 && (
            <View
              style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}
            >
              {task.tags.slice(0, 3).map((tag, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.light.border,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 8,
                    marginRight: 4,
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: typography.fontFamily.regular,
                      fontSize: 10,
                      color: colors.light.textSecondary,
                    }}
                  >
                    {tag}
                  </Text>
                </View>
              ))}
              {task.tags.length > 3 && (
                <Text
                  style={{
                    fontFamily: typography.fontFamily.regular,
                    fontSize: 10,
                    color: colors.light.textSecondary,
                    marginLeft: 4,
                  }}
                >
                  +{task.tags.length - 3} more
                </Text>
              )}
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

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
        Tasks
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/(main)/tasks/create")}
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
          + New Task
        </Text>
      </TouchableOpacity>

      {/* Search and Filters */}
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search tasks..."
        style={{
          backgroundColor: colors.light.card,
          borderWidth: 1,
          borderColor: colors.light.border,
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 16,
          marginBottom: 12,
          fontFamily: typography.fontFamily.regular,
          fontSize: 16,
          color: colors.light.text,
        }}
      />

      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Dropdown
            options={[
              { label: "All Status", value: "" },
              { label: "To Do", value: "todo" },
              { label: "In Progress", value: "in-progress" },
              { label: "Review", value: "review" },
              { label: "Done", value: "done" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Dropdown
            options={[
              { label: "All Priority", value: "" },
              { label: "High", value: "high" },
              { label: "Medium", value: "medium" },
              { label: "Low", value: "low" },
            ]}
            value={priorityFilter}
            onChange={setPriorityFilter}
            placeholder="Filter by priority"
          />
        </View>
      </View>

      <Dropdown
        options={[
          { label: "All Projects", value: "" },
          ...projects.map((project) => ({
            label: project.name,
            value: project.id,
          })),
        ]}
        value={projectFilter}
        onChange={setProjectFilter}
        placeholder="Filter by project"
        style={{ marginBottom: 16 }}
      />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.medium,
                fontSize: 16,
                color: colors.light.textSecondary,
                textAlign: "center",
              }}
            >
              No tasks found
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 14,
                color: colors.light.textSecondary,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Try adjusting your filters or create a new task
            </Text>
          </View>
        }
      />
    </View>
  );
}

export default TasksListScreen;
