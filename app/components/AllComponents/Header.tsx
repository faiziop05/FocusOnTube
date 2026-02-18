import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import Feather from "@expo/vector-icons/Feather";
import { useThemeColors } from "../../utills/ThemeStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";

type Props={
  value?:string;
  onChangeText?:(text:string)=>void,
  onCrossPress?:()=>void,
  navigation?:any
}

const Header = ({ value, onChangeText, navigation, onCrossPress }:Props) => {
  const theme = useThemeColors();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.pop()}
        style={{ ...styles.button, borderColor: theme.border }}
      >
        <Ionicons name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <CustomInput
          rightIcon={
            value ? (
              <TouchableOpacity
                onPress={onCrossPress}
                style={{
                  borderColor: theme.border,
                  width: 30,
                  height: 30,
                  borderWidth: 1,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Entypo name="cross" size={20} color={theme.text} />
              </TouchableOpacity>
            ) : null
          }
          style={{ flex: 1, marginVertical: 0 }}
          inputStyle={{ color: theme.text }}
          placeholder={"Search here"}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal:10,
    gap: 5,
  },
  inputContainer: {
    flex: 1, // space between input and button
  },
  button: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    padding: 10,
    borderRadius: 50,
  },
});
