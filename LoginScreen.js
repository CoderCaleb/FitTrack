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
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { update, ref, get, getDatabase } from "firebase/database";
import Toast from 'react-native-toast-message'
//import { initializeApp } from "firebase/app";

export default function LoginScreen(props) {
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [isFocused, setIsFocused] = useState("");
  const [wrong, setWrong] = useState(false);
  const [timePassed, setTimePassed] = useState(false);
  const userInfo = {
    password: "123",
    username: "Drippydino",
  };
  function checkInfo(password, username) {
    if (userInfo.password == password && userInfo.username == username) {
      return true;
    } else {
      return false;
    }
  }
  function handleLogin() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCreds) => {
        console.log("User logged in!");
        const user = userCreds.user;
        setWrong(false);
        Toast.show({
          type:'success',
          text1:'Successfully logged in!',
          text2:'Welcome back'
        })
        get(ref(getDatabase(), `/users/${user.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            if (streakBroken(Date.now(), parseInt(snapshot.val().lastLogin))) {
              props.navigation.navigate("StreakScreen",{streakStatus:'broken'});
              update(ref(getDatabase(), `/users/${user.uid}`), {
                dailyStreak: 0,
              })
                .catch((err) => console.log(err));
              console.log("Streak is broken");
            } else if (true) {
              checkCooldown(user).then(value=>{
                if(value){
                  update(ref(getDatabase(), `/users/${user.uid}`), {
                    dailyStreak: snapshot.val().dailyStreak + 1,
                    lastDaily: Date.now(),
                  })
                  .catch(err=>console.log(err))
                  props.navigation.navigate("StreakScreen",{streakStatus:'active'});
                  console.log("Streak is active");
                }
                else{
                  console.log('Not active')
                  props.navigation.navigate("HomeScreen");

                }
                
              })
             
            }
            update(ref(getDatabase(), `/users/${user.uid}`), {
              lastLogin: Date.now(),
            })
           .catch(err=>console.log(err))
          }
        });
      })
      .catch((err) => {
        console.log(err.message);
          Toast.show({
            type:'error',
            text1:'Login failed',
            text2:'Please check your password and username'
          })
        setWrong(true);
      });
  }
  function streakBroken(timeStamp1, timeStamp2) {
    //const dayInMillis = 24 * 60 * 60 * 1000;
    const dayInMillis = 86400000;
    return timeStamp1 - timeStamp2 >= dayInMillis ? true : false;
  }
  async function checkCooldown(user) {
    const cooldown = 86400000;
    const snapshot = await get(ref(getDatabase(), `/users/${user.uid}/lastDaily`))

      if (snapshot.exists()) {
        return Date.now() - snapshot.val() >= cooldown;
      }
    ;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.marginContainer}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.subtitle}>Please sign in to continue</Text>
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
            autoComplete="email"
          ></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            style={
              isFocused == "password"
                ? [styles.inputBox, { borderColor: "#be1cce" }]
                : styles.inputBox
            }
            placeholderTextColor="#555555"
            secureTextEntry={true}
            onChangeText={(value) => {
              setPassword(value);
            }}
            onFocus={() => setIsFocused("password")}
            value={password}
            autoComplete="password"
          ></TextInput>
        </View>
        <View
          style={
            wrong
              ? [styles.wrongPasswordContainer, { display: "flex" }]
              : styles.wrongPasswordContainer
          }
        >
          <Text style={styles.wrongPassword}>
            Incorrect username or password
          </Text>
        </View>
        <TouchableOpacity
          style={styles.logInButton}
          onPress={() => handleLogin()}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        <Text style={styles.bottomText}>
          Don't have a account?{" "}
          <Text
            style={styles.secondaryText}
            onPress={() => {
              props.navigation.navigate("SignUpScreen");
            }}
          >
            Sign Up
          </Text>
        </Text>
      </View>
      <Toast/>
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
  wrongPassword: {
    color: "#8e3743",
  },
  wrongPasswordContainer: {
    width: "100%",
    backgroundColor: "#fedbdf",
    justifyContent: "center",
    height: 50,
    borderRadius: 8,
    paddingLeft: 10,
    display: "none",
  },
});
