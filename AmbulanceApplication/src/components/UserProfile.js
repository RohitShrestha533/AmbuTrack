import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const loggedInUserName = "Rohit Shrestha";

const SectionlistToDisplay = [
  {
    title: "Profile",
    data: [
      { name: "Account" },
      { name: "History" },
      { name: "Policies" },
      { name: "Log Out" },
    ],
  },
];

const Item = ({ name, navigation }) => {
  const handlePress = async () => {
    switch (name) {
      case "Account":
        navigation.navigate("Account");
        break;
      case "History":
        navigation.navigate("History");
        break;
      case "Policies":
        navigation.navigate("Policies");
        break;
      case "Log Out":
        alert("You have been logged out!");

        try {
          await axios.post("http://192.168.100.9:3000/userLogout");

          await AsyncStorage.removeItem("userToken");
          navigation.replace("Login");
        } catch (error) {
          console.error("Error during logout: ", error);
          alert("Logout failed. Please try again.");
        }
        break;
      default:
        navigation.navigate("Details", { name });
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={profileStyle.innerContainer}>
        <Text style={profileStyle.itemText}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const UserProfile = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({ title: loggedInUserName });
  }, [navigation]);

  const renderItem = ({ item }) => (
    <Item name={item.name} navigation={navigation} />
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={profileStyle.sectionHeader}>{title}</Text>
  );

  return (
    <View style={profileStyle.container}>
      <SectionList
        keyExtractor={(item, index) => item + index}
        sections={SectionlistToDisplay}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListFooterComponent={Footer}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
};

const profileStyle = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
  },
  sectionHeader: {
    backgroundColor: "#fbdabb",
    color: "#333333",
    fontSize: 34,
    textAlign: "right",
    paddingHorizontal: 20,
  },
  itemText: {
    color: "#F4CE14",
    fontSize: 32,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: "#EDEFEE",
  },
  footerText: {
    color: "#000000",
    fontSize: 20,
    textAlign: "center",
  },
});
const Footer = () => (
  <Text style={profileStyle.footerText}>
    All Rights Reserved by AmbuTrack 2024
  </Text>
);

const Separator = () => <View style={profileStyle.separator} />;

export default UserProfile;
