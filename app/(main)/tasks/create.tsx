import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { colors, typography } from "../../../theme";
import { router } from "expo-router";
import { useTasks } from "../../../contexts/TasksContext";
import { useProjects } from "../../../contexts/ProjectsContext";
import { Dropdown } from "../../../components/ui/Dropdown";

function TaskCreateScreen() {
  const { addTask } = useTasks();
  const { projects } = useProjects();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("todo");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setLoading(true);
    setError("");

    if (!title.trim()) {
      setError("Task title is required");
      setLoading(false);
      return;
    }

    if (!selectedProjectId) {
      setError("Please select a project");
      setLoading(false);
      return;
    }

    if (!priority) {
      setError("Please select a priority");
      setLoading(false);
      return;
    }

    try {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      addTask({
        title: title.trim(),
        description: description.trim(),
        priority: priority as "low" | "medium" | "high",
        status: status as "todo" | "in-progress" | "review" | "done",
        assignee: assignee.trim() || undefined,
        dueDate: dueDate.trim() || undefined,
        projectId: selectedProjectId,
        tags: tagArray,
      });

      router.replace("/(main)/tasks");
    } catch (err) {
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
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
      <Text
        style={{
          fontFamily: typography.fontFamily.bold,
          fontSize: 24,
          color: colors.light.primary,
          marginBottom: 16,
        }}
      >
        New Task
      </Text>

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

      <Dropdown
        options={projects.map((project) => ({
          label: project.name,
          value: project.id,
        }))}
        value={selectedProjectId}
        onChange={setSelectedProjectId}
        placeholder="Select Project"
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
        placeholder="Assignee (optional)"
        style={{ marginBottom: 12 }}
      />

      <Input
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="Due Date (YYYY-MM-DD, optional)"
        style={{ marginBottom: 12 }}
      />

      <Input
        value={tags}
        onChangeText={setTags}
        placeholder="Tags (comma separated, optional)"
        style={{ marginBottom: 12 }}
      />

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
        title={loading ? "Creating..." : "Create Task"}
        onPress={handleCreate}
        loading={loading}
        style={{ marginBottom: 24 }}
      />
    </ScrollView>
  );
}

export default TaskCreateScreen;
