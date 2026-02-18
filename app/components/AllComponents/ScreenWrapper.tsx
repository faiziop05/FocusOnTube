import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  StatusBarProps
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



type Props={
  children:React.ReactNode;
  scroll?:boolean;
  backgroundColor?:string;
  padding?:boolean;
  statusBarStyle?: any;
  edges?: Array<"bottom" | "top" | "left" | "right">;
}

const ScreenWrapper = ({
  children,
  scroll = false,
  backgroundColor = "#888",
  padding = true,
  statusBarStyle,
  edges,
}:Props) => {
  const Container = scroll ? ScrollView : View;

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, { backgroundColor }]}>
      <StatusBar barStyle={statusBarStyle} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Container
          contentContainerStyle={
            scroll ? [styles.flexGrow, padding && styles.padding] : undefined
          }
          style={!scroll && padding ? styles.padding : undefined}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </Container>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  padding: {
    padding: 16,
  },
});
