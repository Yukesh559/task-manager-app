import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { colors, typography } from "../../../theme";
import { router } from "expo-router";
import { useTeam } from "../../../contexts/TeamContext";
import { useProjects } from "../../../contexts/ProjectsContext";
import { Dropdown } from "../../../components/ui/Dropdown";

function TeamInviteScreen() {
  const { inviteMember } = useTeam();
  const { projects } = useProjects();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = () => {
    setLoading(true);
    setError("");

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

    if (!role) {
      setError("Please select a role");
      setLoading(false);
      return;
    }

    if (selectedProjects.length === 0) {
      setError("Please select at least one project");
      setLoading(false);
      return;
    }

    try {
      inviteMember(
        email.trim(),
        role as "admin" | "member" | "viewer",
        selectedProjects
      );
      router.replace("/(main)/team");
    } catch (err) {
      setError("Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  const toggleProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "admin":
        return "Can manage projects, invite members, and delete content";
      case "member":
        return "Can create and edit tasks, boards, and projects";
      case "viewer":
        return "Can view projects and tasks, but cannot make changes";
      default:
        return "";
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
        Invite Team Member
      </Text>

      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Email Address"
        style={{ marginBottom: 16 }}
      />

      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 16,
          color: colors.light.text,
          marginBottom: 8,
        }}
      >
        Role
      </Text>

      <Dropdown
        options={[
          { label: "Admin", value: "admin" },
          { label: "Member", value: "member" },
          { label: "Viewer", value: "viewer" },
        ]}
        value={role}
        onChange={setRole}
        placeholder="Select Role"
        style={{ marginBottom: 8 }}
      />

      {role && (
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: 14,
            color: colors.light.textSecondary,
            marginBottom: 16,
            fontStyle: "italic",
          }}
        >
          {getRoleDescription(role)}
        </Text>
      )}

      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 16,
          color: colors.light.text,
          marginBottom: 12,
        }}
      >
        Assign to Projects
      </Text>

      <View style={{ marginBottom: 16 }}>
        {projects.map((project) => (
          <TouchableOpacity
            key={project.id}
            onPress={() => toggleProject(project.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: colors.light.card,
              borderRadius: 8,
              marginBottom: 8,
              borderWidth: 2,
              borderColor: selectedProjects.includes(project.id)
                ? colors.light.primary
                : colors.light.border,
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: selectedProjects.includes(project.id)
                  ? colors.light.primary
                  : colors.light.textSecondary,
                backgroundColor: selectedProjects.includes(project.id)
                  ? colors.light.primary
                  : "transparent",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              {selectedProjects.includes(project.id) && (
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 12,
                    fontFamily: typography.fontFamily.bold,
                  }}
                >
                  ✓
                </Text>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: typography.fontFamily.semiBold,
                  fontSize: 16,
                  color: colors.light.text,
                }}
              >
                {project.name}
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: 14,
                  color: colors.light.textSecondary,
                }}
              >
                {project.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {selectedProjects.length > 0 && (
        <View
          style={{
            backgroundColor: colors.light.border,
            padding: 12,
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
            Selected Projects ({selectedProjects.length}):
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: 12,
              color: colors.light.textSecondary,
            }}
          >
            {projects
              .filter((p) => selectedProjects.includes(p.id))
              .map((p) => p.name)
              .join(", ")}
          </Text>
        </View>
      )}

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
        title={loading ? "Sending Invitation..." : "Send Invitation"}
        onPress={handleInvite}
        loading={loading}
        style={{ marginBottom: 24 }}
      />

      <View
        style={{
          backgroundColor: colors.light.border,
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            fontFamily: typography.fontFamily.semiBold,
            fontSize: 14,
            color: colors.light.text,
            marginBottom: 8,
          }}
        >
          What happens next?
        </Text>
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: 12,
            color: colors.light.textSecondary,
            lineHeight: 18,
          }}
        >
          • An invitation email will be sent to the provided address{"\n"}• The
          invitation will expire in 7 days{"\n"}• Once accepted, the member will
          be added to the selected projects{"\n"}• You can resend or cancel
          invitations from the team page
        </Text>
      </View>
    </ScrollView>
  );
}

export default TeamInviteScreen;
