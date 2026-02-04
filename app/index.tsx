import React, {useLayoutEffect, useEffect, useState} from 'react'; 
import {Button, Text, View, StyleSheet, Pressable} from 'react-native';  //uses JSX
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {TrieNode, build_trie, calculate_points, make_rand_board} from '../lib/wordhunallg';
import {GestureHandlerRootView, GestureDetector ,Gesture} from 'react-native-gesture-handler';
//figure out where we build the trie and how to cache it
//clean up dependencies

//Home Screen formatted with router to game screen
export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.homeView}>
      <Text style={styles.homeText}>Welcome to my WordHunt Trainer!</Text>
      <Pressable 
        style={styles.homeButton}
        onPress={() => router.push('/game')}
      >
        <Text style={styles.homeButtonText}>Start Game</Text>
      </Pressable>
      <Text style={styles.home2Text}>Are you read to get better at WordHunt to beat your friends?</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  homeView: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  homeButton: {
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#537acd',
    borderWidth: 2,
    width: 150,
    height: 50,
    borderColor: 'black',
    borderRadius: 5,
  },
  homeButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 600,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  homeText: {
    fontSize: 32,
    color: 'black',
    fontWeight: 600,
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 28,
    textAlign: 'center',
    width: '70%',
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  home2Text: {
    fontSize: 15,
    color: 'black',
    fontWeight: 400,
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 17,
    textAlign: 'center',
    width: '70%',
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  homeBackGround: {

  }
});






