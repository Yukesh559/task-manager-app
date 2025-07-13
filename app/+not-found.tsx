import { Text, View } from "react-native";

// Not Found Screen Placeholder
export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, color: "red" }}>Not Found</Text>
    </View>
  );
}
