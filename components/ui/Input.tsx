import React from "react";
import { TextInput, View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, typography } from "../../theme";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  style?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  style,
}) => {
  const palette = colors.light;
  return (
    <View style={style}>
      <TextInput
        style={[
          styles.input,
          { borderColor: error ? palette.error : palette.border },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.textSecondary}
        secureTextEntry={secureTextEntry}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: colors.light.text,
    marginBottom: 4,
  },
  error: {
    color: colors.light.error,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.caption,
    marginTop: 2,
  },
});
