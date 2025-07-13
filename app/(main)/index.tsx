import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { colors, typography } from "../../theme";
import { router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { useProjects } from "../../contexts/ProjectsContext";
import { useBoards } from "../../contexts/BoardsContext";
import { useTasks } from "../../contexts/TasksContext";
import { useTeam } from "../../contexts/TeamContext";
import { useAnalytics } from "../../contexts/AnalyticsContext";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { OfflineStatus } from "../../components/ui/OfflineStatus";

export const config = {
  headerShown: false,
};

function DashboardScreen() {
  const { user, logout } = useAuth();
  const { projects = [] } = useProjects();
  const { boards = [] } = useBoards();
  const { tasks = [] } = useTasks();
  const { team = { members: [] } } = useTeam();
  const { analytics = { totalTasks: 0, completedTasks: 0 } } = useAnalytics();

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getCompletionRate = () => {
    return analytics.totalTasks > 0
      ? (analytics.completedTasks / analytics.totalTasks) * 100
      : 0;
  };

  const getUrgentTasks = () => {
    return tasks.filter(
      (task) => task.priority === "high" && task.status !== "completed"
    ).length;
  };

  const getOverdueTasks = () => {
    const today = new Date();
    return tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) < today &&
        task.status !== "completed"
    ).length;
  };

  const quickActions = [
    {
      title: "Create Project",
      subtitle: "Start a new project",
      icon: "📁",
      color: colors.light.primary,
      onPress: () => router.push("/(main)/projects/create"),
    },
    {
      title: "Add Task",
      subtitle: "Create a new task",
      icon: "✅",
      color: colors.light.secondary,
      onPress: () => router.push("/(main)/tasks/create"),
    },
    {
      title: "New Board",
      subtitle: "Create a kanban board",
      icon: "📋",
      color: colors.light.warning,
      onPress: () => router.push("/(main)/boards/create"),
    },
    {
      title: "Invite Team",
      subtitle: "Add team members",
      icon: "👥",
      color: colors.light.error,
      onPress: () => router.push("/(main)/team/invite"),
    },
  ];

  const recentActivity = [
    {
      type: "task",
      title: "Task completed",
      description: "Design review completed",
      time: "2 hours ago",
      icon: "✅",
    },
    {
      type: "project",
      title: "Project updated",
      description: "Mobile app project progress",
      time: "4 hours ago",
      icon: "📁",
    },
    {
      type: "team",
      title: "Team member joined",
      description: "Sarah joined the team",
      time: "1 day ago",
      icon: "👥",
    },
    {
      type: "board",
      title: "Board created",
      description: "Sprint planning board",
      time: "2 days ago",
      icon: "📋",
    },
  ];

  const renderStatCard = (
    title: string,
    value: number,
    subtitle: string,
    color: string
  ) => (
    <Card style={{ flex: 1, marginHorizontal: 4 }}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </Card>
  );

  const renderQuickAction = (action: any) => (
    <TouchableOpacity key={action.title} onPress={action.onPress}>
      <Card style={styles.quickActionCard}>
        <View
          style={[styles.quickActionIcon, { backgroundColor: action.color }]}
        >
          <Text style={styles.quickActionIconText}>{action.icon}</Text>
        </View>
        <View style={styles.quickActionContent}>
          <Text style={styles.quickActionTitle}>{action.title}</Text>
          <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
        </View>
        <Text style={styles.quickActionArrow}>›</Text>
      </Card>
    </TouchableOpacity>
  );

  const renderActivityItem = (activity: any) => (
    <View key={activity.title} style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Text style={styles.activityIconText}>{activity.icon}</Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityDescription}>{activity.description}</Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <OfflineStatus />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}, {user?.name?.split(" ")[0] || "User"}!
            </Text>
            <Text style={styles.subtitle}>Here's what's happening today</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => router.push("/(main)/search")}
              style={styles.headerButton}
              accessibilityLabel="Search"
            >
              <Text style={styles.headerButtonText}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.headerButton}
              accessibilityLabel="Logout"
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Overview */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsRow}>
          {renderStatCard(
            "Projects",
            projects.length,
            "Active",
            colors.light.primary
          )}
          {renderStatCard(
            "Tasks",
            tasks.length,
            "Total",
            colors.light.secondary
          )}
          {renderStatCard(
            "Boards",
            boards.length,
            "Created",
            colors.light.warning
          )}
        </View>
        <View style={styles.statsRow}>
          {renderStatCard(
            "Team",
            team?.members?.length || 0,
            "Members",
            colors.light.error
          )}
          {renderStatCard("Urgent", getUrgentTasks(), "Tasks", "#FF6B6B")}
          {renderStatCard("Overdue", getOverdueTasks(), "Tasks", "#FF8E53")}
        </View>

        {/* Progress Section */}
        <Card style={styles.progressCard}>
          <Text style={styles.progressTitle}>Task Completion Rate</Text>
          <View style={styles.progressHeader}>
            <Text style={styles.progressValue}>
              {getCompletionRate().toFixed(1)}%
            </Text>
            <Text style={styles.progressSubtitle}>
              {analytics?.completedTasks || 0}/{analytics?.totalTasks || 0}{" "}
              tasks completed
            </Text>
          </View>
          <ProgressBar
            progress={getCompletionRate() / 100}
            style={{ marginBottom: 12 }}
          />
          <Text style={styles.progressInfo}>
            You're on track! Keep up the great work.
          </Text>
        </Card>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {quickActions.map(renderQuickAction)}

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Card style={styles.activityCard}>
          {recentActivity.map(renderActivityItem)}
        </Card>

        {/* Navigation Links */}
        <Text style={styles.sectionTitle}>Navigate</Text>
        <View style={styles.navigationGrid}>
          <TouchableOpacity
            style={[
              styles.navButton,
              { backgroundColor: colors.light.primary },
            ]}
            onPress={() => router.push("/(main)/projects")}
          >
            <Text style={styles.navIcon}>📁</Text>
            <Text style={styles.navText}>Projects</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              { backgroundColor: colors.light.secondary },
            ]}
            onPress={() => router.push("/(main)/boards")}
          >
            <Text style={styles.navIcon}>📋</Text>
            <Text style={styles.navText}>Boards</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              { backgroundColor: colors.light.warning },
            ]}
            onPress={() => router.push("/(main)/tasks")}
          >
            <Text style={styles.navIcon}>✅</Text>
            <Text style={styles.navText}>Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: colors.light.error }]}
            onPress={() => router.push("/(main)/team")}
          >
            <Text style={styles.navIcon}>👥</Text>
            <Text style={styles.navText}>Team</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#8B5CF6" }]}
            onPress={() => router.push("/(main)/analytics")}
          >
            <Text style={styles.navIcon}>📊</Text>
            <Text style={styles.navText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#10B981" }]}
            onPress={() => router.push("/(main)/profile")}
          >
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: "#2563EB" }]}
            onPress={() => router.push("/(main)/notifications")}
          >
            <Text style={styles.navIcon}>🔔</Text>
            <Text style={styles.navText}>Notifications</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    height: 40,
    minWidth: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    marginLeft: 8,
    backgroundColor: colors.light.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerButtonText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: typography.fontFamily.medium,
  },
  logoutText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 15,
    color: "#fff",
  },
  greeting: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 24,
    color: colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.light.textSecondary,
  },
  logoutButton: {
    // old style, now unused
  },
  searchButton: {
    backgroundColor: colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  searchButtonText: {
    fontSize: 20,
    color: "#fff",
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 20,
    color: colors.light.text,
    marginTop: 24,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  statTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 24,
    marginBottom: 2,
  },
  statSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  progressCard: {
    marginBottom: 24,
  },
  progressTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 18,
    color: colors.light.text,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    color: colors.light.primary,
  },
  progressSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  progressInfo: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  quickActionCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  quickActionIconText: {
    fontSize: 20,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.light.text,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  quickActionArrow: {
    color: colors.light.textSecondary,
    fontSize: 20,
  },
  activityCard: {
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 14,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: colors.light.text,
    marginBottom: 2,
  },
  activityDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.light.textSecondary,
    marginBottom: 2,
  },
  activityTime: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  navigationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  navButton: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  navText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: "#fff",
  },
});

export default DashboardScreen;
