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
import SelectScreen from "./SelectScreen";
import HomeScreen from "./HomeScreen";
import DoneScreen from "./DoneScreen";
import LoginScreen from "./LoginScreen";
import SignUpScreen from './SignUpScreen'
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import firebase from 'firebase/compat/app'

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
  const [data,setData] = useState('arms')
  const [time,setTime] = useState(0)
  const [completed, setCompleted] = useState(0)
  function getData(data) {
    setData(data)
  }
  function getTime(data) {
  //  totalTime=totalTime+data
    setTime(time+data)
    setCompleted(prev=>prev+=1)
  }
  useEffect(()=>{
    console.log('Time',time)
    console.log('Copleted',completed)
  },[time,completed])
  const Stack = createStackNavigator();
  function CustomHeader(){
    return(
      <Text style={{color:'black'}}>Back</Text>
    )
  }
  return (    
    <NavigationContainer>
    <Stack.Navigator initialRouteName="SignUpScreen" screenOptions={{
      
      headerShown:true,
      gestureEnabled:false,
     // headerLeft: ()=><CustomHeader/>
      
    }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} initialParams={{time,completed}}/>
      <Stack.Screen name="SelectScreen" component={SelectScreen} initialParams={{ getData }} />
      <Stack.Screen name="WorkoutScreen" component={Workout} initialParams={{data,getTime}}/>
      <Stack.Screen name="DoneScreen" component={DoneScreen}/>
      <Stack.Screen name="LoginScreen" component={LoginScreen}/>
      <Stack.Screen name="SignUpScreen" component={SignUpScreen}/>


    </Stack.Navigator>
  </NavigationContainer>
  
  );
  
}
