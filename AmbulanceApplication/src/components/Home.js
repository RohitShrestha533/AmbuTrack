import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const Home = () => {
  const navigation = useNavigation();
  const [isSignUp, setIsSignUp] = useState(true);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [logpasswordVisible, setLogPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  function UserLoginHandel() {
    if (!role) {
      alert("Please select a role before signing in.");
      return;
    }
    if (!["user", "admin", "hospital", "driver"].includes(role)) {
      alert("Invalid role selected.");
      return;
    }
    const userData = {
      email: email,
      password,
      role,
    };

    axios
      .post("http://192.168.100.9:3000/userLogin", userData)
      .then((response) => {
        if (response.data.status === 200) {
          // Check for the correct status
          alert("Login successful");
          // Navigate to the main page (Home Screen or dashboard)
          navigation.navigate("Main");
        } else {
          alert(response.data.message); // Handle other messages if any
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          alert(error.response.data.message); // Show the error message
        } else {
          alert("Something went wrong");
        }
      });
  }

  function UserRegisterHandel() {
    const userData = {
      email: email,
      phone,
      password,
      confirmpassword,
    };
    axios
      .post("http://192.168.100.9:3000/userRegister", userData)
      .then((response) => {
        if (response.data.status === "ok") {
          alert("User created successfully");
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          alert(error.response.data.message); // Show the error message
        } else {
          alert("Something went wrong");
        }
      });
  }

  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <ImageBackground
        source={require("../../assets/AmbuTrackLogo.png")}
        style={styles.imageBackground}
      >
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setIsSignUp(false)}>
            <Text style={[styles.tabText, !isSignUp && styles.activeTab]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSignUp(true)}>
            <Text style={[styles.tabText, isSignUp && styles.activeTab]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {isSignUp ? (
          <>
            {/* Sign Up Form */}
            <TextInput
              style={styles.input}
              placeholder="Email*"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              value={phone}
              placeholder="Phone number 98********"
              keyboardType="phone-pad"
              onChangeText={setPhone}
            />

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password*"
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              {/* Add an icon here if needed */}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              value={confirmpassword}
              onChangeText={setConfirmpassword}
              placeholder="Confirm Password*"
              secureTextEntry={!confirmPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {/* Add an icon here if needed */}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => UserRegisterHandel()}
            >
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
            {/* Register for Hospital Navigation */}
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                navigation.navigate("RegisterHospital"); // Correctly navigate to RegisterHospital
              }}
            >
              <Text style={styles.register}>Register for Hospital</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Sign In Form */}
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email*"
            />

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password*"
              secureTextEntry={!logpasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setLogPasswordVisible(!logpasswordVisible)}
            ></TouchableOpacity>

            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Role" value="" />
              <Picker.Item label="User" value="user" />
              <Picker.Item label="Admin" value="admin" />
              <Picker.Item label="Hospital" value="hospital" />
              <Picker.Item label="Driver" value="driver" />
            </Picker>
            {/* Login Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => UserLoginHandel()}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            {/* Register for Hospital Navigation */}
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                navigation.navigate("RegisterHospital"); // Correctly navigate to RegisterHospital
              }}
            >
              <Text style={styles.register}>Register for Hospital</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageBackground: {
    height: 350,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: "#555",
  },
  register: {
    textDecorationLine: "underline",
    fontSize: 16,
    color: "blue",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#f00",
    color: "#f00",
  },
  formContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  picker: {
    width: "100%",
    marginBottom: 2,
    overflow: "hidden",
    marginTop: -10,
  },
  button: {
    backgroundColor: "#f00",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});

export default Home;
