import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { colors, typography } from "../../../theme";
import { router } from "expo-router";
import { useTeam } from "../../../contexts/TeamContext";
import { useProjects } from "../../../contexts/ProjectsContext";
import { Card } from "../../../components/ui/Card";
import { Dropdown } from "../../../components/ui/Dropdown";

function TeamListScreen() {
  const {
    members,
    invitations,
    removeMember,
    acceptInvitation,
    declineInvitation,
    resendInvitation,
  } = useTeam();
  const { projects } = useProjects();
  const [roleFilter, setRoleFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "#ef4444";
      case "admin":
        return "#f59e0b";
      case "member":
        return "#3b82f6";
      case "viewer":
        return "#6b7280";
      default:
        return colors.light.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10b981";
      case "invited":
        return "#f59e0b";
      case "inactive":
        return "#6b7280";
      default:
        return colors.light.textSecondary;
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesRole = !roleFilter || member.role === roleFilter;
    const matchesProject =
      !projectFilter || member.projects.includes(projectFilter);
    return matchesRole && matchesProject;
  });

  const pendingInvitations = invitations.filter(
    (inv) => inv.status === "pending"
  );

  const renderMember = ({ item: member }: { item: any }) => {
    const memberProjects = projects.filter((p) =>
      member.projects.includes(p.id)
    );

    return (
      <Card style={{ marginBottom: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.light.primary,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: typography.fontFamily.bold,
                fontSize: 18,
              }}
            >
              {member.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.semiBold,
                fontSize: 16,
                color: colors.light.text,
              }}
            >
              {member.name}
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 14,
                color: colors.light.textSecondary,
              }}
            >
              {member.email}
            </Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                backgroundColor: getRoleColor(member.role),
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                marginBottom: 4,
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
                {member.role}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: getStatusColor(member.status),
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: typography.fontFamily.medium,
                  fontSize: 8,
                  color: "#fff",
                  textTransform: "uppercase",
                }}
              >
                {member.status}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 8 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.medium,
              fontSize: 12,
              color: colors.light.textSecondary,
              marginBottom: 4,
            }}
          >
            Projects ({memberProjects.length}):
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {memberProjects.map((project, index) => (
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
                  {project.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: 12,
              color: colors.light.textSecondary,
            }}
          >
            Joined: {new Date(member.joinedAt).toLocaleDateString()}
          </Text>

          {member.role !== "owner" && (
            <TouchableOpacity
              onPress={() => {
                // In a real app, you'd show a confirmation dialog
                removeMember(member.id);
              }}
              style={{
                backgroundColor: colors.light.error,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: typography.fontFamily.medium,
                  fontSize: 12,
                }}
              >
                Remove
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    );
  };

  const renderInvitation = ({ item: invitation }: { item: any }) => {
    const invitationProjects = projects.filter((p) =>
      invitation.projectIds.includes(p.id)
    );

    return (
      <Card style={{ marginBottom: 12, backgroundColor: colors.light.border }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.light.textSecondary,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: typography.fontFamily.bold,
                fontSize: 14,
              }}
            >
              {invitation.email.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.semiBold,
                fontSize: 14,
                color: colors.light.text,
              }}
            >
              {invitation.email}
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 12,
                color: colors.light.textSecondary,
              }}
            >
              Invited as {invitation.role}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: getRoleColor(invitation.role),
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontFamily: typography.fontFamily.medium,
                fontSize: 8,
                color: "#fff",
                textTransform: "uppercase",
              }}
            >
              {invitation.role}
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 8 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.medium,
              fontSize: 11,
              color: colors.light.textSecondary,
              marginBottom: 4,
            }}
          >
            Projects:
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {invitationProjects.map((project, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: colors.light.card,
                  paddingHorizontal: 4,
                  paddingVertical: 2,
                  borderRadius: 6,
                  marginRight: 4,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    fontFamily: typography.fontFamily.regular,
                    fontSize: 9,
                    color: colors.light.textSecondary,
                  }}
                >
                  {project.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: 10,
              color: colors.light.textSecondary,
            }}
          >
            Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
          </Text>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => resendInvitation(invitation.id)}
              style={{
                backgroundColor: colors.light.primary,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: typography.fontFamily.medium,
                  fontSize: 10,
                }}
              >
                Resend
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => declineInvitation(invitation.id)}
              style={{
                backgroundColor: colors.light.error,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: typography.fontFamily.medium,
                  fontSize: 10,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <ScrollView
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
        Team
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/(main)/team/invite")}
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
          + Invite Member
        </Text>
      </TouchableOpacity>

      {/* Filters */}
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Dropdown
            options={[
              { label: "All Roles", value: "" },
              { label: "Owner", value: "owner" },
              { label: "Admin", value: "admin" },
              { label: "Member", value: "member" },
              { label: "Viewer", value: "viewer" },
            ]}
            value={roleFilter}
            onChange={setRoleFilter}
            placeholder="Filter by role"
          />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
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
          />
        </View>
      </View>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: typography.fontFamily.semiBold,
              fontSize: 18,
              color: colors.light.text,
              marginBottom: 12,
            }}
          >
            Pending Invitations ({pendingInvitations.length})
          </Text>
          <FlatList
            data={pendingInvitations}
            keyExtractor={(item) => item.id}
            renderItem={renderInvitation}
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Team Members */}
      <View>
        <Text
          style={{
            fontFamily: typography.fontFamily.semiBold,
            fontSize: 18,
            color: colors.light.text,
            marginBottom: 12,
          }}
        >
          Team Members ({filteredMembers.length})
        </Text>
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id}
          renderItem={renderMember}
          scrollEnabled={false}
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
                No team members found
              </Text>
            </View>
          }
        />
      </View>
    </ScrollView>
  );
}

export default TeamListScreen;
