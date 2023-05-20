import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { ref, push, getDatabase, set, update } from "firebase/database";
export default function LoginScreen(props) {
  const [isFocused, setIsFocused] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("none");
  const [emailError, setEmailError] = useState("none");
  const [nameError, setNameError] = useState("none");
  const [isClicked, setIsClicked] = useState(false);
  const [email, setEmail] = useState(null);
  useEffect(() => {
    filterPassword();
    filterEmail();
    filterName();
    setIsClicked(false);
  }, [password, email, username]);
  const auth = getAuth();
  const dbInstance = ref(getDatabase(), "/users");
  function handleSignup() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((creds) => {
        const user = creds.user;
        updateProfile(user,{
            displayName: username,
          })
          .then((result) => {
            console.log("Profile updated successfully");
            update(dbInstance, {
              [auth.currentUser.uid]: {
                completed: 0,
                name: user.displayName,
                timeSpent: 0,
              },
            });
          })
          .catch((err) => console.log(err))
       
        console.log("Login successful", user.displayName);
      })
      .catch((err) => console.log(err.message));
  }
  function filterPassword() {
    const hasNumber = /\d/;

    if (password.length == 0) {
      setError("Password cannot be empty");
    } else if (password.length <= 7 && password.length > 0) {
      setError("Password must be at least 8 characters long");
      return false;
    } else if (!hasNumber.test(password)) {
      setError("Password needs to have at least 1 number");
      return false;
    } else if (!/[a-zA-Z]/.test(password)) {
      setError("Password needs to have at least 1 letter");
      return false;
    } else {
      setError("none");
      return true;
    }
  }
  function filterEmail() {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailError("Please enter a valid email");
      return false;
    } else {
      setEmailError("none");
      console.log(emailError);
      return true;
    }
  }
  function filterName() {
    if (!username.length > 0) {
      setNameError("Please enter your name");
    } else {
      setNameError("none");
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.marginContainer}>
        <Text style={styles.title}>Sign Up</Text>

        <Text style={styles.subtitle}>Please sign up to continue</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput
            placeholder="Enter your name"
            style={
              isFocused == "username"
                ? [styles.inputBox, { borderColor: "#be1cce" }]
                : styles.inputBox
            }
            placeholderTextColor="#555555"
            onFocus={() => setIsFocused("username")}
            value={username}
            onChangeText={(value) => {
              setUsername(value);
            }}
          ></TextInput>
        </View>
        <Text
          style={[
            styles.inputTitle,
            {
              display: isClicked && nameError !== "none" ? "flex" : "none",
              color: "#b74a58",
            },
          ]}
        >
          {nameError}
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            style={
              isFocused == "email"
                ? [styles.inputBox, { borderColor: "#be1cce" }]
                : styles.inputBox
            }
            placeholderTextColor="#555555"
            onFocus={() => setIsFocused("email")}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
            }}
          ></TextInput>
        </View>
        <Text
          style={[
            styles.inputTitle,
            {
              display: isClicked && emailError !== "none" ? "flex" : "none",
              color: "#b74a58",
            },
          ]}
        >
          {emailError}
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Password</Text>
          <TextInput
            placeholder="Pick a strong password"
            style={
              isFocused == "password"
                ? [styles.inputBox, { borderColor: "#be1cce" }]
                : styles.inputBox
            }
            placeholderTextColor="#555555"
            secureTextEntry={true}
            onFocus={() => setIsFocused("password")}
            value={password}
            onChangeText={(value) => {
              setPassword(value);
            }}
          ></TextInput>
        </View>
        <Text
          style={[
            styles.inputTitle,
            {
              display: isClicked && error !== "none" ? "flex" : "none",
              color: "#b74a58",
            },
          ]}
        >
          {error}
        </Text>

        <TouchableOpacity
          style={styles.logInButton}
          onPress={() => {
            filterPassword() && filterEmail()
              ? handleSignup()
              : console.log(error);
            setIsClicked(true);
          }}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        <Text style={styles.bottomText}>
          Already have an account?{" "}
          <Text
            style={styles.secondaryText}
            onPress={() => props.navigation.navigate("LoginScreen")}
          >
            Login
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  inputBox: {
    borderWidth: 2,
    borderRadius: 8,
    width: "100%",
    height: 45,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#171717",
    borderColor: "#1d1d1d",
    color: "white",
  },
  marginContainer: {
    margin: 20,
  },
  container: {
    backgroundColor: "#101010",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    position: "relative",
  },
  title: {
    color: "white",
    fontSize: 38,
    fontWeight: 700,
  },
  subtitle: {
    color: "#6f6f6f",
    marginTop: 10,
    marginBottom: 20,
  },
  inputTitle: {
    color: "white",
  },
  inputContainer: {
    gap: 10,
  },
  logInButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 55,
    backgroundColor: "#be1cce",
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  image: {
    width: 200,
    height: 200,
  },
  bottomText: {
    color: "#878787",
    alignSelf: "center",
    marginTop: 15,
  },
  secondaryText: {
    fontWeight: "bold",
    color: "white",
  },
});
