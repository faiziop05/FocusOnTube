import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../utills/ThemeStyles";

type props={
  title:string,
  onPress:()=>void,
  disabled?:boolean,
  loading?:boolean;
  icon?:React.ReactNode,
  iconPosition?:'left' | 'right',
  buttonStyle?:StyleProp<ViewStyle>,
  textStyle?:StyleProp<TextStyle>,
  loaderColor?:string;
}

const CustomButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left", // or 'right'
  buttonStyle,
  textStyle,
  loaderColor,
  ...rest
}:props) => {
  const theme = useThemeColors();
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={theme.white} />;
    }

    return (
      <View style={styles.content}>
        {icon && iconPosition === "left" && (
          <View style={styles.icon}>{icon}</View>
        )}
        <Text style={[styles.text,{color:theme.white}, textStyle]}>{title}</Text>
        {icon && iconPosition === "right" && (
          <View style={styles.icon}>{icon}</View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: theme.primary },
        disabled && {backgroundColor:theme.primaryDisabled},
        buttonStyle,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical:10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    marginHorizontal: 5,
  },
});
