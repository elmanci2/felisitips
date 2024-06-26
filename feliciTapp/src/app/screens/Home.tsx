import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  CustomAnimateLottieIcon,
  CustomInfoModal,
  CustomScreen,
  SwipedImage,
} from "../components";
import { ThemeType } from "../types/types";
import constants from "expo-constants";

import { useDispatch, useSelector } from "react-redux";
import { BottomIcons } from "./util/BottomIcons";
import { addFavoritePhrase } from "../redux/FavoritePhraseSlice";
import Toast from "react-native-toast-message";

//  icons
import { Feather } from "@expo/vector-icons";
import { useLocalNotifications } from "../hook";

export const Home = ({ route, navigation }: any) => {
  const {
    changeTheme: { randomPhrase },
  } = useSelector((state: any) => state);
  const { theme, userName }: ThemeType = route?.params;
  const { backgroundImage } = useSelector((state: any) => state.changeTheme);
  const iconColor = theme.colors.btn_icon;

  const [opeTopMenu, setOpeTopMenu] = useState(false);

  useLocalNotifications();
  const disPatcher = useDispatch();

  const captureScreen = () => {
    navigation.navigate("ShareScreen");
  };

  const handleFavorite = () => {
    try {
      disPatcher(addFavoritePhrase(randomPhrase));

      Toast.show({
        type: "success",
        text2: "Agregado a favoritos",
      });
    } catch (error) {}
  };

  return (
    <CustomScreen theme={theme}>
      <ImageBackground source={{ uri: backgroundImage }} style={styles.body}>
        <View style={styles.heder}>
          <TouchableOpacity
            onPress={() => setOpeTopMenu((prev) => !prev)}
            style={[
              {
                backgroundColor: theme.colors.btn,
                padding: 5,
                borderRadius: 10,
              },
            ]}
          >
            <Feather name="user" size={20} color={"#ffffff"} />
          </TouchableOpacity>

          {opeTopMenu && (
            <View style={{ position: "absolute", marginTop: 40, zIndex: 2 }}>
              <CustomInfoModal />
            </View>
          )}

          <Text
            style={[
              styles.name,
              {
                backgroundColor: theme.colors.btn,
                color: theme.colors.btn_icon,
              },
            ]}
          >
            {"Hola " + userName + " !"}
          </Text>
        </View>

        <View style={styles.phraseContainer}>
          <Text
            style={[
              styles.textPhrase,
              { fontFamily: theme.defaultFont, paddingHorizontal: 3 },
            ]}
          >{`${"hola"} ${userName}, hoy recuerda que... \n`}</Text>
          <Text
            style={[styles.textPhrase, { fontFamily: theme.defaultFont }]}
          >{`${randomPhrase?.phrase}`}</Text>

          <Text
            style={[
              styles.textPhrase,
              { fontFamily: theme.defaultFont, marginTop: 10 },
            ]}
          >{`- ${randomPhrase?.by} -`}</Text>
        </View>

        <View>
          <SwipedImage />
        </View>

        <View style={styles.bottom}>
          <View
            style={[
              styles.itemsThemes,
              { justifyContent: "space-around", marginBottom: 90 },
            ]}
          >
            {BottomIcons(
              navigation,
              theme,
              handleFavorite,
              captureScreen
            ).bloque_2.map((item, index) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.bottomIcon,
                    { backgroundColor: theme.colors.btn, padding: 10 },
                  ]}
                  key={index}
                  onPress={item.action}
                >
                  {item.icon}
                </TouchableOpacity>
              );
            })}
          </View>

          <CustomAnimateLottieIcon />
          <View style={styles.itemsThemes}>
            {BottomIcons(navigation, theme).bloque_1.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={item.action}
                  key={index}
                  style={[
                    styles.bottomIcon,
                    { backgroundColor: theme.colors.btn },
                  ]}
                >
                  {item?.icon}
                  <Text style={[{ color: iconColor }]}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ImageBackground>
    </CustomScreen>
  );
};

const styles = StyleSheet.create({
  textRemember: { color: "red", fontWeight: "500" },
  body: { height: "100%", width: "100%", justifyContent: "space-between" },
  name: {
    fontWeight: "600",
    fontSize: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  heder: {
    flexDirection: "row",
    margin: constants.statusBarHeight + 10,
    gap: 17,
  },
  bottom: {
    width: "100%",
    marginBottom: 30,
    justifyContent: "center",
  },
  bottomIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  itemsThemes: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 26,
    justifyContent: "space-between",
  },
  viewShot: {
    width: "100%",
    height: "100%",
  },

  textPhrase: {
    textAlign: "center",
    color: "rgb(255, 255, 255)",
    fontSize: 20,
  },

  phraseContainer: {
    backgroundColor: "rgba(10, 10, 10, 0.33)",
    width: "97%",
    alignSelf: "center",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
});
