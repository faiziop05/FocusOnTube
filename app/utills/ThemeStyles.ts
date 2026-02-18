import { useSelector } from "react-redux";
import { TypedUseSelectorHook } from "react-redux";
import { RootState } from "../redux/store"; // path to your store file

export const useTypedSelector: TypedUseSelectorHook<RootState> =useSelector
export const lightTheme = {
  mode: "light",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  text: "#212121",
  secondaryText: "#616161",
  primary: "#7C4DFF", // vibrant purple
  primaryDisabled: "#D1BFFF", // lighter, desaturated purple
  accent: "#FF6D00",
  border: "#E0E0E0",
  white: "#FFFFFF",
  black: "#000000",
};

export const darkTheme = {
  mode: "dark",
  background: "#121212",
  surface: "#1E1E1E",
  text: "#E0E0E0",
  secondaryText: "#9E9E9E",
  primary: "#7C4DFF", // softer purple for dark mode
  primaryDisabled: "#D1BFFF", // muted/darkened version of primary
  accent: "#FF6D00",
  border: "#2C2C2C",
  white: "#FFFFFF",
  black: "#000000",
};


export const useThemeColors = () => {
  const mode = useTypedSelector((state) => state.theme.mode);
  // const mode = 'dark'
  return mode === "dark" ? darkTheme : lightTheme;
};
