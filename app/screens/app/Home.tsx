import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ScreenWrapper from "../../components/AllComponents/ScreenWrapper";
import { useThemeColors, useTypedSelector } from "../../utills/ThemeStyles";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";

// Import Note type from your Redux slice
import { Note } from "../../redux/notesSlice"; // Adjust path

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useThemeColors();

  // Get notes from Redux store
  const userNotes: Note[] = useTypedSelector((state) => state.notes.notes);

  // Render item for FlatList
  const renderItem = ({ item }: { item: Note }) => {
    // Assuming item has a snippet if it's a video object; optional chaining used
    const thumb = (item as any)?.snippet?.thumbnails?.high;
    const aspectRatio = 16 / 9;

    return (
      <Pressable
        onPress={() =>
          navigation.navigate("VideoScreen", {
            item,
            thumb,
            aspectRatio,
            savedNotes: userNotes,
          })
        }
      >
        <View style={styles.thumbnailColumnContainer}>
          {thumb?.url && (
            <Image
              style={[styles.thumbnailColumn, { aspectRatio }]}
              source={{ uri: thumb.url }}
              contentFit="cover"
              transition={1000}
              cachePolicy="memory-disk"
            />
          )}
        </View>

        <View style={styles.textColumnContainer}>
          <Text
            style={{ color: theme.text, fontWeight: "bold" }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {(item as any)?.snippet?.title || item.note}
          </Text>
          <Text
            style={{ color: theme.text }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {(item as any)?.snippet?.channelTitle || "No Channel"}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenWrapper
      backgroundColor={theme.surface}
      statusBarStyle={theme.mode === "light" ? "dark-content" : "light-content"}
      edges={["top"]}
      padding={false}
    >
      <View
        style={[
          styles.rowSpaceBtw,
          { borderWidth: 0.4, borderColor: theme.border },
        ]}
      >
        <Text style={{ color: theme.primary, fontSize: 20, fontWeight: "800" }}>
          FocusOnTube
        </Text>
        <Feather
          onPress={() => navigation.navigate("SearchScreen")}
          name="search"
          size={24}
          color={theme.text}
        />
      </View>

      {userNotes.length > 0 ? (
        <FlatList
          data={userNotes}
          renderItem={renderItem}
          keyExtractor={(item,sa) => sa.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      ) : (
        <Text
          style={{
            color: theme.text,
            textAlign: "center",
            marginTop: 30,
            fontStyle: "italic",
          }}
        >
          No Notes found
        </Text>
      )}
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  rowSpaceBtw: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 20,
    padding: 20,
    borderRadius: 20,
  },
  thumbnailColumnContainer: {
    width: "100%",
  },
  thumbnailColumn: {
    width: "100%",
  },
  textColumnContainer: {
    width: "100%",
    justifyContent: "center",
    marginTop: 0,
    padding: 10,
  },
});
