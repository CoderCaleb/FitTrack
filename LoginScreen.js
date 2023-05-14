import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useState } from "react";
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
//import { initializeApp } from "firebase/app";

  export default function LoginScreen(props) {
  const [password,setPassword] = useState(null)
  const [email,setEmail] = useState(null)
  const [isFocused,setIsFocused] = useState('')
  const [wrong, setWrong] = useState(false)
  const userInfo={
    password:'123',
    username:'Drippydino'
  }
  function checkInfo(password,username){
    if(userInfo.password==password&&userInfo.username==username){
        return true
    }
    else{
        return false
    }
  }
  function handleLogin(){
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then(()=>{
      console.log('User logged in!');
      props.navigation.navigate('HomeScreen');
      setWrong(false)
    })
    .catch((err)=>{console.log(err.message);setWrong(true)});
  }
  
  return (
    <SafeAreaView style={styles.container}>

    <View style={styles.marginContainer}>

      <Text style={styles.title}>Login</Text>

      <Text style={styles.subtitle}>Please sign in to continue</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Email</Text>
        <TextInput placeholder="Enter your email" style={isFocused=='email'?[styles.inputBox,{borderColor:'#be1cce'}]:styles.inputBox} placeholderTextColor='#555555' onFocus={()=>setIsFocused('email')} value={email} onChangeText={(value)=>{setEmail(value)}}></TextInput>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Password</Text>
        <TextInput placeholder="Enter your password" style={isFocused=='password'?[styles.inputBox,{borderColor:'#be1cce'}]:styles.inputBox} placeholderTextColor='#555555' secureTextEntry={true} onChangeText={(value)=>{setPassword(value)}} onFocus={()=>setIsFocused('password')} value={password}></TextInput>
      </View>
      <View style={wrong?[styles.wrongPasswordContainer,{display:'block'}]:styles.wrongPasswordContainer}>
        <Text style={styles.wrongPassword}>Incorrect username or password</Text>
      </View>
      <TouchableOpacity style={styles.logInButton} onPress={()=>handleLogin()}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <Text style={styles.bottomText}>Don't have a account? <Text style={styles.secondaryText} onPress={()=>{props.navigation.navigate('SignUpScreen')}}>Sign Up</Text></Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  inputBox: {
    borderWidth: 2,
    borderRadius: 8,
    width: "100%",
    height: 45,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor:'#171717',
    borderColor:'#1d1d1d',
    color:'white'
  },
  marginContainer:{
    margin:20
  },
  container: {
    backgroundColor: "#101010",
    flex: 1,
    width:'100%',
    justifyContent:'center',
    position:'relative'
  },
  title:{
    color:'white',
    fontSize:38,
    fontWeight:700
  },
  subtitle:{
    color:'#6f6f6f',
    marginTop:10,
    marginBottom:20
  },
  inputTitle:{
    color:'white'
  },
  inputContainer:{
    gap:10
  },
  logInButton:{
    justifyContent:'center',
    alignItems:'center',
    height:55,
    backgroundColor:'#be1cce',
    borderRadius:10,
    marginTop:10
  },
  buttonText:{
    color:'white',
    fontWeight:'600'
  },
  image:{
    width:200,
    height:200,
  },
  bottomText:{
    color:'#878787',
    alignSelf:'center',
    marginTop:15
  },
  secondaryText:{
    fontWeight:'bold',
    color:'white',
  },
  wrongPassword:{
    color:'#8e3743'
  },
  wrongPasswordContainer:{
    width:'100%',
    backgroundColor:'#fedbdf',
    justifyContent:'center',
    height:50,
    borderRadius:8,
    paddingLeft:10,
    display:'none'
  },
});
