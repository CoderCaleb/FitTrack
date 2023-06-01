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
  FlatList,
  ImageBackground,
} from "react-native";
import { workouts } from "./WorkoutData";
import { useState, useEffect, useRef } from "react";
import { NavigationContainPer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
//import { NavigationActions } from '@react-navigation/native';
import { set, ref, getDatabase, get, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import CircularProgress from "react-native-circular-progress-indicator";
import * as Speech from "expo-speech";
export default function Workout(props) {
  let timer = "02.59";
  let seconds = 20;
  let workoutIndex = 1;
  //workoutInfo, mins,section

  let numberOfReps = workouts[0][props.route.params.data][0].reps;

  const Stack = createStackNavigator();
  const [time, setTime] = useState(seconds);
  const [reps, setReps] = useState(numberOfReps);
  const [finished, setFinished] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [index, setIndex] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [subtractArr,setSubtractArr] = useState(0);
  const [addArr,setAddArr] = useState(0);
  const [workoutFinished, setWorkoutFinished] = useState(false)
  const [calculatedTime, setCalculatedTime] = useState(0)
  const [arrUpdated, setArrUpdated] = useState(false)
  const intervalId = useRef(null);
  const intervalId2 = useRef(null);
  function calculateTime() {
    let totalTime = [];
    let finalResult = 0;
    for (let i = 0; i < workouts[0][props.route.params.data].length; i++) {
      totalTime.push(
        (workouts[0][props.route.params.data][i].interval *
          workouts[0][props.route.params.data][i].reps) /
          1000
      );
      finalResult = totalTime.reduce((total, num) => {
        return total + num;
      });
    }
    finalResult=finalResult+addArr-subtractArr
    return finalResult;
  }
  useEffect(()=>{
    console.log(subtractArr)
    console.log('result:',Math.round(calculateTime()/60))
    setCalculatedTime(Math.round(calculateTime()/60))
  },[subtractArr,addArr])
  useEffect(()=>{
    if(index==workouts[0][props.route.params.data].length){
    setArrUpdated(true)
    }
  },[calculatedTime])
  function useEffectFunc() {
    if (!isPressed && isReady) {
      numberOfReps = workouts[0][props.route.params.data][index - 1].reps;
      intervalId2.current = setInterval(
        workout,
        workouts[0][props.route.params.data][index - 1].interval
      );
    }
  }
  useEffect(()=>{
    clearInterval(intervalId2.current)
    setWorkoutFinished(false)
    console.log('useeffect ran',props.route.params.refreshFlag)
  },[props.route.params.refreshFlag])
  useEffect(() => {
    setReps(workouts[0][props.route.params.data][index - 1].reps);
  }, [index]);
  useEffect(() => {
    if (index <= workouts[0][props.route.params.data].length) useEffectFunc();
  }, [index, isPressed, isReady]);
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
    if (isPressed===true) {
      setIndex((prev) => (prev += 1));
      //setIsPressed(false);
      setFinished(false);
      console.log('hi')
    }
    else if(isPressed==="prev"){
      setIndex((prev) => (prev -= 1));
      //setIsPressed(false);
      setFinished(false);
      console.log(isPressed)


    }
  }, [isPressed]);
  // return <ReadyScreen />;
  //  <SelectScreen/>

  return isReady ? (
    isPressed ? (
      <ReadyScreen
        setIsPressed={setIsPressed}
        nextWorkout={workouts[0][props.route.params.data][index - 1]}
        intervalId={intervalId2.current}
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
        workout={workouts}
        workoutType={props.route.params.data}
        calculatedTime={calculatedTime}
        getData={props.route.params.getTime}
        numberOfReps={numberOfReps}
        setIndex={setIndex}
        intervalId={intervalId2.current}
        setFinished={setFinished}
        setReps={setReps}
        prevInfo={workouts[0][props.route.params.data][index - 2]}
        addArr={addArr}
        subtractArr={subtractArr}
        setAddArr={setAddArr}
        setSubtractArr={setSubtractArr}
        setWorkoutFinished={setWorkoutFinished}
        workoutFinished={workoutFinished}
        setArrUpdated={setArrUpdated}
        arrUpdated={arrUpdated}
      />
    ) : null
  ) : (
    <SummaryScreen
      workoutTypeInfo={workouts[0][props.route.params.data]}
      workoutType={props.route.params.data}
      time={calculatedTime}
      setIsReady={setIsReady}
    />
  );

  //return(<SummaryScreen workoutTypeInfo={workouts[0][props.route.params.data]} workoutType={props.route.params.data} time={Math.round(calculateTime()/60)}/>)
}
function SummaryScreen(props) {
  DATA = props.workoutTypeInfo.map((value, index) => {
    return {
      title: value.name,
      id: index.toString(),
      time: Math.round((value.reps * value.interval) / 1000),
      image: value.image,
    };
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: "100%", height: 100, justifyContent: "flex-end" }}>
        <ImageBackground
          source={props.workoutTypeInfo[0]["bgImage"]}
          style={styles.imageBackground}
        >
          <View style={styles.workoutHeader}>
            <Text style={styles.titleTextHeader}>
              {props.workoutType.toUpperCase()}
            </Text>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.infoTexSumContainer}>
        <View style={styles.marker}></View>
        <Text style={styles.infoTextSum}>{props.time + " mins"}</Text>
        <Text style={styles.infoTextSum}>•</Text>
        <Text style={styles.infoTextSum}>
          {props.workoutTypeInfo.length + " workouts"}
        </Text>
      </View>
      <FlatList
        data={DATA}
        renderItem={(prop) => (
          <FlatListItem
            title={prop.item.title}
            time={prop.item.time}
            image={prop.item.image}
          />
        )}
        keyExtractor={(prop) => prop.id}
        style={{ width: "80%" }}
      />
      <View
        style={{
          flex: 1,
          width: "100%",
          position: "absolute",
          height: 100,
          borderTopWidth: 1,
          borderColor: "#636E72",
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
        }}
      >
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => props.setIsReady(true)}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>I'm Ready</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  function FlatListItem(props) {
    return (
      <>
        <View style={styles.listContainer}>
          {props.image && (
            <Image
              source={props.image}
              style={styles.smallImage}
              cache="immutable"
            />
          )}
          <View style={styles.textContainer}>
            <Text style={styles.titleName}>{props.title}</Text>
            <Text style={styles.numberRepsText}>{"x" + props.time}</Text>
          </View>
        </View>
        <View style={styles.lineBreak}></View>
      </>
    );
  }
}
function ReadyScreen(props) {
  const [counter, setCounter] = useState(3);
  const [firstRender, setFirstRender] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter === 0) {
          clearInterval(interval);
          console.log("Interval cleared");
          props.setIsPressed(false);
          return prevCounter;
        } else {
          return prevCounter - 1;
        }
      });
      clearInterval(props.intervalId);
    }, 1000);
    setFirstRender(false);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (!firstRender) {
      Speech.speak("Take a rest");
      Speech.speak(props.nextWorkout.reps + props.nextWorkout.name + "next");
      setFirstRender(true);
    }
  }, [props.nextWorkout]);

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
      <CircularProgress
        value={counter}
        progressValueColor={"white"}
        maxValue={3}
        radius={100}
      />
    </View>
  );
}

function WorkoutScreen(props) {
  const [reps,setReps] = useState(0)
  const auth = getAuth();
  const userInstance = ref(getDatabase(), `/users/${auth.currentUser.uid}`);
  useEffect(() => {
    Speech.speak(props.workoutInfo.reps + props.workoutInfo.name);
    props.setReps(props.workoutInfo.reps);
  }, []);
  function endFunction(time) {
    console.log('time:',time)
    props.getData(time);
    get(userInstance)
      .then((snapshot) => {
        if (snapshot.exists()) {
          result = snapshot.val();
          update(userInstance, {
            timeSpent:
              result.timeSpent + Math.round(time),
            completed: (result.completed += 1),
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    Speech.speak("Well done");
    props.navigation.push("DoneScreen", {
      workouts: props.workout,
      dataTime: Math.round(time),
    });
    console.log("Workout ended");
    props.setIndex(1)
    props.setReps(0)
    props.setWorkoutFinished(true)
    clearInterval(props.intervalId)
  }
useEffect(()=>{
console.log(props.workoutFinished)
},[props.workoutFinished])
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imgContainer}>
        <Image
          source={
            props.workoutInfo.imageTop
              ? props.workoutInfo.imageTop
              : require("./assets/images/push-up-pic.jpeg")
          }
          style={styles.mainImage}
        />
      </View>
      {!props.workoutFinished?
      <View style={styles.infoMainContainer}>
        <View style={styles.infoContainer}>
          <Text
            style={{
              color: "white",
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            {props.index <= props.workout[0][props.workoutType].length
              ? `${props.workoutInfo.reps}x ${props.workoutInfo.name}`
              : "No More Workouts Left"}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "80%",
            }}
          ></View>

          <View style={styles.numberPushUps}>
            <CircularProgress
              value={props.reps}
              title="Reps"
              duration={100}
              titleColor={"#F4B324"}
              progressValueColor={"#F4B324"}
              activeStrokeColor={"#badc58"}
              maxValue={props.workoutInfo.reps}
            />
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
                console.log("Workout not end");
                props.setIsPressed(true);
              } else if (
                props.index >= props.workout[0][props.workoutType].length &&
                props.finished
              ) {
                endFunction(props.calculatedTime);
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
          <View style={styles.utilButtonContainer}>
            <TouchableOpacity
              style={props.index>1?styles.prevButton:styles.disabledPrevButton}
              onPress={() => {
                if (props.index > 1) {
                 props.setIsPressed('prev')
                 props.setAddArr(prev=>prev+(props.prevInfo.reps*props.prevInfo.interval/1000))
                 console.log('addArr:',props.addArr)
                }
              }}
            >
              <Text style={props.index>1?styles.buttonText:styles.buttonTextDisabled}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={!props.finished?styles.prevButton:styles.disabledPrevButton}
              onPress={() => {
                if (props.index < props.workout[0][props.workoutType].length&&!props.finished) {
                  props.setIsPressed(true);
                  props.setSubtractArr(prev=>prev+(props.workoutInfo.reps*props.workoutInfo.interval/1000))
                  console.log('subtractArr:',props.subtractArr)
                } else if (
                  props.index >= props.workout[0][props.workoutType].length
                ) {
                  props.setSubtractArr(prev=>prev+(props.workoutInfo.reps*props.workoutInfo.interval/1000))
                  if(props.arrUpdated){
                    endFunction(props.calculatedTime);
                    props.setArrUpdated(false)
                    console.log('arr updated',props.calculatedTime)
                  }
                }
              }}
            >
              <Text style={!props.finished?styles.buttonText:styles.buttonTextDisabled}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>:
      <View style={{justifyContent:'center',alignItems:'center',flex:1,gap:20}}>
        <Image source={require('./assets/images/party-popper-icon.png')} style={{width:150,height:150}}></Image>
              <Text style={styles.titleText}>You finished the workout!</Text>
      </View>
}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  lineBreak: {
    height: 1,
    width: "100%",
    backgroundColor: "white",
  },
  textContainer: {
    justifyContent: "center",
  },
  smallImage: {
    height: 80,
    width: 80,
  },
  titleName: {
    fontSize: 25,
    fontWeight: 500,
    color: "white",
    marginBottom: 15,
  },
  listContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 20,
    marginVertical: 15,
  },
  textContainerSum: {
    flex: 1,
    flexDirection: "row",
    gap: 20,
  },
  startButton: {
    width: "90%",
    height: 40,
    borderRadius: 20,
    backgroundColor: "#653ff1",
    alignItems: "center",
    justifyContent: "center",
  },
  prevButton: {
    backgroundColor: "#373a41",
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  utilButtonContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
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
    fontWeight:600
  },
  titleTextHeader: {
    color: "white",
    fontSize: 30,
    fontWeight: 600,
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
  numberRepsText: {
    color: "white",
    fontSize: 14,
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
    backgroundColor: "#121212",
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
    height: 320,
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
  disabledPrevButton:{
    backgroundColor: "#373a41",
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    opacity:0.4,
  },
  buttonContainer: {
    width: 100,
    height: 40,
    backgroundColor: "#6641ef",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },
  buttonContainerDisabled: {
    width: 100,
    height: 40,
    backgroundColor: "#6641ef",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    opacity: 0.4,
  },
  buttonTextDisabled: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    opacity:0.4,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: 600,
  },
  infoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    borderRadius: 10,
    flex: 0.9,
  },
  infoTexSumContainer: {
    flexDirection: "row",
    gap: 5,
    width: "100%",
    height: 60,
    alignItems: "center",
    borderBottomWidth: 1,
    paddingLeft: 30,
    borderColor: "#FFF7D4",
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoTextSum: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  infoMainContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 5,
    height: 20,
    backgroundColor: "#00dac6",
  },
  workoutHeader: {
    width: "100%",
    height: 100,
    justifyContent: "flex-end",
    paddingLeft: 17,
    paddingBottom: 17,
  },
  imageBackground: {
    flex: 1,
  },
});
