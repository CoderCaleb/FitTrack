import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
//import firebase from 'firebase'
import { getDatabase, ref, set, get, onValue, update } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
export default function HomeScreen(props) {
  const auth = getAuth();
  const userInstance = ref(getDatabase(), `/users/${auth.currentUser.uid}`);
  const [completed, setCompleted] = useState(0);
  const [time, setTime] = useState(0);
  //const [data, setData] = useState({})
  let data = {};
  console.log(userInstance);

  useEffect(() => {
    console.log(data);

    onValue(userInstance, (snapshot) => {
      data = snapshot.val();
      setCompleted(data.completed);
      setTime(data.timeSpent);
    });
  }, []);
  function handleSignOut(){
    signOut(auth)
    .then((result) => {
      console.log(result)
    }).catch((err) => {
      console.log(err)
    });
    props.navigation.navigate('LoginScreen')
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: "90%" }}>
      <Image source={require('./assets/images/fittrack-logo.png')} style={styles.logoImage}></Image>
        <View style={styles.userInfoContainer}>
          <Image
            source={require("./assets/images/cat-pfp.jpeg")}
            style={styles.pfp}
          />
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.welcomeText}>Hello 👋</Text>
              <Text style={styles.nameText}>{auth.currentUser.displayName}</Text>
            </View>
            <TouchableOpacity style={styles.logOutButton} onPress={handleSignOut}>
              <Text style={styles.text}>Logout</Text>
            </TouchableOpacity>
          </View>
          
        </View>
        <View style={styles.workoutInfoContainer}>
          <View style={styles.infoBox}>
            <Image
              source={require("./assets/images/clockimg.png")}
              style={styles.iconImg}
            />
            <Text style={styles.numberText}>{time}</Text>
            <Text style={styles.infoType}>
              {time > 1
                ? "Minutes"
                : "Minute"}
            </Text>
          </View>
          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: "#87CBB9",
              },
            ]}
          >
            <Image
              source={require("./assets/images/thumbup.png")}
              style={[styles.iconImg, { width: 40, height: 40 }]}
              accessibilityLabel="img"
            />

            <Text style={styles.numberText}>{completed}</Text>
            <Text style={styles.infoType}>Completed</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.push("SelectScreen")}
        >
          <Text style={styles.text}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#010f2a",
  },
  userInfoContainer: {
    alignItems: "flex-start",
    marginTop: 20,
    gap: 20,
    flexDirection: "row",
  },
  nameText: {
    fontSize: 27,
    fontWeight: "bold",
    color: "white",
  },
  welcomeText: {
    color: "white",
    fontSize: 20,
    fontWeight: 500,
  },
  pfp: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignSelf: "center",
  },
  workoutInfoContainer: {
    width: "100%",
    height: 200,
    gap: 20,
    flexDirection: "row",
    marginTop: 30,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#D4ADFC",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImg: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  infoType: {
    color: "black",
    fontSize: 13,
  },
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#304ffd",
    borderRadius: 15,
    marginTop: 20,
  },
  numberText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },
  titleText:{
    color:'#576CBC',
    fontSize:40,
    fontWeight:500,
    marginTop:20,
  },
  headerContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    flex:1,
  },
  logOutButton:{
    backgroundColor:'#3E54AC',
    width:100,
    height:40,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:15
  },
  logoImage:{
    width:200,
    height:50,
  }
});
