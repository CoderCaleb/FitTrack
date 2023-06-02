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
} from "react-native";
import { useState, useEffect, useRef } from "react";
import Workout from "./WorkoutScreen";
import HomeScreen from "./HomeScreen";
import DoneScreen from "./DoneScreen";
import LoginScreen from "./LoginScreen";
import SignUpScreen from './SignUpScreen'
import WelcomeScreen from "./WelcomeScreen";
import StreakScreen from "./StreakScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import firebase from 'firebase/compat/app'
import {set,ref,getDatabase,get} from 'firebase/database'
import {getAuth,onAuthStateChanged} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyApr_jKjnMAAi0gq_wOl5pJEKsdfqcpmDE",
  authDomain: "fittrack-app-238bd.firebaseapp.com",
  projectId: "fittrack-app-238bd",
  storageBucket: "fittrack-app-238bd.appspot.com",
  messagingSenderId: "1073150587029",
  appId: "1:1073150587029:web:872f6865b24d94eba26b9c"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default function App() {
  const auth = getAuth()
  let result ={}
  const userInstance = auth.currentUser?ref(getDatabase(),`/users/${auth.currentUser.uid}`):null
  
  const [data,setData] = useState('arms')
  const [time,setTime] = useState(0)
  const [dataTime, setDataTime] = useState(0)
  const [completed, setCompleted] = useState(0)
  const [signedIn, setSignIn] = useState(false)
  const [login, setLogin] = useState(false)
  function getData(data) {
    setData(data)
    console.log('data: ',data)
  }
  function getTime(data) {
    console.log(data);
    setDataTime(data)
  }
  useEffect(()=>{
    console.log('TYPE',data)
  },[data])

  useEffect(()=>{
    /*
    onAuthStateChanged(auth,(user)=>{
      if(login){
        const checkIn = user?true:false;
        setSignIn(checkIn)
        setLogin(false)
        console.log('Login:',login)
      }
     })
     */
  },[login])
  
  const Stack = createStackNavigator();
  function CustomHeader(){
    return(
      <Text style={{color:'black'}}>Back</Text>
    )
  }
  return (    
    <NavigationContainer>
    <Stack.Navigator initialRouteName="WelcomeScreen" screenOptions={{
      
      headerShown:true,
      gestureEnabled:false,
     // headerLeft: ()=><CustomHeader/>
      
    }}>

      {
        login?
        <>
      <Stack.Screen name="HomeScreen" component={HomeScreen} initialParams={{time,completed,setLogin}}/>
      <Stack.Screen name="WorkoutScreen" component={Workout} initialParams={{data,getTime}}/>
      <Stack.Screen name="DoneScreen" component={DoneScreen} initialParams={{data}}/>
      <Stack.Screen name="StreakScreen" component={StreakScreen}/>
      </>
:
<>
      <Stack.Screen name='WelcomeScreen' component={WelcomeScreen}></Stack.Screen>
      <Stack.Screen name="LoginScreen" component={LoginScreen} initialParams={{setLogin}}/>
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} initialParams={{setLogin}}/>
      </>
      }

    </Stack.Navigator>
  </NavigationContainer>
  
  );
  
}

