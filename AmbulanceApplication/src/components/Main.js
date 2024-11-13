import { StyleSheet, Text, View } from "react-native";

export default function Main() {
  return (
    <View style={styles.container}>
      <Text>React native main </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
