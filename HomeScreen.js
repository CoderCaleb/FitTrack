import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
//import firebase from 'firebase'
export default function HomeScreen(props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: "90%" }}>
        <View style={styles.userInfoContainer}>
          <Image
            source={require("./assets/images/cat-pfp.jpeg")}
            style={styles.pfp}
          />
          <View>
            <Text style={styles.welcomeText}>Hello 👋</Text>
            <Text style={styles.nameText}>Caleb Tan</Text>
          </View>
        </View>
        <View style={styles.workoutInfoContainer}>
          <View style={styles.infoBox}>
            <Image
              source={require("./assets/images/clockimg.png")}
              style={styles.iconImg}
            />
            <Text style={styles.numberText}>{Math.round(props.route.params.time/60)}</Text>
            <Text style={styles.infoType}>{Math.round(props.route.params.time/60)>1?'Minutes':'Minute'}</Text>
          </View>
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: "#baefc3",
                },
              ]}
            >
             <Image
                source={require('./assets/images/thumbup.png')}
                style={[styles.iconImg, { width: 40, height: 40 }]}
                accessibilityLabel="img"
              />

                <Text style={styles.numberText}>{props.route.params.completed}</Text>
                <Text style={styles.infoType}>
                  Completed
                </Text>

            </View>
            
        </View>
        <TouchableOpacity style={styles.button} onPress={()=>props.navigation.push('SelectScreen')}><Text style={[styles.text,{color:'white'}]}>Start Workout</Text></TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  text: {
    color: "black",
    fontSize: 17,
    marginVertical: 16,
    fontWeight: "bold",
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
    flexDirection:'row',
  },
  nameText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  welcomeText: {
    color: "white",
    fontSize: 20,
    fontWeight:500,
    marginBottom:5
  },
  pfp: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignSelf:'center'
  },
  workoutInfoContainer: {
    width: "100%",
    height: 200,
    gap: 20,
    flexDirection: "row",
    marginTop:30
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#fff4c8",
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
  button:{
    width:'100%',
    height:50,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#304ffd',
    borderRadius:15,
    marginTop:20
  },
  numberText:{
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  }
});
