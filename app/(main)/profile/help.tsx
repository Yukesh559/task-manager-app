import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { colors, typography } from "../../../theme";
import { router } from "expo-router";
import { Card } from "../../../components/ui/Card";

export default function HelpScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [contactMessage, setContactMessage] = useState("");

  const faqs = [
    {
      question: "How do I create a new project?",
      answer:
        'To create a new project, go to the Projects tab and tap the "+" button. Fill in the project details including name, description, and team members, then tap "Create Project".',
    },
    {
      question: "How do I assign tasks to team members?",
      answer:
        'When creating or editing a task, you can assign it to team members by tapping the "Assign" field and selecting from the list of available team members.',
    },
    {
      question: "Can I export my project data?",
      answer:
        "Yes, you can export your data by going to Profile > Privacy & Data > Export My Data. You will receive an email with the download link within 24 hours.",
    },
    {
      question: "How do I change my password?",
      answer:
        "Go to Profile > Account Settings > Change Password. Enter your current password and new password, then confirm the change.",
    },
    {
      question: "How do I invite team members?",
      answer:
        'Go to the Team tab and tap "Invite Member". Enter their email address, select their role, and choose which projects they should be added to.',
    },
    {
      question: "Can I use the app offline?",
      answer:
        "Currently, the app requires an internet connection to sync data. Offline support is planned for future updates.",
    },
  ];

  const helpCategories = [
    {
      title: "Getting Started",
      subtitle: "Learn the basics of using the app",
      icon: "🚀",
      onPress: () =>
        Alert.alert(
          "Coming Soon",
          "Getting Started guide will be available soon"
        ),
    },
    {
      title: "User Guide",
      subtitle: "Detailed instructions for all features",
      icon: "📖",
      onPress: () =>
        Alert.alert("Coming Soon", "User Guide will be available soon"),
    },
    {
      title: "Video Tutorials",
      subtitle: "Watch step-by-step video guides",
      icon: "🎥",
      onPress: () =>
        Alert.alert("Coming Soon", "Video Tutorials will be available soon"),
    },
    {
      title: "Keyboard Shortcuts",
      subtitle: "Learn keyboard shortcuts for faster workflow",
      icon: "⌨",
      onPress: () =>
        Alert.alert(
          "Coming Soon",
          "Keyboard Shortcuts guide will be available soon"
        ),
    },
  ];

  const contactOptions = [
    {
      title: "Email Support",
      subtitle: "support@taskmanager.com",
      icon: "📧",
      onPress: () =>
        Alert.alert(
          "Email Support",
          "Please email us at support@taskmanager.com"
        ),
    },
    {
      title: "Live Chat",
      subtitle: "Available 24/7",
      icon: "💬",
      onPress: () =>
        Alert.alert("Live Chat", "Live chat support will be available soon"),
    },
    {
      title: "Phone Support",
      subtitle: "+1 (555) 123-4567",
      icon: "📞",
      onPress: () =>
        Alert.alert("Phone Support", "Please call us at +1 (555) 123-4567"),
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleContactSubmit = () => {
    if (!contactMessage.trim()) {
      Alert.alert("Error", "Please enter a message");
      return;
    }
    Alert.alert(
      "Message Sent",
      "Thank you for your message. We will get back to you within 24 hours."
    );
    setContactMessage("");
  };

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          Help & Support
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchTextInput}
            placeholder="Search help articles..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.light.textSecondary}
          />
        </View>
      </View>

      {/* Help Categories */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginBottom: 16,
        }}
      >
        Help Categories
      </Text>

      {helpCategories.map((category, index) =>
        renderMenuItem(
          category.title,
          category.subtitle,
          category.icon,
          category.onPress
        )
      )}

      {/* FAQ */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        Frequently Asked Questions
      </Text>

      {filteredFAQs.map((faq, index) => (
        <TouchableOpacity key={index} onPress={() => toggleFAQ(index)}>
          <Card style={{ marginBottom: 12 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: typography.fontFamily.semiBold,
                  fontSize: 16,
                  color: colors.light.text,
                  flex: 1,
                  marginRight: 12,
                }}
              >
                {faq.question}
              </Text>
              <Text
                style={{
                  color: colors.light.textSecondary,
                  fontSize: 20,
                }}
              >
                {expandedFAQ === index ? "−" : "+"}
              </Text>
            </View>
            {expandedFAQ === index && (
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: 16,
                  color: colors.light.textSecondary,
                  marginTop: 12,
                  lineHeight: 24,
                }}
              >
                {faq.answer}
              </Text>
            )}
          </Card>
        </TouchableOpacity>
      ))}

      {/* Contact Support */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        Contact Support
      </Text>

      {contactOptions.map((option, index) =>
        renderMenuItem(
          option.title,
          option.subtitle,
          option.icon,
          option.onPress
        )
      )}

      {/* Contact Form */}
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: 18,
          color: colors.light.text,
          marginTop: 24,
          marginBottom: 16,
        }}
      >
        Send us a Message
      </Text>

      <Card style={{ marginBottom: 24 }}>
        <TextInput
          style={styles.messageInput}
          placeholder="Describe your issue or question..."
          value={contactMessage}
          onChangeText={setContactMessage}
          multiline
          numberOfLines={4}
          placeholderTextColor={colors.light.textSecondary}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleContactSubmit}
        >
          <Text style={styles.submitButtonText}>Send Message</Text>
        </TouchableOpacity>
      </Card>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>Task Manager v1.0.0</Text>
        <Text style={styles.appInfoText}>© 2024 Task Manager Inc.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 24,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchTextInput: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.light.text,
  },
  messageInput: {
    backgroundColor: colors.light.background,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.light.border,
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.light.text,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: colors.light.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: "#fff",
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: 24,
  },
  appInfoText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: 4,
  },
});
