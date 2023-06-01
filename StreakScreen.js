import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { update,ref,getDatabase,get } from 'firebase/database'
import { getAuth } from 'firebase/auth'
export default function StreakScreen(props) {
    const [streak, setStreak] = useState(0)
  const user = getAuth().currentUser
  get(ref(getDatabase(), `/users/${user.uid}/dailyStreak`)).then(snapshot=>{
    setStreak(snapshot.val())
}).catch(err=>console.log(err))
console.log(props.route.params)
  return (
    <>
    {
    props.route.params.streakStatus!=='broken'?    
    <View style={styles.container}>
        <Image source={require('./assets/images/fire-streak-icon.png')} style={styles.fireImage}/>
        <Text style={styles.streakText}>{`${streak} day streak!`}</Text>
        <Text style={styles.subText}>You're on fire! Keep working out and be the best version of yourself</Text>
        <TouchableOpacity style={styles.continueButton} onPress={()=>props.navigation.navigate('HomeScreen')}>
            <Text style={styles.buttonText}>CONTINUE</Text>
        </TouchableOpacity>
    </View>:
    <View style={styles.container}>
    <Image source={require('./assets/images/grey-fire-streak-icon-removebg-preview.png')} style={styles.fireImage}/>
    <Text style={styles.streakText}>You lost your streak 😔</Text>
    <Text style={styles.subText}>Don't worry! Everyone has setbacks. Use this as an opportunity to bounce back stronger and continue your fitness journey.
</Text>
    <TouchableOpacity style={styles.continueButton} onPress={()=>props.navigation.navigate('HomeScreen')}>
        <Text style={styles.buttonText}>CONTINUE</Text>
    </TouchableOpacity>
</View>
    }
    </>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#151e25',
        gap:10
    },
    fireImage:{
        width:170,
        height:170,
    },
    subText:{
        textAlign:'center',
        fontSize:15,
        color:'white',
        lineHeight:25,
        marginBottom:40
    },
    streakText:{
        fontSize:20,
        fontWeight:600,
        color:'white',
        width:'100%',
        textAlign:'center',
    },
    continueButton:{
        height:40,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#6740f4',
        borderRadius:10,
        width:'90%',
        position:'absolute',
        bottom:10
    },
    buttonText:{
        color:'white',
        fontWeight:600
    }
})