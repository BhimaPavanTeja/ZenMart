import React from 'react';
import { TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

interface InputProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

export function Input({ style, containerStyle, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={Colors.text.muted}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.background,
    color: Colors.text.primary,
  },
});