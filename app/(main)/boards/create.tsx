import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { colors, typography } from "../../../theme";
import { router } from "expo-router";
import { useBoards } from "../../../contexts/BoardsContext";
import { useProjects } from "../../../contexts/ProjectsContext";
import { Dropdown } from "../../../components/ui/Dropdown";

function BoardCreateScreen() {
  const { addBoard } = useBoards();
  const { projects } = useProjects();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    setLoading(true);
    setError("");

    if (!name.trim()) {
      setError("Board name is required");
      setLoading(false);
      return;
    }

    if (!selectedProjectId) {
      setError("Please select a project");
      setLoading(false);
      return;
    }

    try {
      addBoard(name.trim(), description.trim(), selectedProjectId);
      router.replace("/(main)/boards");
    } catch (err) {
      setError("Failed to create board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.light.background,
        padding: 24,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontFamily: typography.fontFamily.bold,
          fontSize: 24,
          color: colors.light.primary,
          marginBottom: 16,
        }}
      >
        New Board
      </Text>
      <Input
        value={name}
        onChangeText={setName}
        placeholder="Board Name"
        style={{ marginBottom: 12 }}
      />
      <Input
        value={description}
        onChangeText={setDescription}
        placeholder="Board Description (optional)"
        style={{ marginBottom: 12 }}
      />
      <Dropdown
        options={projects.map((project) => ({
          label: project.name,
          value: project.id,
        }))}
        value={selectedProjectId}
        onChange={setSelectedProjectId}
        placeholder="Choose a project"
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
        title={loading ? "Creating..." : "Create Board"}
        onPress={handleCreate}
        loading={loading}
      />
    </View>
  );
}

export default BoardCreateScreen;
