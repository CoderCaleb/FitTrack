import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Platform,
  StatusBar,
  Button,
  TouchableOpacity,
  Vibration,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { NavigationContainPer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
//import { NavigationActions } from '@react-navigation/native';
import {set,ref,getDatabase,get, update} from 'firebase/database'
import {getAuth} from 'firebase/auth'
import CircularProgress from "react-native-circular-progress-indicator";

export default function Workout(props) {
  let timer = "02.59";
  let seconds = 20;
  let workoutIndex = 1;
  
  //workoutInfo, mins,section
  const workouts = [
    {
      arms: [
        { name: "Push Ups", reps: 10, interval: 2000 },
        { name: "Bicep Curls", reps: 8, interval: 3000 },
        { name: "Tricep Dips", reps: 12, interval: 2500 },
        { name: "Hammer Curls", reps: 10, interval: 3000 },
        { name: "Overhead Press", reps: 8, interval: 3000 },
        { name: "Close Grip Bench Press", reps: 12, interval: 2500 },
      ],
      chest: [
        { name: "Bench Press", reps: 15, interval: 2000 },
        { name: "Pull Ups", reps: 3, interval: 2000 },
        { name: "Plank", reps: 30, interval: 2000 },
      ],
      abs: [
        { name: "Sit ups", reps: 15, interval: 1000 },
        { name: "Crunches", reps: 15, interval: 1000 },
        { name: "Reverse Crunches", reps: 15, interval: 1000 },
      ],
      legs: [
        { name: "Squats", reps: 10, interval: 2000 },
        { name: "Squats", reps: 5, interval: 2000 },
        { name: "Plank", reps: 30, interval: 2000 },
      ],
    },
    10,
    3,
  ];
  let numberOfReps = workouts[0][props.route.params.data][0].reps;

  const Stack = createStackNavigator();
  const [time, setTime] = useState(seconds);
  const [reps, setReps] = useState(numberOfReps);
  const [finished, setFinished] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [index, setIndex] = useState(1);
  const [dbTime, setDbTime] = useState(0)
  const [dbCompleted, setDbCompleted] = useState(0)
  const intervalId = useRef(null);
  const intervalId2 = useRef(null);

  function calculateTime(){
    let totalTime = []
    let finalResult = 0
    for(let i =0;i<workouts[0][props.route.params.data].length;i++){
      totalTime.push((workouts[0][props.route.params.data][i].interval*workouts[0][props.route.params.data][i].reps)/1000)
      finalResult = totalTime.reduce((total,num)=>{return total+num})
    }
    return finalResult
  }
  function useEffectFunc() {
    if (!isPressed) {
      numberOfReps = workouts[0][props.route.params.data][index - 1].reps;
      intervalId.current = setInterval(formatTime, 1000);
     intervalId2.current = setInterval(workout, workouts[0][props.route.params.data][index-1].interval);
     //intervalId2.current = setInterval(workout, 100);

    }
    console.log("index", index, workouts.length);
  }
  useEffect(() => {
    if (index <= workouts[0][props.route.params.data].length) useEffectFunc();
  }, [index, isPressed]);
  function formatTime() {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    if (seconds <= 0) {
      clearInterval(intervalId.current);
    } else {
      seconds--;
    }
    setTime(padFormat(min, sec));
  }
  function padFormat(min, sec) {
    const formattedMin = String(min).padStart(2, "0");
    const formattedSec = String(sec).padStart(2, "0");
    return `${formattedMin}:${formattedSec}`;
  }
  function workout() {
    numberOfReps--;
    setReps(numberOfReps);
    if (numberOfReps <= 0) {
      clearInterval(intervalId2.current);
    }
    if (numberOfReps <= 0) {
      setFinished(true);
    }
  }
  useEffect(() => {
    if (isPressed) {
      setIndex((prev) => (prev += 1));
      //setIsPressed(false);
      setFinished(false);
    }
  }, [isPressed]);
  // return <ReadyScreen />;
  //  <SelectScreen/>
  return isPressed ? (
    <ReadyScreen
      setIsPressed={setIsPressed}
      nextWorkout={workouts[0][props.route.params.data][index - 1]}
    />
  ) : workoutIndex <= workouts[0][props.route.params.data].length ? (
    <WorkoutScreen
      time={time}
      reps={reps}
      finished={finished}
      navigation={props.navigation}
      setIsPressed={setIsPressed}
      workoutInfo={workouts[0][props.route.params.data][index - 1]}
      index={index}
      workout={workouts}n
      workoutType={props.route.params.data}
      calculateTime = {calculateTime}
      getData={props.route.params.getTime}
      numberOfReps={numberOfReps}
    />
  ) : null;
}
function ReadyScreen(props) {
  const [counter, setCounter] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter === 0) {
          clearInterval(interval);
          props.setIsPressed(false);
          return prevCounter;
        } else {
          return prevCounter - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#010f2a",
        },
      ]}
    >
      <Text
        style={[
          styles.timerText,
          { fontSize: 40, color: "#F4B324", margin: 16, textAlign: "center" },
        ]}
      >
        {`${props.nextWorkout.reps}x ${props.nextWorkout.name} Next`}
      </Text>
      <Text style={styles.readyText}>Get Ready!</Text>
      <CircularProgress value={counter} progressValueColor={'white'} maxValue={3} radius={100}/>

    </View>
  );
}

function WorkoutScreen(props) {
  const auth = getAuth()
  const userInstance = ref(getDatabase(),`/users/${auth.currentUser.uid}`)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imgContainer}>
        <Image
          source={require("./assets/images/push-up-pic.jpeg")}
          style={styles.mainImage}
        />
        <Text style={styles.encourageText}>Keep On Going!</Text>
        <Text
          style={[
            styles.text,
            styles.numberText,
            {
              position: "absolute",
              bottom: -50,
              color: "#F4B324",
              fontWeight: "700",
              textAlign: "center",
            },
          ]}
        >
          {props.index <= props.workout[0][props.workoutType].length
            ? `${props.workoutInfo.reps}x ${props.workoutInfo.name}`
            : "No More Workouts Left"}
        </Text>
      </View>
      <View style={styles.infoMainContainer}>
        <View style={styles.infoContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "80%",
            }}
          >
            <Text style={styles.infoText}>{`Reps: ${
              props.index <= props.workout[0][props.workoutType].length
                ? props.workoutInfo.reps
                : null
            }`}</Text>
            <Text style={styles.infoText}>{`Sections: ${props.index}/${
              props.workout[0][props.workoutType].length
            }`}</Text>
          </View>

          <View style={styles.numberPushUps}>
           
              <CircularProgress value={props.reps} title="Reps" duration={100} titleColor={'#F4B324'} progressValueColor={'#F4B324'} activeStrokeColor={'#badc58'} maxValue={props.workoutInfo.reps}/>

          </View>
          <TouchableOpacity
            style={
              props.finished
                ? styles.buttonContainer
                : styles.buttonContainerDisabled
            }
            onPress={() => {
              // props.finished ? props.navigation.push("HomeScreen") : null;
              if (
                props.finished &&
                props.index < props.workout[0][props.workoutType].length
              ) {
                props.setIsPressed(true);
              } else if (
                props.index >= props.workout[0][props.workoutType].length &&
                props.finished
              ) {
                props.getData(props.calculateTime())
                get(userInstance)
                .then((snapshot)=>{
                  if(snapshot.exists()){
                    result = snapshot.val()
                    update(userInstance,{
                      timeSpent:result.timeSpent+Math.round(props.calculateTime()/60),
                      completed: result.completed+=1
                    })
                    console.log('result: ',result.timeSpent+Math.round(props.calculateTime()/60))
                  }
                })
                .catch((err)=>{console.log(err)})
                props.navigation.push("DoneScreen", {
                  workouts: props.workout,
                  dataTime: Math.round(props.calculateTime()/60),
                });
              }
            }}
          >
            <Text
              style={
                props.finished ? styles.buttonText : styles.buttonTextDisabled
              }
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  counterContainer: {
    width: 170,
    height: 170,
    borderColor: "#6540ea",
    borderWidth: 10,
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  readyText: {
    color: "#6540ea",
    fontSize: 30,
    marginBottom: 20,
  },
  throphyImg: {
    width: 300,
    height: 300,
  },
  homeButton: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6540ea",
    borderRadius: 100,
    height: 50,
  },
  titleText: {
    color: "white",
    fontSize: 30,
  },
  mainResultContainer: {
    flexDirection: "row",
    width: "90%",
  },
  resultContainer: {
    flex: 1,
    alignItems: "center",
    gap: 10,
  },
  subText: {
    color: "white",
    fontSize: 14,
    marginBottom: 50,
  },
  congratulateText: {
    color: "#6540ea",
    fontSize: 30,
    marginBottom: 15,
  },
  text: {
    color: "white",
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: "#1b191a",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  encourageText: {
    color: "white",
    fontSize: 35,
    marginBottom: 10,
    position: "absolute",
    top: 0,
  },
  mainImage: {
    width: "100%",
    height: 360,
    position: "relative",
  },
  numberText: {
    color: "#f5e7d8",
    fontSize: 35,
    marginTop: 30,
    marginBottom: 40,
  },
  timerText: {
    fontSize: 70,
    fontWeight: "bold",
    color: "white",
  },
  numberPushUps: {
    width: 120,
    height: 120,
    backgroundColor: "#303030",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  imgContainer: {
    width: "100%",
    alignItems: "center",
  },
  buttonContainer: {
    width: 100,
    height: 40,
    backgroundColor: "#303030",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },
  buttonContainerDisabled: {
    width: 100,
    height: 40,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    opacity: 0.5,
  },
  buttonTextDisabled: {
    color: "#A9A9A9",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonText: {
    color: "#F4B324",
    fontSize: 15,
  },
  infoContainer: {
    backgroundColor: "#F6E7D8",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    borderRadius: 10,
    flex: 0.9,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoMainContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
