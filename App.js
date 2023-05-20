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
  function getData(data) {
    setData(data)
    console.log('data: ',data)
  }
  function getTime(data) {
    console.log(data);
    setDataTime(data)
  }
 
  
  const Stack = createStackNavigator();
  function CustomHeader(){
    return(
      <Text style={{color:'black'}}>Back</Text>
    )
  }
  console.log('hgi',dataTime)
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
      <Stack.Screen name="DoneScreen" component={DoneScreen} initialParams={{data}}/>
      <Stack.Screen name="LoginScreen" component={LoginScreen}/>
      <Stack.Screen name="SignUpScreen" component={SignUpScreen}/>


    </Stack.Navigator>
  </NavigationContainer>
  
  );
  
}
