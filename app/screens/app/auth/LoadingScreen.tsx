// src/screens/LoadingScreen.js
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React from "react";
import { useThemeColors } from "../../../utills/ThemeStyles";

const LoadingScreen = () => {
  const theme = useThemeColors();
  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[styles.text, { color: theme.text }]}>Loading...</Text>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, // or any custom color
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    color: "#fff",
    fontSize: 16,
  },
});
