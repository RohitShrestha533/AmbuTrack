import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";

const AccountUpdate = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Fetch user details
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://192.168.100.9:3000/UserData", {
          withCredentials: true,
        });
        const data = response.data.user;

        setUserData(data);
        setFullname(data.fullname || "");
        setEmail(data.email || "");
        setDob(data.Dob || "");
        setGender(data.gender || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const UpdateUser = async () => {
    if (!fullname || !email || !gender || !dob) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await axios.put(
        "http://192.168.100.9:3000/UpdateUser",
        { fullname, email, gender, dob },
        { withCredentials: true }
      );
      if (response.data.success) {
        Alert.alert("Success", "User details updated successfully!");
        navigation.navigate("Account");
      } else {
        Alert.alert("Error", "Failed to update user details");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while updating data");
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setDob(formattedDate);
    hideDatePicker();
  };
  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon name={"person"} size={50} color="white" />
          </View>
          <Text style={styles.profileTitle}>{fullname || "pofiel"}</Text>
        </View>

        {/* User Details */}
        <View style={styles.row}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullname}
            onChangeText={setFullname}
            placeholder="Enter your full name"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Enter your email"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity onPress={showDatePicker} style={{ zIndex: 2 }}>
            <TextInput
              style={[styles.input, { zIndex: 1 }]}
              editable={false}
              pointerEvents="box-none"
              value={dob}
              placeholder="Select your date of birth"
            />
          </TouchableOpacity>
        </View>

        {/* Gender Radio Buttons */}
        <View style={styles.row}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radioButton, gender === "male" && styles.selected]}
              onPress={() => handleGenderChange("male")}
            >
              <View
                style={[
                  styles.radioCircle,
                  gender === "male" && styles.selectedCircle,
                ]}
              />
              <Text style={styles.radioText}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioButton,
                gender === "female" && styles.selected,
              ]}
              onPress={() => handleGenderChange("female")}
            >
              <View
                style={[
                  styles.radioCircle,
                  gender === "female" && styles.selectedCircle,
                ]}
              />
              <Text style={styles.radioText}>Female</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioButton,
                gender === "other" && styles.selected,
              ]}
              onPress={() => handleGenderChange("other")}
            >
              <View
                style={[
                  styles.radioCircle,
                  gender === "other" && styles.selectedCircle,
                ]}
              />
              <Text style={styles.radioText}>Other</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Date Picker */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.btn} onPress={UpdateUser}>
          <Text style={styles.saveButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#D3D3D3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3D3838",
  },
  row: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#978E8E",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#A8A5A5",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "#3D3838",
  },
  btn: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#A8A5A5",
    marginRight: 10,
  },
  selectedCircle: {
    backgroundColor: "red",
    borderColor: "red",
  },
  radioText: {
    fontSize: 16,
    color: "#3D3838",
  },
});

export default AccountUpdate;
