import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changePhrase,
  changeThemeBackgroundImage,
} from "../../../redux/changeThemeSlice";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import moment from "moment";
import { removeFavoritePhrase } from "../../../redux/FavoritePhraseSlice";

export const ThemesLove = ({ navigation }: any) => {
  const {
    changeTheme: { backgroundImage },
    FavoritePhrases: { Phrases },
  } = useSelector((state: any) => state);

  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const dispatch = useDispatch();

  const action = (item: any) => {
    dispatch(changePhrase(item));
    navigation.goBack();
  };

  const deletePhrase = (id: number) => {
    dispatch(removeFavoritePhrase(id));
  };

  const share = () => {
    return navigation.navigate("ShareScreen");
  };

  return (
    <View>
      {Phrases.length < 1 ? (
        <View style={styles.lottieAnimationStyle}>
          <LottieView
            source={require("../../../animations/notFile.json")}
            style={{
              width: SCREEN_WIDTH * 0.9,
              height: SCREEN_WIDTH * 0.9,
            }}
            autoPlay
            loop
          />

          <Text style={styles.textNot}>No has agregado nada a favoritos</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ gap: 15, paddingBottom: 100 }}
          data={Phrases}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => {
            const date = moment(JSON.parse(item.date)).format(
              "MMMM Do YYYY, h:mm:ss a"
            );

            return (
              <TouchableOpacity
                onPress={() => action(item)}
                key={index}
                style={styles.itemContainer}
              >
                <View style={styles.img}>
                  <Text style={styles.text} numberOfLines={3}>
                    {item?.phrase}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>{String(date)}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity onPress={() => deletePhrase(item.id)}>
                        <AntDesign name="heart" size={18} color="black" />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={share}>
                        <Ionicons
                          name="share-outline"
                          size={18}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    width: "95%",
    justifyContent: "center",
    alignSelf: "center",
    gap: 30,
    paddingVertical: 24,
  },

  itemContainer: {
    borderRadius: 7,
    borderWidth: 0.5,
    backgroundColor: "rgba(95, 95, 95, 0.07)",
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  text: {
    color: "black",
    fontWeight: "500",
    fontSize: 15,
    textAlign: "center",
  },
  textNot: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 20,
  },
  lottieAnimationStyle: {
    marginTop: 10,
  },
});
