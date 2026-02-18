import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Login, SearchScreen, SignUp, VideoScreen } from "../screens";
const { Screen, Navigator } = createNativeStackNavigator();
import BottomTab from "./BottomTab";
import { useDispatch, useSelector } from "react-redux";
import { useThemeColors, useTypedSelector } from "../utills/ThemeStyles";
import { View } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from "../redux/userSlice";
import { setTheme } from "../redux/themeSlice";
import LoadingScreen from "../screens/app/auth/LoadingScreen";
import { setUserNotes } from "../redux/notesSlice";

export const Container = () => {
  return (
    <NavigationContainer>
      <Stack />
    </NavigationContainer>
  );
};

const Stack = () => {
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const isLoggedIn = useTypedSelector((state) => state.user.isLoggedIn);
  const theme = useThemeColors();
  const dispatch = useDispatch();
  const fetchData = async () => {
    try {
      const themeColor = await AsyncStorage.getItem("theme");
      const user = await AsyncStorage.getItem("user");
      const notes = await AsyncStorage.getItem("videoNotes");
      if (themeColor) {
        dispatch(setTheme(themeColor));
      }
      if (user) {
        dispatch(setUser(JSON.parse(user)));
      }
      if (notes) {
        dispatch(setUserNotes(JSON.parse(notes)));
      }
      setIsInitializing(false);
    } catch (error) {
      console.log(error);
      setIsInitializing(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (isInitializing) {
    return <LoadingScreen />;
  }
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Navigator>
        {isLoggedIn ? (
          <>
            <Screen
              name="BottomTab"
              component={BottomTab}
              options={{ headerShown: false }}
            />
            <Screen
              name="SearchScreen"
              component={SearchScreen}
              options={{ headerShown: false }}
            />
            <Screen
              name="VideoScreen"
              component={VideoScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Screen
              name="SignUp"
              component={SignUp}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Navigator>
    </View>
  );
};

export default Stack;
