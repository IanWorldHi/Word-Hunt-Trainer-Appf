import React, {DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS, useEffect, useState} from 'react'; 
import {ActivityIndicator, Text, View, StyleSheet, Pressable} from 'react-native';  //uses JSX;
import {useLocalSearchParams, useRouter} from 'expo-router';
import { WhContext } from '../context/whContext';
import { SCORES_URL } from '../apis/wordHunters';

//Results screen with score passed through useRouter. Also routes to game and home screen
export default function ResultsScreen() {
  const {username, accessToken, scores, setScores} = React.useContext(WhContext);
  const [isLoading, setIsLoading] = useState(true); //beacuse promise will take time to resolve
  const [isLoading2, setIsLoading2] = useState(true);
  const [isNewTopScore, setIsNewTopScore] = useState(false);
  const router = useRouter();
  const { score } = useLocalSearchParams(); 
  const score1 = parseInt(score as string, 10);
  
  useEffect(() => {
    const fetchling = async () => {
      try{
        const response = await fetch(`${SCORES_URL}/scores`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
        });
        const data = await response.json();
        setScores(data.topScore);
        return data.topScore;
      }
      catch(error: unknown){
        console.error("Error: ", error);
        return null;
      }
    }
    const newTopScore = async () => {
      try{
        const request = await fetch(`${SCORES_URL}/scores`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
          body: JSON.stringify({topscore: score1})
        });
        if(!request.ok){
          console.error("Failed to update top score");
        }
      }
      catch(error: unknown){
        console.log("Error: ", error);
      }
      setIsLoading(false);
    }
    const run = async() => {
      const topScore = await fetchling();
      if(topScore !== null){
        if(score1 > topScore){
          setIsNewTopScore(true);
          setScores(score1);
          await newTopScore();
        }
        else{
          setIsNewTopScore(false);
        }
      }
      setIsLoading(false);
    }
    run();
  }, [accessToken, username, score1, scores, score, setScores]);
  
  return (
    <View style={styles.resultView}>
      {isNewTopScore && <Text>Congratulations! New Top Score: {scores}</Text>}
      {(isLoading && isLoading2) ? (<ActivityIndicator/>): (<Text style={styles.resultText}>Top Score: {scores}</Text>)}
      <Text style={styles.resultText}>Score: {score} ({username})</Text>
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






