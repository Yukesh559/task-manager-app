import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { colors, typography } from "../../../theme";
import { useAnalytics } from "../../../contexts/AnalyticsContext";
import { useProjects } from "../../../contexts/ProjectsContext";
import { Card } from "../../../components/ui/Card";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { Dropdown } from "../../../components/ui/Dropdown";

function AnalyticsScreen() {
  const {
    taskMetrics,
    projectMetrics,
    teamMetrics,
    timeMetrics,
    getTasksByStatus,
    getTasksByPriority,
    getCompletionTrend,
    getMemberActivity,
  } = useAnalytics();
  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState("");
  const [timeRange, setTimeRange] = useState("7");

  const filteredProjectMetrics = selectedProject
    ? projectMetrics.filter((pm) => pm.projectId === selectedProject)
    : projectMetrics;

  const completionTrend = getCompletionTrend(parseInt(timeRange));
  const memberActivity = getMemberActivity();

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

  const renderMetricCard = (
    title: string,
    value: number,
    subtitle: string,
    color: string
  ) => (
    <Card style={{ flex: 1, marginHorizontal: 4 }}>
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 14,
          color: colors.light.text,
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: typography.fontFamily.bold,
          fontSize: 24,
          color: color,
          marginBottom: 2,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: typography.fontFamily.regular,
          fontSize: 12,
          color: colors.light.textSecondary,
        }}
      >
        {subtitle}
      </Text>
    </Card>
  );

  const renderProjectCard = ({ item: project }: { item: any }) => (
    <Card style={{ marginBottom: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontFamily: typography.fontFamily.semiBold,
            fontSize: 16,
            color: colors.light.text,
          }}
        >
          {project.projectName}
        </Text>
        <Text
          style={{
            fontFamily: typography.fontFamily.bold,
            fontSize: 18,
            color: colors.light.primary,
          }}
        >
          {project.completionRate.toFixed(1)}%
        </Text>
      </View>

      <ProgressBar
        progress={project.completionRate / 100}
        style={{ marginBottom: 8 }}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: 12,
            color: colors.light.textSecondary,
          }}
        >
          {project.completedTasks}/{project.totalTasks} tasks
        </Text>
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: 12,
            color: colors.light.textSecondary,
          }}
        >
          {project.activeMembers} members
        </Text>
      </View>
    </Card>
  );

  const renderTrendBar = ({ item, index }: { item: any; index: number }) => (
    <View style={{ alignItems: "center", marginHorizontal: 2 }}>
      <View
        style={{
          width: 20,
          height: Math.max(20, item.completed * 10),
          backgroundColor: colors.light.primary,
          borderRadius: 2,
          marginBottom: 4,
        }}
      />
      <Text
        style={{
          fontFamily: typography.fontFamily.regular,
          fontSize: 10,
          color: colors.light.textSecondary,
        }}
      >
        {item.completed}
      </Text>
      <Text
        style={{
          fontFamily: typography.fontFamily.regular,
          fontSize: 8,
          color: colors.light.textSecondary,
        }}
      >
        {new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </Text>
    </View>
  );

  const renderMemberCard = ({ item: member }: { item: any }) => (
    <Card style={{ marginBottom: 8 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: typography.fontFamily.semiBold,
            fontSize: 14,
            color: colors.light.text,
          }}
        >
          {member.memberName}
        </Text>
        <Text
          style={{
            fontFamily: typography.fontFamily.bold,
            fontSize: 16,
            color: colors.light.primary,
          }}
        >
          {member.tasksCompleted}
        </Text>
      </View>
    </Card>
  );

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
        Analytics Dashboard
      </Text>

      {/* Filters */}
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Dropdown
            options={[
              { label: "All Projects", value: "" },
              ...projects.map((project) => ({
                label: project.name,
                value: project.id,
              })),
            ]}
            value={selectedProject}
            onChange={setSelectedProject}
            placeholder="Filter by project"
          />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Dropdown
            options={[
              { label: "Last 7 Days", value: "7" },
              { label: "Last 14 Days", value: "14" },
              { label: "Last 30 Days", value: "30" },
            ]}
            value={timeRange}
            onChange={setTimeRange}
            placeholder="Time range"
          />
        </View>
      </View>

      {/* Task Overview Metrics */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 12,
        }}
      >
        Task Overview
      </Text>

      <View style={{ flexDirection: "row", marginBottom: 24 }}>
        {renderMetricCard(
          "Total Tasks",
          taskMetrics.total,
          "All tasks",
          colors.light.text
        )}
        {renderMetricCard(
          "Completed",
          taskMetrics.completed,
          "Done",
          "#10b981"
        )}
        {renderMetricCard(
          "In Progress",
          taskMetrics.inProgress,
          "Active",
          "#f59e0b"
        )}
      </View>

      <View style={{ flexDirection: "row", marginBottom: 24 }}>
        {renderMetricCard(
          "Overdue",
          taskMetrics.overdue,
          "Past due",
          "#ef4444"
        )}
        {renderMetricCard(
          "Due Today",
          taskMetrics.dueToday,
          "Today",
          "#3b82f6"
        )}
        {renderMetricCard(
          "Due This Week",
          taskMetrics.dueThisWeek,
          "This week",
          "#8b5cf6"
        )}
      </View>

      {/* Time Metrics */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 12,
        }}
      >
        Time Metrics
      </Text>

      <View style={{ flexDirection: "row", marginBottom: 24 }}>
        {renderMetricCard(
          "Today",
          timeMetrics.tasksCompletedToday,
          "Completed",
          "#10b981"
        )}
        {renderMetricCard(
          "This Week",
          timeMetrics.tasksCompletedThisWeek,
          "Completed",
          "#3b82f6"
        )}
        {renderMetricCard(
          "This Month",
          timeMetrics.tasksCompletedThisMonth,
          "Completed",
          "#8b5cf6"
        )}
      </View>

      {/* Completion Trend Chart */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 12,
        }}
      >
        Completion Trend ({timeRange} days)
      </Text>

      <Card style={{ marginBottom: 24 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            height: 120,
            paddingHorizontal: 16,
          }}
        >
          {completionTrend.map((item, index) => (
            <View key={item.date}>{renderTrendBar({ item, index })}</View>
          ))}
        </View>
      </Card>

      {/* Project Performance */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 12,
        }}
      >
        Project Performance
      </Text>

      <FlatList
        data={filteredProjectMetrics}
        keyExtractor={(item) => item.projectId}
        renderItem={renderProjectCard}
        scrollEnabled={false}
        style={{ marginBottom: 24 }}
      />

      {/* Team Metrics */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 12,
        }}
      >
        Team Overview
      </Text>

      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        {renderMetricCard(
          "Total Members",
          teamMetrics.totalMembers,
          "Active",
          colors.light.text
        )}
        {renderMetricCard(
          "Active Members",
          teamMetrics.activeMembers,
          "Online",
          "#10b981"
        )}
        {renderMetricCard(
          "Pending Invites",
          teamMetrics.pendingInvitations,
          "Awaiting",
          "#f59e0b"
        )}
      </View>

      {/* Role Distribution */}
      <Card style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.semiBold,
            fontSize: 16,
            color: colors.light.text,
            marginBottom: 12,
          }}
        >
          Role Distribution
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View key="owner" style={{ alignItems: "center" }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: 20,
                color: "#ef4444",
              }}
            >
              {teamMetrics.roleDistribution.owner}
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 12,
                color: colors.light.textSecondary,
              }}
            >
              Owner
            </Text>
          </View>
          <View key="admin" style={{ alignItems: "center" }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: 20,
                color: "#f59e0b",
              }}
            >
              {teamMetrics.roleDistribution.admin}
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 12,
                color: colors.light.textSecondary,
              }}
            >
              Admin
            </Text>
          </View>
          <View key="member" style={{ alignItems: "center" }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: 20,
                color: "#3b82f6",
              }}
            >
              {teamMetrics.roleDistribution.member}
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 12,
                color: colors.light.textSecondary,
              }}
            >
              Member
            </Text>
          </View>
          <View key="viewer" style={{ alignItems: "center" }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: 20,
                color: "#6b7280",
              }}
            >
              {teamMetrics.roleDistribution.viewer}
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 12,
                color: colors.light.textSecondary,
              }}
            >
              Viewer
            </Text>
          </View>
        </View>
      </Card>

      {/* Top Performers */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 12,
        }}
      >
        Top Performers
      </Text>

      <FlatList
        data={memberActivity.slice(0, 5)}
        keyExtractor={(item) => item.memberId}
        renderItem={renderMemberCard}
        scrollEnabled={false}
        style={{ marginBottom: 24 }}
      />

      {/* Task Status Distribution */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 12,
        }}
      >
        Task Status Distribution
      </Text>

      <Card style={{ marginBottom: 24 }}>
        <View style={{ marginBottom: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontFamily: typography.fontFamily.medium,
                fontSize: 14,
                color: colors.light.text,
              }}
            >
              To Do
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: 14,
                color: colors.light.text,
              }}
            >
              {getTasksByStatus("todo")}
            </Text>
          </View>
          <ProgressBar
            progress={
              taskMetrics.total > 0
                ? getTasksByStatus("todo") / taskMetrics.total
                : 0
            }
            color={getStatusColor("todo")}
          />
        </View>

        <View style={{ marginBottom: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontFamily: typography.fontFamily.medium,
                fontSize: 14,
                color: colors.light.text,
              }}
            >
              In Progress
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: 14,
                color: colors.light.text,
              }}
            >
              {getTasksByStatus("in-progress")}
            </Text>
          </View>
          <ProgressBar
            progress={
              taskMetrics.total > 0
                ? getTasksByStatus("in-progress") / taskMetrics.total
                : 0
            }
            color={getStatusColor("in-progress")}
          />
        </View>

        <View style={{ marginBottom: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontFamily: typography.fontFamily.medium,
                fontSize: 14,
                color: colors.light.text,
              }}
            >
              Review
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: 14,
                color: colors.light.text,
              }}
            >
              {getTasksByStatus("review")}
            </Text>
          </View>
          <ProgressBar
            progress={
              taskMetrics.total > 0
                ? getTasksByStatus("review") / taskMetrics.total
                : 0
            }
            color={getStatusColor("review")}
          />
        </View>

        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontFamily: typography.fontFamily.medium,
                fontSize: 14,
                color: colors.light.text,
              }}
            >
              Done
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: 14,
                color: colors.light.text,
              }}
            >
              {getTasksByStatus("done")}
            </Text>
          </View>
          <ProgressBar
            progress={
              taskMetrics.total > 0
                ? getTasksByStatus("done") / taskMetrics.total
                : 0
            }
            color={getStatusColor("done")}
          />
        </View>
      </Card>
    </ScrollView>
  );
}

export default AnalyticsScreen;
