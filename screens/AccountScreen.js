import React, { useState, useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { commonStyles, lightStyles } from "../styles/commonStyles";
import axios from "axios";
import { API, API_WHOAMI } from "../constants/API";
import { useSelector } from "react-redux";

export default function AccountScreen({ navigation }) {
  const token = useSelector((state) => state.auth.token);
  const [username, setUsername] = useState(null);
  const styles = { ...commonStyles, ...lightStyles };

  async function getUsername() {
    console.log("---- Getting user name ----");
    console.log(`Token is ${token}`);
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got user name!");
      setUsername(response.data.username);
    } catch (error) {
      console.log("Error getting user name");
      if (error.response) {
        console.log(error.response.data);
        if (error.response.data.status_code === 401) {
          signOut();
          navigation.navigate("SignInSignUp");
        }
      } else {
        console.log(error);
      }
      // We should probably go back to the login screen???
    }
  }

  function signOut() {
    navigation.navigate("SignInSignUp");
  }

  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      setUsername(<ActivityIndicator />);
      getUsername();
    });
    getUsername();
    return removeListener;
  }, []);

  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      <Text style={{ marginTop: 20 }}>Account Screen</Text>
      <Text>{username}</Text>
    </View>
  );
}
