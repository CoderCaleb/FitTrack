import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, ImageBackground } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
//import firebase from 'firebase'
import { getDatabase, ref, set, get, onValue, update } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import {workouts} from './WorkoutData'
const ButtonContext = React.createContext()

export default function HomeScreen(props) {
  const auth = getAuth();
  const userInstance = ref(getDatabase(), `/users/${auth.currentUser.uid}`);
  const [completed, setCompleted] = useState(0);
  const [time, setTime] = useState(0);
  //const [data, setData] = useState({})
  const [selected, setSelected] = useState("arms");
  const [buttonClick, setButtonClick] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const keys = Object.keys(workouts[0])
  console.log('keys',keys)
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
  function calculateTime(data){
    let totalTime = []
    let finalResult = 0
    for(let i =0;i<workouts[0][data].length;i++){
      totalTime.push((workouts[0][data][i].interval*workouts[0][data][i].reps)/1000)
      finalResult = totalTime.reduce((total,num)=>{return total+num})
    }
    return finalResult
  }
  return (
    <ScrollView onScrollBeginDrag={()=>setIsScrolling(true)} onScrollEndDrag={()=>setIsScrolling(false)}>
    <SafeAreaView style={styles.container}>
      <View style={{ width: "90%" }}>
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
       
      </View>
      <View style={styles.workoutContainer}>
       <Text style={styles.subText}>What's on your mind</Text> 
<ButtonContext.Provider value={{buttonClick, setButtonClick,setSelected}}>
      {
        keys.map((value,index)=>{
          return(
<WorkoutBox
          infoType={value}
          infoTime={Math.round(calculateTime(value)/60)}
          bgImage={workouts[0][value][0]['bgImage']}
          setSelected={setSelected}
          isScrolling={isScrolling}
          navigate={props.navigation.navigate}
        />)})
      }
      
       
       { /*<WorkoutBox
          url={require("./assets/images/arms-flex.png")}
          infoType="Arms"
          infoTime="10 mins"
          id="arms"
          selected={selected} 
          setSelected={setSelected}
          bgImg={require('./assets/images/arms-background.webp')}
        />
        <WorkoutBox
          url={require("./assets/images/bench-press.png")}
          infoType="Chest"
          infoTime="10 mins"
          id="chest"
          selected={selected}
          setSelected={setSelected}
            bgImg={require('./assets/images/chestworkout-bg.webp')}
        />
        <WorkoutBox
          url={require("./assets/images/abs-workout-icon.png")}
          infoType="Abs"
          infoTime="10 mins"
          id="abs"
          selected={selected}
          setSelected={setSelected}
          navigate={props.navigation.navigate}
          bgImg={require('./assets/images/abs-background.png')}
        />
        <WorkoutBox
          url={require("./assets/images/leg-workout-icon.png")}
          infoType="Legs"
          infoTime="10 mins"
          id="legs"
          selected={selected}
          setSelected={setSelected}
          bgImg={require('./assets/images/legworkout-bg.jpeg')}
          />*/}
        </ButtonContext.Provider>
      </View>
    </SafeAreaView>
    </ScrollView>
  );
}

function WorkoutBox(props) {
  const {setButtonClick, buttonClick,setSelected} = useContext(ButtonContext)
  console.log('bgImg',props.bgImg)
  return (

    <TouchableOpacity
      style={
        styles.workoutChoice
      }
      onPress={() => {
        if(!props.isScrolling){
        props.navigate('WorkoutScreen',{
          data:props.infoType
        })
        console.log(props.infoType)
      }  
      }}
    >
        <ImageBackground style={styles.imgBg} source={props.bgImage} imageStyle={{borderRadius:10}}>
          <View style={{flex:1,borderRadius:10,justifyContent:'flex-end',backgroundColor: 'rgba(0,0,0,0.2)',padding:15,gap:5}}>
            <Text style={styles.infoText}>{props.infoType.charAt(0).toUpperCase()+props.infoType.slice(1)}</Text>
            <Text style={styles.textTime}>{props.infoTime+' minutes'}</Text>
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
  subText:{
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    width:'90%',
    alignSelf:'center'
  },
  textTime:{
    color:'white',
    fontSize:15,
  },
  imgBg:{
    flex:1,
    width:'100%',
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
  },
  workoutChoice: {
    width:'90%',
    height: 150,
    backgroundColor: "#1b2841",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    alignSelf:'center'
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
    fontSize:30,
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
  workoutContainer: {
    justifyContent: "center",
    gap: 20,
    width: "100%",
    marginTop:20,
  },
  titleText: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: "10%",
    marginTop:30,
  },


 
});
