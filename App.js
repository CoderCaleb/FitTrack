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
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
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
  return (    
    <NavigationContainer>
    <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{
      /*
      headerShown:false,
      gestureEnabled:false
      */
    }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} initialParams={{time,completed}}/>
      <Stack.Screen name="SelectScreen" component={SelectScreen} initialParams={{ getData }} />
      <Stack.Screen name="WorkoutScreen" component={Workout} initialParams={{data,getTime}}/>
      <Stack.Screen name="DoneScreen" component={DoneScreen}/>
    </Stack.Navigator>
  </NavigationContainer>
  
  );
}
