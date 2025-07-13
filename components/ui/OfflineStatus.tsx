import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, typography } from "../../theme";
import { useOffline } from "../../contexts/OfflineContext";

export const OfflineStatus = () => {
  const { isOnline, isSyncing, pendingActionsCount, syncData } = useOffline();

  if (isOnline && pendingActionsCount === 0) {
    return null; // Don't show anything when online and no pending actions
  }

  return (
    <View style={[styles.container, !isOnline && styles.offlineContainer]}>
      <View style={styles.content}>
        <Text style={styles.icon}>
          {!isOnline ? "📡" : isSyncing ? "🔄" : "📤"}
        </Text>
        <View style={styles.textContainer}>
          <Text style={styles.statusText}>
            {!isOnline
              ? "You're offline"
              : isSyncing
              ? "Syncing data..."
              : `${pendingActionsCount} pending changes`}
          </Text>
          {!isOnline && (
            <Text style={styles.subText}>
              Changes will sync when you're back online
            </Text>
          )}
        </View>
        {isOnline && pendingActionsCount > 0 && !isSyncing && (
          <TouchableOpacity onPress={syncData} style={styles.syncButton}>
            <Text style={styles.syncButtonText}>Sync Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.warning,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  offlineContainer: {
    backgroundColor: colors.light.error,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  statusText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: "#fff",
    marginBottom: 2,
  },
  subText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  syncButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  syncButtonText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: "#fff",
  },
});
