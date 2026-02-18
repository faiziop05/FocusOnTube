import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Home, Settings } from "../screens";
import { useThemeColors } from "../utills/ThemeStyles";
const { Screen, Navigator } = createBottomTabNavigator();
import Feather from "@expo/vector-icons/Feather";
const BottomTab = () => {
  const theme = useThemeColors();
  return (
    <Navigator
      screenOptions={{
        tabBarActiveBackgroundColor: theme.surface,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 0.5,
          borderColor: theme.border,
          shadowColor: "transparent",
        },
        headerStyle: {
          backgroundColor: theme.surface,
          shadowColor: "transparent",
          borderBottomWidth: 0.5,
          borderBottomColor: theme.border,
        },
        headerTintColor: theme.text,
        headerShown:false
      }}
    >
      <Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Screen name="Settings" component={Settings} 
              options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
    </Navigator>
  );
};

export default BottomTab;
