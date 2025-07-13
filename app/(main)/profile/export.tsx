import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { colors, typography } from "../../../theme";
import { router } from "expo-router";
import { Card } from "../../../components/ui/Card";

export default function ExportScreen() {
  const [selectedDataTypes, setSelectedDataTypes] = useState({
    projects: true,
    tasks: true,
    boards: true,
    team: true,
    analytics: false,
    profile: true,
  });

  const [exportFormat, setExportFormat] = useState("json");
  const [includeAttachments, setIncludeAttachments] = useState(false);

  const dataTypes = [
    {
      key: "projects",
      title: "Projects",
      description: "All project data including details, members, and settings",
      icon: "📁",
    },
    {
      key: "tasks",
      title: "Tasks",
      description: "All task data including assignments, comments, and history",
      icon: "✅",
    },
    {
      key: "boards",
      title: "Boards",
      description: "Kanban boards and column configurations",
      icon: "📋",
    },
    {
      key: "team",
      title: "Team Data",
      description: "Team members, roles, and permissions",
      icon: "👥",
    },
    {
      key: "analytics",
      title: "Analytics",
      description: "Performance metrics and usage statistics",
      icon: "📊",
    },
    {
      key: "profile",
      title: "Profile Data",
      description: "Personal information and preferences",
      icon: "👤",
    },
  ];

  const exportFormats = [
    { key: "json", title: "JSON", description: "Structured data format" },
    { key: "csv", title: "CSV", description: "Spreadsheet compatible format" },
    { key: "pdf", title: "PDF", description: "Printable report format" },
  ];

  const exportHistory = [
    {
      id: "1",
      date: "2024-01-15",
      type: "Full Export",
      format: "JSON",
      status: "Completed",
      size: "2.3 MB",
    },
    {
      id: "2",
      date: "2024-01-10",
      type: "Tasks Only",
      format: "CSV",
      status: "Completed",
      size: "1.1 MB",
    },
    {
      id: "3",
      date: "2024-01-05",
      type: "Full Export",
      format: "PDF",
      status: "Failed",
      size: "N/A",
    },
  ];

  const toggleDataType = (key: string) => {
    setSelectedDataTypes((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleExport = () => {
    const selectedTypes = Object.keys(selectedDataTypes).filter(
      (key) => selectedDataTypes[key as keyof typeof selectedDataTypes]
    );

    if (selectedTypes.length === 0) {
      Alert.alert("Error", "Please select at least one data type to export");
      return;
    }

    Alert.alert(
      "Export Data",
      `Your data export request has been submitted.\n\nSelected: ${selectedTypes.join(
        ", "
      )}\nFormat: ${exportFormat.toUpperCase()}\n\nYou will receive an email with the download link within 24 hours.`,
      [{ text: "OK" }]
    );
  };

  const handleDownload = (exportId: string) => {
    Alert.alert(
      "Download",
      "The download will start automatically. Check your email for the download link."
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return colors.light.secondary;
      case "Failed":
        return colors.light.error;
      case "Processing":
        return colors.light.warning;
      default:
        return colors.light.textSecondary;
    }
  };

  const renderMenuItem = (
    title: string,
    subtitle: string,
    icon: string,
    onPress: () => void
  ) => (
    <TouchableOpacity onPress={onPress}>
      <Card style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
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
                fontSize: 16,
              }}
            >
              {icon}
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
              {title}
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 14,
                color: colors.light.textSecondary,
              }}
            >
              {subtitle}
            </Text>
          </View>

          <Text
            style={{
              color: colors.light.textSecondary,
              fontSize: 20,
            }}
          >
            ›
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.light.background,
        padding: 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text
            style={{
              color: colors.light.primary,
              fontFamily: typography.fontFamily.medium,
              fontSize: 16,
            }}
          >
            {"<"} Back
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: typography.fontFamily.bold,
            fontSize: 20,
            color: colors.light.text,
            marginLeft: 16,
          }}
        >
          Export Data
        </Text>
      </View>

      {/* Data Types Selection */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 16,
        }}
      >
        Select Data to Export
      </Text>

      {dataTypes.map((dataType) => (
        <Card key={dataType.key} style={{ marginBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
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
                    fontSize: 16,
                  }}
                >
                  {dataType.icon}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.semiBold,
                    fontSize: 16,
                    color: colors.light.text,
                    marginBottom: 4,
                  }}
                >
                  {dataType.title}
                </Text>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.regular,
                    fontSize: 14,
                    color: colors.light.textSecondary,
                  }}
                >
                  {dataType.description}
                </Text>
              </View>
            </View>
            <Switch
              value={
                selectedDataTypes[
                  dataType.key as keyof typeof selectedDataTypes
                ]
              }
              onValueChange={() => toggleDataType(dataType.key)}
              trackColor={{
                false: colors.light.border,
                true: colors.light.primary,
              }}
              thumbColor={colors.light.card}
            />
          </View>
        </Card>
      ))}

      {/* Export Format */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        Export Format
      </Text>

      {exportFormats.map((format) => (
        <TouchableOpacity
          key={format.key}
          onPress={() => setExportFormat(format.key)}
        >
          <Card style={{ marginBottom: 12 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.semiBold,
                    fontSize: 16,
                    color: colors.light.text,
                    marginBottom: 4,
                  }}
                >
                  {format.title}
                </Text>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.regular,
                    fontSize: 14,
                    color: colors.light.textSecondary,
                  }}
                >
                  {format.description}
                </Text>
              </View>
              {exportFormat === format.key && (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: colors.light.primary,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>
                </View>
              )}
            </View>
          </Card>
        </TouchableOpacity>
      ))}

      {/* Options */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        Export Options
      </Text>

      <Card style={{ marginBottom: 24 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, marginRight: 16 }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.semiBold,
                fontSize: 16,
                color: colors.light.text,
                marginBottom: 4,
              }}
            >
              Include Attachments
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.regular,
                fontSize: 14,
                color: colors.light.textSecondary,
              }}
            >
              Include files and images attached to tasks and projects
            </Text>
          </View>
          <Switch
            value={includeAttachments}
            onValueChange={setIncludeAttachments}
            trackColor={{
              false: colors.light.border,
              true: colors.light.primary,
            }}
            thumbColor={colors.light.card}
          />
        </View>
      </Card>

      {/* Export Button */}
      <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
        <Text style={styles.exportButtonText}>📤 Export Data</Text>
      </TouchableOpacity>

      {/* Export History */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        Export History
      </Text>

      {exportHistory.map((exportItem) => (
        <Card key={exportItem.id} style={{ marginBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
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
                    fontFamily: typography.fontFamily.semiBold,
                    fontSize: 16,
                    color: colors.light.text,
                  }}
                >
                  {exportItem.type}
                </Text>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.medium,
                    fontSize: 14,
                    color: getStatusColor(exportItem.status),
                  }}
                >
                  {exportItem.status}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.regular,
                    fontSize: 14,
                    color: colors.light.textSecondary,
                    marginRight: 12,
                  }}
                >
                  {exportItem.date}
                </Text>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.regular,
                    fontSize: 14,
                    color: colors.light.textSecondary,
                    marginRight: 12,
                  }}
                >
                  {exportItem.format}
                </Text>
                <Text
                  style={{
                    fontFamily: typography.fontFamily.regular,
                    fontSize: 14,
                    color: colors.light.textSecondary,
                  }}
                >
                  {exportItem.size}
                </Text>
              </View>
            </View>
            {exportItem.status === "Completed" && (
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => handleDownload(exportItem.id)}
              >
                <Text style={styles.downloadButtonText}>📥</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>
      ))}

      {/* Information */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        About Data Export
      </Text>

      <Card style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: 16,
            color: colors.light.textSecondary,
            lineHeight: 24,
          }}
        >
          • Exports are processed in the background and may take up to 24 hours
          {"\n"}• Large exports may be split into multiple files{"\n"}• Your
          data is encrypted during transfer{"\n"}• Download links expire after 7
          days{"\n"}• You can request up to 5 exports per month
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  exportButton: {
    backgroundColor: colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  exportButtonText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: "#fff",
  },
  downloadButton: {
    padding: 8,
  },
  downloadButtonText: {
    fontSize: 16,
  },
});
