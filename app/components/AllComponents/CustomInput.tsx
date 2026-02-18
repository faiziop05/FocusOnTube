import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps
} from "react-native";
import { useThemeColors } from "../../utills/ThemeStyles";
import { StyleProp } from "react-native";

type props=TextInputProps & {
  title?:string,
  leftIcon?:React.ReactNode,
  rightIcon?:React.ReactNode,
  onRightIconPress?:()=>void,
  style?:StyleProp<ViewStyle>,
  inputStyle?:StyleProp<TextStyle>,
  titleStyle?:StyleProp<TextStyle>,
}

const CustomInput = ({
  title,
  value,
  onChangeText,
  placeholder,
  leftIcon,
  rightIcon,
  onRightIconPress,
  keyboardType = "default",
  secureTextEntry = false,
  editable = true,
  style,
  inputStyle,
  titleStyle,
  ...rest
}:props) =>  {
  const theme = useThemeColors();
  return (
    <View style={[{marginVertical:5},style]}>
      {title && (
        <Text style={[styles.title, { color: theme.text }, titleStyle]}>
          {title}
        </Text>
      )}

      <View
        style={[
          styles.container,
          { backgroundColor: theme.surface, borderColor: theme.border },
          !editable && {
            ...styles.disabledContainer,
            backgroundColor: theme.border,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        <TextInput
          style={[styles.input,{color:theme.text}, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.secondaryText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={editable}
          {...rest}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconContainer}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  title: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: "center",

    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  iconContainer: {
    marginHorizontal: 5,
  },
  disabledContainer: {
    opacity: 0.6,
  },
});
