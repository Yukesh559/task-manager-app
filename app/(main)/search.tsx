import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { colors, typography } from "../../theme";
import { useSearch } from "../../contexts/SearchContext";
import { Card } from "../../components/ui/Card";
import { Ionicons } from "@expo/vector-icons";

export default function SearchScreen() {
  const {
    searchQuery,
    setSearchQuery,
    searchType,
    setSearchType,
    activeFilters,
    setActiveFilters,
    clearFilters,
    searchResults,
    isLoading,
    performSearch,
    clearResults,
    searchHistory,
    clearHistory,
    removeFromHistory,
    savedSearches,
    deleteSavedSearch,
    loadSavedSearch,
    suggestions,
    generateSuggestions,
  } = useSearch();

  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      generateSuggestions(searchQuery);
    } else {
      setShowHistory(true);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim() || Object.keys(activeFilters).length > 0) {
      performSearch();
      setShowHistory(false);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    clearFilters();
    clearResults();
    setShowHistory(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "task":
        return "checkmark-circle";
      case "project":
        return "folder";
      case "board":
        return "grid";
      default:
        return "document";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "task":
        return colors.light.secondary;
      case "project":
        return colors.light.primary;
      case "board":
        return colors.light.warning;
      default:
        return colors.light.textSecondary;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "#10B981";
      case "in_progress":
        return "#F59E0B";
      case "pending":
        return "#6B7280";
      default:
        return colors.light.textSecondary;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#10B981";
      default:
        return colors.light.textSecondary;
    }
  };

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => {
        // Navigate to detail screen based on type
        switch (item.type) {
          case "task":
            router.push(`/(main)/tasks/${item.id}`);
            break;
          case "project":
            router.push(`/(main)/projects/${item.id}`);
            break;
          case "board":
            router.push(`/(main)/boards/${item.id}`);
            break;
        }
      }}
    >
      <Card style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <View style={styles.resultType}>
            <Ionicons
              name={getTypeIcon(item.type) as any}
              size={16}
              color={getTypeColor(item.type)}
            />
            <Text style={styles.resultTypeText}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
          </View>
          <Text style={styles.resultScore}>
            {Math.round(item.score * 100)}% match
          </Text>
        </View>
        <Text style={styles.resultTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.resultDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View style={styles.resultMeta}>
          {item.status && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Status:</Text>
              <Text
                style={[
                  styles.metaValue,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {item.status.replace("_", " ")}
              </Text>
            </View>
          )}
          {item.priority && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Priority:</Text>
              <Text
                style={[
                  styles.metaValue,
                  { color: getPriorityColor(item.priority) },
                ]}
              >
                {item.priority}
              </Text>
            </View>
          )}
          {item.assignee && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Assignee:</Text>
              <Text style={styles.metaValue}>{item.assignee}</Text>
            </View>
          )}
        </View>
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag: string, index: number) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => {
        setSearchQuery(item.query);
        setSearchType(item.type);
        performSearch();
        setShowHistory(false);
      }}
    >
      <Ionicons
        name="time-outline"
        size={16}
        color={colors.light.textSecondary}
      />
      <View style={styles.historyContent}>
        <Text style={styles.historyQuery}>{item.query}</Text>
        <Text style={styles.historyMeta}>
          {item.type} • {item.resultCount} results •{" "}
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => removeFromHistory(item.id)}
        style={styles.historyDelete}
      >
        <Ionicons name="close" size={16} color={colors.light.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSavedSearch = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.savedSearchItem}
      onPress={() => loadSavedSearch(item)}
    >
      <Ionicons name="bookmark" size={16} color={colors.light.primary} />
      <View style={styles.savedSearchContent}>
        <Text style={styles.savedSearchName}>{item.name}</Text>
        <Text style={styles.savedSearchMeta}>
          {item.type} • {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => deleteSavedSearch(item.id)}
        style={styles.savedSearchDelete}
      >
        <Ionicons name="trash-outline" size={16} color={colors.light.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => {
        setSearchQuery(item);
        handleSearch();
      }}
    >
      <Ionicons name="search" size={16} color={colors.light.textSecondary} />
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          style={styles.filterButton}
        >
          <Ionicons
            name={showFilters ? "options" : "options-outline"}
            size={24}
            color={colors.light.text}
          />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.light.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks, projects, boards..."
            placeholderTextColor={colors.light.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.light.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Search Type Selector */}
      <View style={styles.typeSelector}>
        {["all", "tasks", "projects", "boards"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              searchType === type && styles.typeButtonActive,
            ]}
            onPress={() => setSearchType(type as any)}
          >
            <Text
              style={[
                styles.typeButtonText,
                searchType === type && styles.typeButtonTextActive,
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filters */}
      {showFilters && (
        <Card style={styles.filtersCard}>
          <Text style={styles.filtersTitle}>Filters</Text>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Status</Text>
            <View style={styles.filterOptions}>
              {["pending", "in_progress", "completed"].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOption,
                    activeFilters.status?.includes(status) &&
                      styles.filterOptionActive,
                  ]}
                  onPress={() => {
                    const currentStatus = activeFilters.status || [];
                    const newStatus = currentStatus.includes(status)
                      ? currentStatus.filter((s) => s !== status)
                      : [...currentStatus, status];
                    setActiveFilters({
                      ...activeFilters,
                      status: newStatus.length > 0 ? newStatus : undefined,
                    });
                  }}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      activeFilters.status?.includes(status) &&
                        styles.filterOptionTextActive,
                    ]}
                  >
                    {status.replace("_", " ")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Priority</Text>
            <View style={styles.filterOptions}>
              {["low", "medium", "high"].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.filterOption,
                    activeFilters.priority?.includes(priority) &&
                      styles.filterOptionActive,
                  ]}
                  onPress={() => {
                    const currentPriority = activeFilters.priority || [];
                    const newPriority = currentPriority.includes(priority)
                      ? currentPriority.filter((p) => p !== priority)
                      : [...currentPriority, priority];
                    setActiveFilters({
                      ...activeFilters,
                      priority:
                        newPriority.length > 0 ? newPriority : undefined,
                    });
                  }}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      activeFilters.priority?.includes(priority) &&
                        styles.filterOptionTextActive,
                    ]}
                  >
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.filterActions}>
            <TouchableOpacity
              onPress={clearFilters}
              style={styles.clearFiltersButton}
            >
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSearch}
              style={styles.applyFiltersButton}
            >
              <Text style={styles.applyFiltersText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.light.primary} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <View>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""}
              </Text>
              <TouchableOpacity onPress={handleClear}>
                <Text style={styles.clearResultsText}>Clear</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        ) : showHistory ? (
          <View>
            {/* Search History */}
            {searchHistory.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={clearHistory}>
                    <Text style={styles.clearHistoryText}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={searchHistory}
                  renderItem={renderHistoryItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              </View>
            )}

            {/* Saved Searches */}
            {savedSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Saved Searches</Text>
                <FlatList
                  data={savedSearches}
                  renderItem={renderSavedSearch}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              </View>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Suggestions</Text>
                <FlatList
                  data={suggestions}
                  renderItem={renderSuggestion}
                  keyExtractor={(item) => item}
                  scrollEnabled={false}
                />
              </View>
            )}
          </View>
        ) : searchQuery || Object.keys(activeFilters).length > 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons
              name="search"
              size={48}
              color={colors.light.textSecondary}
            />
            <Text style={styles.noResultsTitle}>No results found</Text>
            <Text style={styles.noResultsText}>
              Try adjusting your search terms or filters
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 18,
    color: colors.light.text,
    textAlign: "center",
    marginHorizontal: 16,
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: 16,
    color: colors.light.text,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
  },
  searchButtonText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: "#fff",
  },
  typeSelector: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.light.surface,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: colors.light.primary,
  },
  typeButtonText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  filtersCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filtersTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.light.text,
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.light.text,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  filterOptionActive: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  filterOptionText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.light.text,
  },
  filterOptionTextActive: {
    color: "#fff",
  },
  filterActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  clearFiltersButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearFiltersText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.light.error,
  },
  applyFiltersButton: {
    backgroundColor: colors.light.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  applyFiltersText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  loadingText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 16,
    color: colors.light.textSecondary,
    marginTop: 16,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsCount: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.light.text,
  },
  clearResultsText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.light.primary,
  },
  resultCard: {
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resultType: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultTypeText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.light.textSecondary,
    marginLeft: 4,
  },
  resultScore: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  resultTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.light.text,
    marginBottom: 4,
  },
  resultDescription: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: 8,
  },
  resultMeta: {
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    marginBottom: 2,
  },
  metaLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.light.textSecondary,
    width: 60,
  },
  metaValue: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.light.text,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  tag: {
    backgroundColor: colors.light.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 10,
    color: colors.light.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: colors.light.text,
  },
  clearHistoryText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.light.primary,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    marginBottom: 8,
  },
  historyContent: {
    flex: 1,
    marginLeft: 12,
  },
  historyQuery: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.light.text,
    marginBottom: 2,
  },
  historyMeta: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  historyDelete: {
    padding: 4,
  },
  savedSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    marginBottom: 8,
  },
  savedSearchContent: {
    flex: 1,
    marginLeft: 12,
  },
  savedSearchName: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.light.text,
    marginBottom: 2,
  },
  savedSearchMeta: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  savedSearchDelete: {
    padding: 4,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    marginBottom: 8,
  },
  suggestionText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.light.text,
    marginLeft: 12,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  noResultsTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 18,
    color: colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: "center",
  },
});
