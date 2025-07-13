import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { colors, typography } from "../../theme";
import { useNotifications } from "../../contexts/NotificationsContext";
import { router } from "expo-router";
import { Card } from "../../components/ui/Card";

export default function NotificationsScreen() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteNotification(id),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>{"<"} Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.topBar}>
        <Text style={styles.unreadCount}>{unreadCount} Unread</Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={styles.markAllRead}>Mark All as Read</Text>
        </TouchableOpacity>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No notifications yet.</Text>
        </View>
      ) : (
        notifications.map((n) => (
          <Card
            key={n.id}
            style={[styles.notificationCard, !n.read && styles.unreadCard]}
          >
            <View style={styles.notificationRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>
                  {n.type === "task" && "✅"}
                  {n.type === "project" && "📁"}
                  {n.type === "team" && "👥"}
                  {n.type === "system" && "🔔"}
                </Text>
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{n.title}</Text>
                <Text style={styles.notificationMessage}>{n.message}</Text>
                <Text style={styles.notificationTime}>
                  {new Date(n.createdAt).toLocaleString()}
                </Text>
              </View>
              {!n.read && (
                <TouchableOpacity onPress={() => markAsRead(n.id)}>
                  <Text style={styles.markRead}>Mark Read</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => handleDelete(n.id)}>
                <Text style={styles.delete}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backText: {
    color: colors.light.primary,
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    color: colors.light.text,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  unreadCount: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: colors.light.primary,
  },
  markAllRead: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.light.secondary,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 48,
  },
  emptyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.light.textSecondary,
  },
  notificationCard: {
    marginBottom: 12,
    backgroundColor: colors.light.card,
  },
  unreadCard: {
    borderColor: colors.light.primary,
    borderWidth: 1.5,
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    color: "#fff",
    fontSize: 20,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.light.text,
    marginBottom: 2,
  },
  notificationMessage: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: 2,
  },
  notificationTime: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  markRead: {
    color: colors.light.secondary,
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    marginLeft: 8,
    marginRight: 8,
  },
  delete: {
    fontSize: 18,
    marginLeft: 8,
  },
});
