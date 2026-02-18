import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StatusBar,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";
import { useThemeColors, useTypedSelector } from "../../utills/ThemeStyles";
import * as ScreenOrientation from "expo-screen-orientation";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setUserNotes } from "../../redux/notesSlice";
import { SafeAreaView } from "react-native-safe-area-context";


const VideoScreen : React.FC = ({ route }:any) => {
  const userNotes = useTypedSelector((state) => state.notes.notes);
  const dispatch = useDispatch();
  const item = route.params;
  const existingNote = userNotes?.find(
    (storedNotes) => storedNotes?.item?.id?.videoId == item?.item?.id?.videoId
  );
  const videoId = item?.item?.id?.videoId;
  const theme = useThemeColors();
  const playerRef = useRef<YoutubeIframeRef>(null);
  const [notes, setNotes] = useState<any>(
    item.savedNotes || existingNote?.notes || []
  );
  const [noteText, setNoteText] = useState<string>("");
  const [_, forceUpdate] = useState<boolean>(false); // To force re-render manually
  const keyboardVisibleRef = useRef<boolean>(false);
  const screenWidth = Dimensions.get("window").width;
  const videoHeight = (screenWidth * 9) / 16;

  const onFullScreenChange = async (isFullScreen:boolean) => {
    if (isFullScreen) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    }
  };

  const handleAddNote = async () => {
    try {
      if (noteText.trim() !== "") {
        const newNote = { id: Date.now(), text: noteText.trim() };
        setNotes([...notes, newNote]);
        setNoteText("");
        const NewNote = { ...item, notes: [...notes, newNote] };
        if (userNotes && userNotes.length > 0) {
          if (!existingNote) {
            await AsyncStorage.setItem(
              "videoNotes",
              JSON.stringify([...userNotes, NewNote])
            );
            dispatch(setUserNotes([...userNotes, NewNote]));
          } else {

            const newData = userNotes.map((note) => {
              return note.item.id.videoId == item.item.id.videoId
                ? { ...note, notes: [...note.notes, newNote] }
                : note;
            });

            await AsyncStorage.setItem("videoNotes", JSON.stringify(newData));
            dispatch(setUserNotes(newData));
          }
        } else {
          await AsyncStorage.setItem("videoNotes", JSON.stringify([NewNote]));
          dispatch(setUserNotes([NewNote]));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  // AsyncStorage.removeItem('videoNotes')
  const getCurrentTimestamp = async () => {
    if (playerRef.current) {
      try {
        const time = await playerRef.current.getCurrentTime();
        const formattedTime = new Date(time * 1000).toISOString().substr(11, 8);
        setNoteText((prevText) => prevText + " " + formattedTime + " ");
      } catch (e) {
        console.warn("Could not get current time", e);
      }
    }
  };

  const TIMESTAMP_REGEX = /\b(\d{2}:\d{2}:\d{2})\b/g;

  function parseNoteText(text:string) {
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = TIMESTAMP_REGEX.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          text: text.slice(lastIndex, match.index),
          isTimestamp: false,
        });
      }
      parts.push({
        text: match[1],
        isTimestamp: true,
        timestampValue: match[1],
      });
      lastIndex = match.index + match[1].length;
    }
    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), isTimestamp: false });
    }
    return parts;
  }

  function timestampToSeconds(ts:string) {
    const [h, m, s] = ts.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  }

  const handleTimestampPress = async (timestamp:string) => {
    if (playerRef.current) {
      const seconds = timestampToSeconds(timestamp);
      playerRef.current.seekTo(seconds, true);
    }
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      keyboardVisibleRef.current = true;
      forceUpdate((v) => !v); // manually re-render
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      keyboardVisibleRef.current = false;
      forceUpdate((v) => !v); // manually re-render
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.surface }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: theme.black, height: videoHeight }}>
            {videoId ? (
              <YoutubePlayer
                ref={playerRef}
                height={videoHeight}
                width={screenWidth}
                play={true}
                videoId={videoId}
                onFullScreenChange={onFullScreenChange}
              />
            ) : (
              <Text style={{ color: theme.text, padding: 16 }}>
                No Video ID Found
              </Text>
            )}
          </View>

          <View style={[styles.infoContainer, {}]}>
            <Text
              style={[styles.title, { color: theme.text }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.item.snippet.title}
            </Text>
            <Text
              style={[
                styles.channel,
                {
                  color: theme.text,
                  backgroundColor: theme.border,
                },
              ]}
            >
              {item.item.snippet.channelTitle}
            </Text>
          </View>

          {/* Notes Section */}
          {!keyboardVisibleRef.current && (
            <View style={{ flex: 1 }}>
              <Text style={[styles.notesTitle, { color: theme.primary }]}>
                Notes
              </Text>
              <FlatList
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingBottom: 90,
                  paddingHorizontal: 10,
                }}
                data={notes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => {
                  const parsed = parseNoteText(item.text);
                  return (
                    <View
                      style={[
                        styles.noteContainer,
                        { backgroundColor: theme.background },
                      ]}
                    >
                      <Text style={[styles.noteText, { color: theme.text }]}>
                        {index + 1}.{" "}
                        {parsed.map((part:any, i) =>
                          part.isTimestamp ? (
                            <Text
                              key={i}
                              style={styles.timestampText}
                              onPress={() =>
                                handleTimestampPress(part?.timestampValue)
                              }
                            >
                              {part.text}
                            </Text>
                          ) : (
                            <Text key={i}>{part.text}</Text>
                          )
                        )}
                      </Text>
                      <TouchableOpacity
                        onPress={async () => {
                          const newData = notes.filter(
                            (note:{id:string,note:string}) => note.id !== item.id
                          );
                          setNotes(newData);
                          const userNotes2 = userNotes.map(
                            (item:any) =>
                              item.item.id.videoId ==
                              existingNote.item.id.videoId ? {...item,notes: newData} : item
                          );
                          
                          dispatch(setUserNotes(userNotes2));
                          await AsyncStorage.setItem(
                            "videoNotes",
                            JSON.stringify(userNotes2)
                          );
                        }}
                        style={styles.deleteButton}
                      >
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color={theme.text}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }}
                ListEmptyComponent={
                  <Text style={[styles.emptyNotes, { color: theme.text }]}>
                    No notes yet. Add your first note!
                  </Text>
                }
              />
            </View>
          )}
        </View>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.surface,
            },
          ]}
        >
          <TouchableOpacity
            onPress={getCurrentTimestamp}
            style={styles.timestampButton}
          >
            <Ionicons name="timer-outline" size={24} color={theme.text} />
          </TouchableOpacity>
          <TextInput
            multiline
            onChangeText={setNoteText}
            value={noteText}
            placeholder="Add a note..."
            placeholderTextColor={theme.text}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
          />
          <TouchableOpacity
            onPress={handleAddNote}
            style={styles.addButton}
            disabled={noteText.trim() === ""}
          >
            <AntDesign
              name="plus-circle"
              size={24}
              color={ theme.text}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <StatusBar
        barStyle={theme.mode === "light" ? "dark-content" : "light-content"}
      />
    </SafeAreaView>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  infoContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  channel: {
    fontSize: 14,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    overflow: "hidden",
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  noteContainer: {
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    alignItems: "center",
  },
  noteText: {
    fontWeight: "600",
    flex: 1,
    flexWrap: "wrap",
    width: "90%",
  },
  timestampText: {
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
  deleteButton: {
    padding: 5,
    marginLeft: 10,
  },
  emptyNotes: {
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    fontSize: 16,
  },
  timestampButton: {
    marginRight: 10,
  },
  addButton: {
    marginLeft: 10,
  },
});
