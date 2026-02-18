import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../../components/AllComponents/ScreenWrapper";
import { useThemeColors } from "../../../utills/ThemeStyles";
import { CustomButton, CustomInput } from "../../../components";
import Feather from "@expo/vector-icons/Feather";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "../../../firebase/config";
import Constants from "expo-constants";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/userSlice";

const androidClientId = Constants.expoConfig?.extra?.androidClientId;
const webClientId = Constants.expoConfig?.extra?.webClientId;

WebBrowser.maybeCompleteAuthSession();

type FormData = {
  email: string;
  password: string;
};

const Login = ({ navigation }: any) => {
  const theme = useThemeColors();
  const [isPasswordShowing, setIsPasswordShowing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const redirectUri = AuthSession.makeRedirectUri({
    // useProxy: false,
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

  const handleEmailSignIn = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      Alert.alert("Both email and password are required.");
      return;
    }

    try {
      setIsLoading(true);
      const res: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      if (res.user) {
        const idToken = await res.user.getIdToken(); // <-- await here
        dispatch(
          setUser({
            email: res.user.email!,
            refreshToken: res.user.refreshToken!,
            idToken,
            isLoggedIn: true,
          }),
        );
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            email: res.user.email!,
            refreshToken: res.user.refreshToken!,
            idToken,
            isLoggedIn: true,
          }),
        );
      }

      setFormData({ email: "", password: "" });
      setIsLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Login Error", error.message);
      } else {
        Alert.alert("Login Error", "Something went wrong");
      }
      setIsLoading(false);
    }
  };

  const getUserInfo = async (token?: string) => {
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
    } catch (error: any) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userJSON = await AsyncStorage.getItem("user");
      if (userJSON) {
      } else if (response?.type === "success") {
        getUserInfo(response.authentication?.accessToken);
      }
    } catch (error) {
      console.error("AsyncStorage error:", error);
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
            Sign In
          </Text>
          <View>
            <CustomInput
              leftIcon={<Feather name="mail" size={20} color={theme.text} />}
              placeholder={"Enter Email Address"}
              title={"Email"}
              value={formData.email}
              onChangeText={(text: string) =>
                setFormData({ ...formData, email: text })
              }
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
              onChangeText={(text: string) =>
                setFormData({ ...formData, password: text })
              }
            />
          </View>
          <View style={{ gap: 10 }}>
            <CustomButton
              loading={isLoading}
              disabled={isLoading}
              title="Sign In"
              onPress={handleEmailSignIn}
            />
            <Text style={{ color: theme.text, textAlign: "center" }}>or</Text>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: theme.text }}>
                Don't have an account?{" "}
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                  <Text style={{ color: theme.primary, fontWeight: "bold" }}>
                    Sign Up
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

export default Login;

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
