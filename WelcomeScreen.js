import { View, Text, StyleSheet,Image,TouchableOpacity } from 'react-native'
import React from 'react'

export default function WelcomeScreen(props) {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/images/carrot-workout-icon.png')} style={styles.imageIcon}></Image>
      <Text style={styles.mainText}>Welcome to FitTrack, where your fitness goals become reality</Text>
      <Text style={styles.subText}>Get ready to challenge yourself and achieve your fitness goals with our comprehensive workout routines and progress tracking.</Text>
      <View style={{alignItems:'center',width:'100%',gap:10}}>
      <TouchableOpacity style={styles.button} onPress={()=>props.navigation.navigate('SignUpScreen')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <Text style={styles.promptText}>Already have an account? <Text style={styles.clickText} onPress={()=>props.navigation.navigate('LoginScreen')}>Login</Text></Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
       flex:1,
       justifyContent:'center',
       alignItems:'center',
       backgroundColor: "#101010",
       gap:25
    },
    imageLogo:{
        width:40,
        height:10,
    },
    imageIcon:{
        width:200,
        height:200,
    },
    mainText:{
        fontSize:25,
        fontWeight:500,
        textAlign:'center',
        color:'white',
        lineHeight:35,
    },
    subText:{
        textAlign:'center',
        color:'#787878',
        lineHeight:20
    },
    buttonText:{
        color:'white',
        fontSize:16,
        fontWeight:600
    },
    button:{
        backgroundColor:'#52afaa',
        borderRadius:13,
        width:'80%',
        height:40,
        alignItems:'center',
        justifyContent:'center',
    },
    promptText:{
        color:'white',
    },
    clickText:{
        color:'#52afaa',
    }
})