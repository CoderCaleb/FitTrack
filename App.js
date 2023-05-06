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
  function getData() {}
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SelectScreen">
        <Stack.Screen name="SelectScreen" component={SelectScreen} />
        <Stack.Screen name="WorkoutScreen" component={Workout} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="DoneScreen" component={DoneScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
