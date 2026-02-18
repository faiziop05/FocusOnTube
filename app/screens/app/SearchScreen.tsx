import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../../components/AllComponents/ScreenWrapper";
import { useThemeColors } from "../../utills/ThemeStyles";
import { useDispatch } from "react-redux";
import { Header } from "../../components";
import axios from "axios";
import Constants from "expo-constants";
import { Image } from "expo-image";
const youTubeApiKey = Constants.expoConfig?.extra?.youTubeApiKey;

const SearchScreen:React.FC<{navigation:any}>  = ({ navigation }) => {
  const dispatch = useDispatch();
  const theme = useThemeColors();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchData, setSearchData] = useState<any[]>([]);
  const [searchWordData, setSearchWordData] = useState<any[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string|null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const uniqueSearchWordData = [];
  const seen = new Set();
  for (const item of searchWordData) {
    const key = item.id?.videoId;
    if (key && !seen.has(key)) {
      uniqueSearchWordData.push(item);
      seen.add(key);
    }
  }

  const handleWordSearch = async (query:string, pageToken : string | null) : Promise<void> => {
    setSearchData([]);
    setSearchQuery(query);
    if (!query) {
      console.warn("Search query is empty");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            q: query,
            type: "video",
            maxResults: 20,
            key: youTubeApiKey,
            pageToken: pageToken || undefined,
          },
        }
      );
      if (pageToken) {
        setSearchWordData((prev) => [...prev, ...res.data.items]);
      } else {
        setSearchWordData(res.data.items);
      }
      setNextPageToken(res.data.nextPageToken || null);
    } catch (error:unknown) {
      if(error instanceof Error){
        console.error(
          "YouTube Search Error:",
          error.message
        );
      }
    }
    setLoading(false);
  };

  const handleSearch = async (query:string) : Promise<void> =>  {
    try {
      setSearchQuery(query);
      const res = await axios.get(
        "https://suggestqueries.google.com/complete/search",
        {
          params: {
            client: "youtube",
            ds: "yt",
            q: query,
          },
          responseType: "text",
        }
      );
      const match = res.data.match(/window\.google\.ac\.h\((.*)\)/);
      if (match && match[1]) {
        const parsed = JSON.parse(match[1]);
        const suggestions = parsed[1].map((item:any) => item[0]);
        setSearchData(suggestions);
      } else {
        console.error("Failed to parse suggestions");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const renderItem = ({ item }:any) => {
    const thumb = item.snippet.thumbnails.high;
    const aspectRatio = 16 / 9;

    return (
      <Pressable
        onPress={() => {
          navigation.navigate("VideoScreen", {
            item: item,
            thumb: thumb,
            aspectRatio: aspectRatio,
          });
        }}
      >
        <View style={[styles.thumbnailColumnContainer, {aspectRatio:aspectRatio}]}>
          <Image
            style={styles.thumbnailColumn}
            source={{ uri: thumb?.url }}
            contentFit="cover"
            transition={1000}
            cachePolicy="memory-disk"
          />
        </View>
        <View style={styles.textColumnContainer}>
          <Text
            style={{ color: theme.text, fontWeight: "bold" }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.snippet.title}
          </Text>
          <Text
            style={{ color: theme.text }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.snippet.channelTitle}
          </Text>
        </View>
      </Pressable>
    );
  };

  const handleLoadMore = () => {
    if (nextPageToken && !loading) {
      handleWordSearch(searchQuery, nextPageToken);
    }
  };

  return (
    <ScreenWrapper
      backgroundColor={theme.surface}
      statusBarStyle={"dark-content"}
      edges={["top"]}
      padding={false}
    >
      <Header
        onCrossPress={() => {
          setSearchQuery("");
          setSearchData([]);
        }}
        navigation={navigation}
        value={searchQuery}
        onChangeText={(text) => handleSearch(text)}
      />
      <ScrollView>
        {searchData.length > 0 &&
          searchData.map((item, index) => (
            <TouchableOpacity
              onPress={() => handleWordSearch(String(item),null)}
              key={index}
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              }}
            >
              <Text style={{ color: theme.text }}>{String(item)}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
      {!searchData.length  && 
      <FlatList
      data={uniqueSearchWordData}
      renderItem={renderItem}
      keyExtractor={(item, idx) =>
         idx.toString()
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator color={theme.primary} size={'large'} style={{marginTop:30}}/> : null}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      />
    }
      <View style={{ height: 200 }} />
    </ScreenWrapper>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  thumbnailColumnContainer: {
    width: "100%",
  },
  thumbnailColumn: {
    width: "100%",
    aspectRatio:16/9
  },
  textColumnContainer: {
    width: "100%",
    justifyContent: "center",
    marginTop: 0,
    padding: 10,
  },
});
