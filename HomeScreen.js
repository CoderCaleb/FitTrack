import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  ImageBackground,
  Modal,
  TextInput,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
//import firebase from 'firebase'
import { getDatabase, ref, set, get, onValue, update } from "firebase/database";
import Toast from 'react-native-toast-message'
import {
  getAuth,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { workouts } from "./WorkoutData";
const ButtonContext = React.createContext();

export default function HomeScreen(props) {
  let auth = getAuth();
  const userInstance = ref(getDatabase(), `/users/${auth.currentUser.uid}`);
  const [completed, setCompleted] = useState(0);
  const [time, setTime] = useState(0);
  //const [data, setData] = useState({})
  const [selected, setSelected] = useState("arms");
  const [buttonClick, setButtonClick] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [modalVisable, setModalVisable] = useState(false);
  const [fetchedPfp, setFetchedPfp] = useState("");
  const keys = Object.keys(workouts[0]);

  useEffect(() => {
    console.log(auth);

    onValue(userInstance, (snapshot) => {
      const data = snapshot.val();
      setCompleted(data.completed);
      setTime(data.timeSpent);
    });
    
  }, []);
  useEffect(()=>{
    if(props.route.params.showToast){
      Toast.show({
        type:'success',
        text1:'Login successful!',
        text2:'Welcome back'
      })
    }
   
  },[props.route.params.showToast])
  function handleSignOut() {
    signOut(auth)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
    props.route.params.setLogin(false)
    props.navigation.navigate("LoginScreen");
  }
  function calculateTime(data) {
    let totalTime = [];
    let finalResult = 0;
    for (let i = 0; i < workouts[0][data].length; i++) {
      totalTime.push(
        (workouts[0][data][i].interval * workouts[0][data][i].reps) / 1000
      );
      finalResult = totalTime.reduce((total, num) => {
        return total + num;
      });
    }
    return finalResult;
  }
  onAuthStateChanged(auth, (user) => {
    if(user){
      setFetchedPfp(user.photoURL);
    }
  });
  return (
    <ScrollView
      onScrollBeginDrag={() => setIsScrolling(true)}
      onScrollEndDrag={() => setIsScrolling(false)}
    >
      <SafeAreaView style={styles.container}>
        <Modal visible={modalVisable} transparent={true} animationType="slide">
          <View
            style={{ alignItems: "center", flex: 1, justifyContent: "center" }}
          >
            <View
              style={{
                width: "80%",
                backgroundColor: "#292929",
                paddingLeft: 20,
                borderRadius: 10,
                gap: 10,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: "#343038",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.titleInputText}>
                  Add new profile picture
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisable(false);
                    console.log("cross clicked");
                  }}
                  style={{ width: 20, height: 20, marginRight: 20 }}
                >
                  <Image
                    source={require("./assets/images/cross-white.png")}
                    style={{ width: "100%", height: "100%" }}
                  ></Image>
                </TouchableOpacity>
              </View>
              <TextInput
                placeholder="https://example.com/placeholder-image.jpg"
                style={styles.inputBox}
                onChangeText={(value) => setProfilePic(value)}
              ></TextInput>
              <TouchableOpacity
                style={styles.pfpDoneButton}
                onPress={() => {
                  if(/^https:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}(?:\/[^\s]*)+\.(?:jpg|jpeg|png|gif|bmp)$/.test(profilePic)
                  ){
                    updateProfile(auth.currentUser, {
                      photoURL:
                        profilePic
                    }).then((result) => {
                      setModalVisable(false);
                      Toast.show({
                        type:'success',
                        text1:'Success! 👍 ',
                        text2:'Pfp updated successfully'
                      })
                    });
                  }
                  else{
                    Toast.show({
                      type:'error',
                      text1: 'Image link not valid 😔',
                      text2: 'Try again'
                    })
                  }             
                }}
              >
                <Text style={styles.text}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={{ width: "90%" }}>
          <View style={styles.userInfoContainer}>
            <TouchableOpacity
              onPress={() => {
                setModalVisable(true);
                console.log("pfp clicked");
              }}
            >
              <Image source={{ uri: fetchedPfp }} style={styles.pfp} />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
              <View>
                <Text style={styles.welcomeText}>Hello 👋</Text>
                <Text style={styles.nameText}>
                  {auth.currentUser.displayName}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.logOutButton}
                onPress={handleSignOut}
              >
                <Text style={styles.text}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.workoutInfoContainer}>
            <View style={styles.infoBox}>
              <Image
                source={require("./assets/images/clock-emoji.png")}
                style={styles.iconImg}
              />
              <Text style={styles.numberText}>{time}</Text>
              <Text style={styles.infoType}>
                {time > 1 ? "Minutes" : "Minute"}
              </Text>
            </View>
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: "#17191a",
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
        </View>
        <View style={styles.workoutContainer}>
          <Text style={styles.subText}>What's on your mind</Text>
          <ButtonContext.Provider
            value={{ buttonClick, setButtonClick, setSelected }}
          >
            {keys.map((value, index) => {
              return (
                <WorkoutBox
                  infoType={value}
                  infoTime={Math.round(calculateTime(value) / 60)}
                  infoSections={workouts[0][value].length}
                  bgImage={workouts[0][value][0]["bgImage"]}
                  setSelected={setSelected}
                  isScrolling={isScrolling}
                  push={props.navigation.push}
                />
              );
            })}
          </ButtonContext.Provider>
        </View>
        <Toast/>
      </SafeAreaView>
    </ScrollView>
  );
}

function WorkoutBox(props) {
  const { setButtonClick, buttonClick, setSelected } =
    useContext(ButtonContext);
  const [refreshFlag, setRefreshFlag] = useState(false);

  return (
    <TouchableOpacity
      style={styles.workoutChoice}
      onPress={() => {
        setRefreshFlag(!refreshFlag);
        if (!props.isScrolling) {
          props.push("WorkoutScreen", {
            data: props.infoType,
            navigateFrom: "HomeScreen",
            refreshFlag: refreshFlag,
          });
          console.log(props.infoType);
        }
      }}
    >
      <ImageBackground
        style={styles.imgBg}
        source={props.bgImage}
        imageStyle={{ borderRadius: 10 }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 10,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.2)",
            padding: 15,
            gap: 5,
          }}
        >
          <Text style={styles.infoText}>
            {props.infoType.charAt(0).toUpperCase() + props.infoType.slice(1)}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={styles.textTime}>{props.infoTime + " minutes"}</Text>
            <Text style={styles.textTime}>
              {props.infoSections + " workouts"}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },

  inputBox: {
    borderWidth: 2,
    borderRadius: 8,
    width: "80%",
    height: 45,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#171717",
    borderColor: "#1d1d1d",
    color: "white",
  },
  subText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    width: "90%",
    alignSelf: "center",
  },
  titleInputText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  textTime: {
    color: "white",
    fontSize: 15,
  },
  imgBg: {
    flex: 1,
    width: "100%",
  },
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#0f0f0f",
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
    backgroundColor: "#17191a",
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
    color: "#474a4b",
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
    color: "white",
  },
  titleText: {
    color: "#576CBC",
    fontSize: 40,
    fontWeight: 500,
    marginTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  logOutButton: {
    backgroundColor: "#52afaa",
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  logoImage: {
    width: 200,
    height: 50,
  },
  workoutChoice: {
    width: "90%",
    height: 150,
    backgroundColor: "#1b2841",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  titleText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: "10%",
    marginTop: 30,
  },
  imageIcon: {
    width: "50%",
    height: "50%",
  },
  infoText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
  },
  doneButton: {
    backgroundColor: "#304ffd",
    width: 70,
    height: 70,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    right: 20,
  },
  pfpDoneButton: {
    backgroundColor: "#bb85fc",
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  buttonImg: {
    width: "80%",
    height: "80%",
  },
  workoutContainer: {
    justifyContent: "center",
    gap: 20,
    width: "100%",
    marginTop: 20,
  },
  titleText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: "10%",
    marginTop: 30,
  },
});
