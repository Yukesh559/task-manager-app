import React from "react";
import { Stack } from "expo-router";
import { useAppFonts } from "../theme/fonts";
import { colors, typography } from "../theme";
import { ActivityIndicator, View, Text } from "react-native";
import { AuthProvider } from "../contexts/AuthContext";
import { ProjectsProvider } from "../contexts/ProjectsContext";
import { BoardsProvider } from "../contexts/BoardsContext";
import { TasksProvider } from "../contexts/TasksContext";
import { TeamProvider } from "../contexts/TeamContext";
import { AnalyticsProvider } from "../contexts/AnalyticsContext";
import { ProfileProvider } from "../contexts/ProfileContext";
import { NotificationsProvider } from "../contexts/NotificationsContext";
import { OfflineProvider } from "../contexts/OfflineContext";
import { SearchProvider } from "../contexts/SearchContext";

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.light.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.light.primary} />
        <Text
          style={{
            marginTop: 16,
            fontFamily: typography.fontFamily.medium,
            fontSize: 18,
            color: colors.light.text,
          }}
        >
          Loading fonts...
        </Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <ProjectsProvider>
        <BoardsProvider>
          <TasksProvider>
            <TeamProvider>
              <AnalyticsProvider>
                <ProfileProvider>
                  <NotificationsProvider>
                    <OfflineProvider>
                      <SearchProvider>
                        <Stack>
                          <Stack.Screen
                            name="(auth)/login"
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="(auth)/register"
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="(auth)/forgot-password"
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="(main)"
                            options={{ headerShown: false }}
                          />
                          <Stack.Screen
                            name="+not-found"
                            options={{ headerShown: false }}
                          />
                        </Stack>
                      </SearchProvider>
                    </OfflineProvider>
                  </NotificationsProvider>
                </ProfileProvider>
              </AnalyticsProvider>
            </TeamProvider>
          </TasksProvider>
        </BoardsProvider>
      </ProjectsProvider>
    </AuthProvider>
  );
}
