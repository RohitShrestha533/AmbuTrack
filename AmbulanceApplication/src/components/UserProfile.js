import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
} from "react-native";

// Define the DetailsScreen component
const DetailsScreen = ({ route, navigation }) => {
  useEffect(() => {
    navigation.setOptions({ title: route.params.name });
  }, [navigation, route.params.name]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Details for {route.params.name}</Text>
    </View>
  );
};

// Simulated logged-in user's name
const loggedInUserName = "Rohit Shrestha";

// Data for SectionList
const SectionlistToDisplay = [
  {
    title: "Profile",
    data: [
      { name: "Account" },
      { name: "History" },
      { name: "Rewards" },
      { name: "Policies" },
      { name: "Languages" },
      { name: "Log Out" },
    ],
  },
];

// Update the Item component to navigate based on item name
const Item = ({ name, navigation }) => {
  const handlePress = () => {
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
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
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

// Sample LoginScreen Component (for demo)
const LoginScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Please log in again</Text>
    </View>
  );
};

export default UserProfile;
