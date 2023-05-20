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
import { set } from "firebase/database";
export default function DoneScreen(props) {
  const [dataTime,setDataTime] = useState(443)
  useEffect(()=>{
    console.log('DataTime: ',props.route.params.workouts)
    setDataTime(props.route.params.dataTime)

  },[props.route.params['dataTime']])
    return (
      <SafeAreaView style={styles.container}>
        <Image source={require('./assets/images/throphy.png')} style={styles.throphyImg}></Image>
        <Text style={styles.congratulateText}>Congratulations!</Text>
        <Text style={styles.subText}>You have completed the workout!</Text>
        <View style={styles.mainResultContainer}>

          <View style={styles.resultContainer}>
            <Text style={styles.titleText}>{dataTime}</Text>
            <Text style={styles.subText}>Minutes</Text>
          </View>
          <View style={styles.resultContainer}>
            <Text style={styles.titleText}>{props.route.params['workouts'][0][props.route.params.data].length}</Text>
            <Text style={styles.subText}>Sections Completed</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.homeButton} onPress={()=>props.navigation.push('HomeScreen')}><Text style={styles.text}>Home</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    throphyImg:{
        width:300,
        height:300
      },
      homeButton:{
        width:"80%",
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#6540ea',
        borderRadius:100,
        height:50
      },
      titleText:{
        color: "white",
        fontSize: 30,
      },
      mainResultContainer:{
        flexDirection:'row',
        width: '90%'
      },
      resultContainer:{
        flex:1,
        alignItems:'center',
        gap:10
      },
      subText:{
        color: "white",
        fontSize: 14,
        marginBottom:50
      },
      congratulateText:{
        color:'#6540ea',
        fontSize: 30,
        marginBottom:15
      },
      text: {
        color: "white",
        fontSize: 18,
      },
      container: {
        flex: 1,
        backgroundColor: "#010f2a",
        alignItems: "center",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      },

     
  });
  