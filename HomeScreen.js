import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Hi, Caleb</Text>
      <Text>If you want something you've never had, you must be willing to do something you've never done</Text>
    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center'
    },
})