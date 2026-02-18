import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../../components/AllComponents/ScreenWrapper";
import { useThemeColors } from "../../../utills/ThemeStyles";
import { CustomButton, CustomInput } from "../../../components";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { auth } from "../../../firebase/config";
import Constants from "expo-constants";

const androidClientId = Constants.expoConfig?.extra?.androidClientId;
const webClientId = Constants.expoConfig?.extra?.webClientId;

WebBrowser.maybeCompleteAuthSession();
type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};
const SignUp: React.FC = ({ navigation }: any) => {
  const theme = useThemeColors();
  const [isPasswordShowing, setIsPasswordShowing] = useState<boolean>(false);
  const [isConfirmPasswordShowing, setIsConfirmPasswordShowing] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "focusontube",
  });

  const [request, response, promptAsync]: [
    any,
    AuthSession.AuthSessionResult | null,
    any,
  ] = Google.useAuthRequest({
    androidClientId,
    webClientId,
    redirectUri,
  });

  const handleEmailSignUp = async ():Promise<void> => {
    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      Alert.alert("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Account created successfully!");
      navigation.pop();
      setFormData({ email: "", password: "", confirmPassword: "" });
      setIsLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Sign Up Error", error.message);
      } else {
        Alert.alert("Sign Up Error", "Something went wrong");
      }
      setIsLoading(false);
    }
  };

  const getUserInfo = async (token: string):Promise<void> => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const user = await response.json();
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const signInWithGoogle = async () : Promise<void> => {
    try {
      if (response?.type === "success" && response.authentication) {
        getUserInfo(response.authentication.accessToken);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("AsyncStorage error:", error);
      } else {
        console.log("AsyncStorage error");
      }
    }
  };

  useEffect(() => {
    signInWithGoogle();
  }, [response]);

  return (
    <ScreenWrapper
      scroll={true}
      statusBarStyle={theme.mode === "light" ? "dark-content" : "light-content"}
      edges={["left", "right"]}
      backgroundColor={theme.surface}
    >
      <View style={styles.sections2Wrapper}>
        <View style={styles.sectionsWrapper}>
          <Text style={[styles.signUpheading, { color: theme.primary }]}>
            Create Account
          </Text>
          <View>
            <CustomInput
              leftIcon={<Feather name="mail" size={20} color={theme.text} />}
              placeholder={"Enter Email Address"}
              title={"Email"}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            <CustomInput
              leftIcon={<Feather name="lock" size={20} color={theme.text} />}
              placeholder={"Enter Password"}
              title={"Password"}
              secureTextEntry={!isPasswordShowing}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setIsPasswordShowing(!isPasswordShowing)}
                >
                  <Feather
                    name={isPasswordShowing ? "eye" : "eye-off"}
                    size={20}
                    color={theme.text}
                  />
                </TouchableOpacity>
              }
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
            />
            <CustomInput
              leftIcon={<Feather name="lock" size={20} color={theme.text} />}
              placeholder={"Enter Confirm Password"}
              title={"Confirm Password"}
              secureTextEntry={!isConfirmPasswordShowing}
              rightIcon={
                <TouchableOpacity
                  onPress={() =>
                    setIsConfirmPasswordShowing(!isConfirmPasswordShowing)
                  }
                >
                  <Feather
                    name={isConfirmPasswordShowing ? "eye" : "eye-off"}
                    size={20}
                    color={theme.text}
                  />
                </TouchableOpacity>
              }
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
            />
          </View>
          <View style={{ gap: 10 }}>
            <CustomButton
              loading={isLoading}
              disabled={isLoading}
              title="Create Account"
              onPress={handleEmailSignUp}
            />
            <Text style={{ color: theme.text, textAlign: "center" }}>or</Text>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: theme.text }}>
                Already have an account?{" "}
                <TouchableOpacity onPress={() => navigation.pop()}>
                  <Text style={{ color: theme.primary, fontWeight: "bold" }}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  signUpheading: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
  },
  sectionsWrapper: {
    gap: 50,
  },
  sections2Wrapper: {
    justifyContent: "space-between",
    flex: 1,
    marginVertical: 10,
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 50,
    width: 60,
    height: 60,
    borderWidth: 0.2,
  },
});
