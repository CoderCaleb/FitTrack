import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Vibration
} from "react-native";
import React, { useEffect, useState } from "react";

export default function SelectScreen({ navigation,route }) {
  const [selected, setSelected] = useState("arms");
  useEffect(()=>{
    route.params.getData(selected)
  },[selected])
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.workoutContainer}>
        <WorkoutBox
          url={require("./assets/images/arms-flex.png")}
          infoType="Arms"
          infoTime="10 mins"
          id="arms"
          selected={selected}
          setSelected={setSelected}
        />
        <WorkoutBox
          url={require("./assets/images/bench-press.png")}
          infoType="Chest"
          infoTime="10 mins"
          id="chest"
          selected={selected}
          setSelected={setSelected}
        />
        <WorkoutBox
          url={require("./assets/images/abs-workout-icon.png")}
          infoType="Abs"
          infoTime="10 mins"
          id="abs"
          selected={selected}
          setSelected={setSelected}
        />
        <WorkoutBox
          url={require("./assets/images/leg-workout-icon.png")}
          infoType="Legs"
          infoTime="10 mins"
          id="legs"
          selected={selected}
          setSelected={setSelected}
        />
      </View>
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => {navigation.push("WorkoutScreen");Vibration.vibrate(100)}}
      >
        <Image
          source={require("./assets/images/white-right-arrow.png")}
          style={styles.buttonImg}
        ></Image>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
function WorkoutBox(props) {
  return (
    <TouchableOpacity
      style={
        props.selected == props.id
          ? styles.workoutChoiceSelected
          : styles.workoutChoice
      }
      onPress={() => {props.setSelected(props.id)}}
    >
      <Image source={props.url} style={styles.imageIcon} />
      <Text style={styles.infoText}>{props.infoType}</Text>
      <Text style={styles.infoText}>{props.infoTime}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#010f2a",
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    justifyContent: "flex-start",
  },
  workoutChoice: {
    width: 150,
    height: 150,
    backgroundColor: "#1b2841",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  workoutChoiceSelected: {
    width: 150,
    height: 150,
    backgroundColor: "#304ffd",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  workoutContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    width: "100%",
  },
  titleText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: "10%",
    marginTop:30,
  },
  imageIcon: {
    width: "50%",
    height: "50%",
  },
  infoText: {
    color: "white",
    fontWeight: "bold",
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
  buttonImg: {
    width: "80%",
    height: "80%",
  },
  workoutChoice: {
    width: 150,
    height: 150,
    backgroundColor: "#1b2841",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  workoutChoiceSelected: {
    width: 150,
    height: 150,
    backgroundColor: "#304ffd",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  workoutContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    width: "100%",
  },
  titleText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: "10%",
    marginTop:30,
  },
  imageIcon: {
    width: "50%",
    height: "50%",
  },
  infoText: {
    color: "white",
    fontWeight: "bold",
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
  buttonImg: {
    width: "80%",
    height: "80%",
  },
  
});
