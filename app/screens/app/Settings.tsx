import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../../components/AllComponents/ScreenWrapper";
import { useDispatch } from "react-redux";
import { useThemeColors } from "../../utills/ThemeStyles";
import { toggleTheme } from "../../redux/themeSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomButton } from "../../components";
import { logoutUser } from "../../redux/userSlice";
const Settings : React.FC = () => {
  const dispatch = useDispatch();
  const theme = useThemeColors();
  const handleLogout = async () => {
    try {
      dispatch(logoutUser());
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.log(error);
    }
  };
  const handleChangeTheme = async () => {
    dispatch(toggleTheme());
    await AsyncStorage.setItem(
      "theme",
      theme.mode === "light" ? "dark" : "light"
    );
  };
  return (
    <ScreenWrapper
      backgroundColor={theme.surface}
      statusBarStyle={theme.mode === "dark" ? "light-content" : "dark-content"}
      edges={["left", "right"]}
    >
      <Text style={ { color: theme.text }}>
        This is a themed screen
      </Text>

      <CustomButton title="Toggle Theme" onPress={handleChangeTheme} />
      <CustomButton title="Logout" onPress={handleLogout} />
    </ScreenWrapper>
  );
};

export default Settings;

const styles = StyleSheet.create({});
