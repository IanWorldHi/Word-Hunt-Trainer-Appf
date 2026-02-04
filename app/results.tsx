import React, {useLayoutEffect, useEffect, useState} from 'react'; 
import {Button, Text, View, StyleSheet, Pressable} from 'react-native';  //uses JSX
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter} from 'expo-router';
import {TrieNode, build_trie, calculate_points, make_rand_board} from '../lib/wordhunallg';
import {GestureHandlerRootView, GestureDetector ,Gesture} from 'react-native-gesture-handler';
//figure out where we build the trie and how to cache it
//clean up dependencies

//Results screen with score passed through useRouter. Also routes to game and home screen
export default function ResultsScreen() {
  const router = useRouter();
  const { score } = useLocalSearchParams(); 
  return (
    <View style={styles.resultView}>
      <Text style={styles.resultText}>Score: {score}</Text>
      <Pressable 
        style={styles.resultButton}
        onPress={() => router.push('/game')}
      >
        <Text style={styles.resultButtonText}>Play Again</Text>
      </Pressable>
      <Pressable
        style={[styles.resultButton, styles.resultButton2]}
        onPress={() => router.push('/')}
      >
        <Text style={styles.resultButtonText}>Return Home</Text>
      </Pressable>
      <Text style={styles.result2Text}>Are you read to get better at WordHunt to beat your friends?</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  resultView: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  resultButton: {
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#537acd',
    borderWidth: 2,
    width: 150,
    height: 50,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 15,
  },
  resultButton2: {

  },
  resultButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 600,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  resultText: {
    fontSize: 32,
    color: 'black',
    fontWeight: 600,
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 28,
  },
  result2Text: {
    fontSize: 15,
    color: 'black',
    fontWeight: 400,
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 0,
    textAlign: 'center',
    width: '70%',
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  resultBackground: {

  }
});






