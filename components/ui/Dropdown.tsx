import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  FlatList,
} from "react-native";
import { Modal } from "./Modal";
import { colors, typography } from "../../theme";

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  style,
}) => {
  const [visible, setVisible] = useState(false);
  const selected = options.find((o) => o.value === value);
  return (
    <View style={style}>
      <TouchableOpacity style={styles.input} onPress={() => setVisible(true)}>
        <Text style={styles.text}>
          {selected ? selected.label : placeholder || "Select..."}
        </Text>
      </TouchableOpacity>
      <Modal visible={visible} onClose={() => setVisible(false)}>
        <FlatList
          data={options}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onChange(item.value);
                setVisible(false);
              }}
            >
              <Text style={styles.text}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  text: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    color: colors.light.text,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
});
