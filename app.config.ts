export default {
  expo: {
    name: "FocusOnTube",
    slug: "focusontube",
    scheme: "focusontube",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.faiziop05.focusontube",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      androidClientId:
        "661159640057-n7659sg9nknl52elkle5dh9qhmir9m6o.apps.googleusercontent.com",
      webClientId:
        "661159640057-pc3ssq54rmmhp71e1m467dk3ueifbpt6.apps.googleusercontent.com",
      youTubeApiKey: "AIzaSyAAQ9f6bBiaROOTYceTv62NjDM7vSqst5s",
      eas: {
        projectId: "f021d15a-8236-421e-af76-6a56b26fd70b",
      },
    },
    plugins: ["expo-web-browser","expo-font",
    "expo-asset"],
    owner: "faiziop05",
  },
};
