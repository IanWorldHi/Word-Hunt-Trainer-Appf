import React, {useEffect, useState} from 'react'; 
import {ActivityIndicator, Text, View, StyleSheet, Pressable} from 'react-native';  //uses JSX;
import {useLocalSearchParams, useRouter} from 'expo-router';


type scoreRow = {
  id: number,
  name: string,
  topscore: number,
  dated: string 
}

type scoreResponse = {
  username: string,
  numRows: number,
  data: scoreRow[]
}

const requesting = async(request: Request) => {
  try{
    const response = await fetch(request);
    const result = (await response.json()) as scoreResponse;
    if(!response.ok){
      throw new Error(`Response status: ${response.status}`);
    }
    else{
      return result;
    }
  }
  catch(error: unknown){ //I think there are more optimal error handling methods for this
    console.log("Error: ", error);
    console.error("Error: ", error);
    throw error;
  }
}


//Results screen with score passed through useRouter. Also routes to game and home screen
export default function ResultsScreen() {
  const [isLoading, setIsLoading] = useState(false); //beacuse promise will take time to resolve
  const [data, setData] = useState(0); //switch to string after

  useEffect(() => {
    const request = new Request("http://localhost:3001/scores/Pencil", {
      method: "GET"
    });
    const loadData = async () => { //i could just do everything in here but leaving it out for now if reuse
      const result = await requesting(request);
      setData(result.numRows);
      setIsLoading(true);
    };
    loadData();
  }, []); 
  //empty dependency array means runs once only on mount

  const router = useRouter();
  const { score } = useLocalSearchParams(); 
  return (
    <View style={styles.resultView}>
      {isLoading ? (<ActivityIndicator/>): (<Text>Top Score: {data}</Text>)}
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






