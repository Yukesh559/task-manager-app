import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { colors, typography } from "../../../theme";
import { router, useLocalSearchParams } from "expo-router";
import { useProjects } from "../../../contexts/ProjectsContext";

function ProjectCreateScreen() {
  const { addProject, updateProject, projects } = useProjects();
  const { editId } = useLocalSearchParams();
  const editing = typeof editId === "string";
  const projectToEdit = editing
    ? projects.find((p) => p.id === editId)
    : undefined;

  const [name, setName] = useState(
    editing && projectToEdit ? projectToEdit.name : ""
  );
  const [description, setDescription] = useState(
    editing && projectToEdit ? projectToEdit.description : ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing && projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description);
    }
  }, [editId, editing, projectToEdit]);

  const handleSubmit = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (!name) {
        setError("Project name zaroori hai");
      } else if (editing && projectToEdit) {
        updateProject(projectToEdit.id, name, description);
        setError("");
        router.replace("/(main)/projects");
      } else {
        addProject(name, description);
        setError("");
        router.replace("/(main)/projects");
      }
      setLoading(false);
    }, 800);
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
        {editing ? "Edit Project" : "New Project"}
      </Text>
      <Input
        value={name}
        onChangeText={setName}
        placeholder="Project Name"
        style={{ marginBottom: 12 }}
      />
      <Input
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
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
        title={
          loading
            ? editing
              ? "Updating..."
              : "Creating..."
            : editing
            ? "Update Project"
            : "Create Project"
        }
        onPress={handleSubmit}
        loading={loading}
      />
    </View>
  );
}

export default ProjectCreateScreen;
