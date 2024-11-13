import React from "react";
import { StatusBar } from "expo-status-bar";
import UserProfile from "./src/components/UserProfile";
import Account from "./src/components/Account";
import History from "./src/components/History";
import Test from "./src/components/Test";
import Main from "./src/components/Main";
import Home from "./src/components/Home";
import RegisterHospital from "./src/components/RegisterHospital";
import Policies from "./src/components/Policies";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Test" component={Test} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Policies" component={Policies} />
        <Stack.Screen name="RegisterHospital" component={RegisterHospital} />
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
