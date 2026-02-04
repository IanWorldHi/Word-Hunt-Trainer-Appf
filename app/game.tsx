import React, {useLayoutEffect, useEffect, useState} from 'react'; 
import {Button, Text, View, StyleSheet, Pressable} from 'react-native';
import {TrieNode, build_trie, calculate_points, make_rand_board} from '../lib/wordhunallg';
import {GestureHandlerRootView, GestureDetector ,Gesture} from 'react-native-gesture-handler';
import { router, useRouter } from 'expo-router';
import { scheduleOnRN } from 'react-native-worklets';


const trie: TrieNode = build_trie();

type TimerProps = {
  timer: number;
}

//Timer
const Timer = (props: TimerProps) => {
  return (
    <Text style={styles.timerText}>Time: {props.timer}</Text>
  )
}

type wordListProps = {
  board: string[][];
  usedWords: string[];
}

//Wordlist of best scoring words minus all the words already scored
const WordList = (props: wordListProps) => {
  const [wordList, setWordList] = useState<string[]>(trie.solve_board(props.board, 5).flat().reverse()); 
  const filteredWords = wordList.filter(word => !props.usedWords.includes(word)).slice(0, 20);
  return (
    <View style={styles.wordList}> 
      {filteredWords.map((word, key) => (
        <View key={key}>
          <Text>{`${word[0].toUpperCase()}${word.slice(1)} `}</Text>
        </View>
      ))}
    </View>   
  );
}

type letProp = {
  letter: string;
  isSelected: boolean;
  isWord2: boolean;
  isWordBefore: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
  style?: any;
};

//Component for each individual letter tile - includes styled pressable
const LetterBox = (props: letProp) => {
  return (
    <Pressable
      style={[styles.button, props.isSelected && styles.selected, props.isWord2 && styles.selectedCorrect, props.isWordBefore && styles.selectedBefore]}
      onPressIn={props.onPressIn}
      onPressOut={props.onPressOut}
    >
      <Text style={[styles.letterText, props.isSelected && styles.letterTextSelected]}>
        {props.letter}
      </Text> 
    </Pressable>
  );
};

//Core logic for displaying the grid of letters as well as managing gestures and their outcomes 
// (selecting letterBoxs, scoring, valid gestures, turning green/orange for valid/repeated words)
const Grid = () => {
  const [isSelected, setIsSelected] = useState<boolean[][]>(
    Array.from({ length: 5 }, () => Array(5).fill(false))
  );
  const [board, setBoard] = useState<string[][]>(make_rand_board(5));
  const [posx, setPosx] = useState<number>(0);
  const [posy, setPosy] = useState<number>(0);
  const [layout, setLayout] = useState<{x: number, y: number}>({x: 0, y: 0});
  const targetRef = React.useRef<View>(null);
  const lastSelectedRef = React.useRef<string>('');
  const [word, setWord] = useState<string>('');
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isWord, setIsWord] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(preTimer => preTimer + 1); 
    }, 1000)
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(timer>=80){
      router.replace(`/results?score=${score}`);
    }
  }, [timer, score]);

  /* const handlePanStart = (e: any) => {
    setPosx(e.absoluteX); 
    setPosy(e.absoluteY);
  } */
 /*  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      targetRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setLayout({x: pageX, y: pageY});
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []); */
  
  const panningButtons = (currentX: number, currentY: number) => {
    const relX = currentX - layout.x;
    const relY = currentY - layout.y; 
    
    for(let i = 0; i<5; i++){
      for(let j = 0; j<5; j++){
        if(!isSelected[i]![j]! && 53*i+20+5 < relY && relY < 53*i+53+20-5 && 53*j+20+5 < relX && relX < 53*j+53+20-5){
          const buttonKey = `${i}-${j}`;
          if(lastSelectedRef.current === buttonKey){ return;}
          if((parseInt(lastSelectedRef.current[0]) === i-1 && parseInt(lastSelectedRef.current[2]) === j) 
            || (parseInt(lastSelectedRef.current[0]) === i && parseInt(lastSelectedRef.current[2]) === j-1) 
            || (parseInt(lastSelectedRef.current[0]) === i+1 && parseInt(lastSelectedRef.current[2]) === j) 
            || (parseInt(lastSelectedRef.current[0]) === i && parseInt(lastSelectedRef.current[2]) === j+1) 
            || (parseInt(lastSelectedRef.current[0]) === i-1 && parseInt(lastSelectedRef.current[2]) === j-1) 
            || (parseInt(lastSelectedRef.current[0]) === i+1 && parseInt(lastSelectedRef.current[2]) === j+1) 
            || (parseInt(lastSelectedRef.current[0]) === i-1 && parseInt(lastSelectedRef.current[2]) === j+1) 
            || (parseInt(lastSelectedRef.current[0]) === i+1 && parseInt(lastSelectedRef.current[2]) === j-1)){
            lastSelectedRef.current = buttonKey;
            setIsSelected(prev => {
              const newSelected = prev.map(r => r.slice());
              newSelected[i]![j]! = !newSelected[i]![j]!;
              return newSelected;
            });
            const newWord = word + board[i]![j]!;
            setWord(newWord); 
            if(trie.isitWord(newWord, usedWords)){
              setIsWord(true);
            }
            else{
              setIsWord(false);
            }
          }
          return;
        }
      }
    }
  };
  
  /* const tapGesture = Gesture.Tap()
    .onBegin((e) => {
      const relX = e.absoluteX - layout.x;
      const relY = e.absoluteY - layout.y; 
      for(let i = 0; i<5; i++){
        for(let j = 0; j<5; j++){
          if(50*i+20 < relY && relY < 50*i+50+20 && 50*j+20 < relX && relX < 50*j+50+20){
            setWord(board[i]![j]!);
            lastSelectedRef.current = `${i}-${j}`;
            setIsSelected(prev => {
              const newSelected = prev.map(r => r.slice());
              newSelected[i]![j]! = true;
              return newSelected;
            });
          }
        }
      }
  }); 
    .onEnd((e) => {
      for(let i = 0; i<5; i++){
          for(let j = 0; j<5; j++){
            if(50*i+20 < relY && relY < 50*i+50+20 && 50*j+20 < relX && relX < 50*j+50+20){
              setIsSelected(prev => {
                const newSelected = prev.map(r => r.slice());
                newSelected[i]![j]! = false;
                return newSelected;
              });
            }
          }
        }
    });
  */

  const panGesture = Gesture.Pan()
    .minDistance(1)
    .runOnJS(true)
    .onStart((e) => {
      /* console.log('Pan begin:', {
        absoluteX: e.absoluteX,
        absoluteY: e.absoluteY,
        layout: layout,
        relX: e.absoluteX - layout?.x,
        relY: e.absoluteY - layout?.y,
    }); */
      /* handlePanStart(e); */
      const relX = e.absoluteX - layout.x;
      const relY = e.absoluteY - layout.y; 
      for(let i = 0; i<5; i++){
        for(let j = 0; j<5; j++){
          if(50*i+20 < relY && relY < 50*i+50+20 && 50*j+20 < relX && relX < 50*j+50+20){
            setWord(board[i]![j]!);
            lastSelectedRef.current = `${i}-${j}`;
            setIsSelected(prev => {
              const newSelected = prev.map(r => r.slice());
              newSelected[i]![j]! = true;
              return newSelected;
            });
          }
        }
      }
    })
    .onUpdate((e) => {
      panningButtons(e.absoluteX, e.absoluteY);
    })
    .onEnd((e) => {
      if(trie.isitWord(word, usedWords)){
        setUsedWords(prev => [...prev, word]);
        setScore(prev => prev + calculate_points(word));
      }
      lastSelectedRef.current = '';
      setIsSelected(prev => {
        const newSelected = prev.map(r => r.slice());
        for(let i = 0; i<5; i++){
          for(let j = 0; j<5; j++){
            newSelected[i]![j]! = false;
          }
        }
        return newSelected;
      });
      setWord('');
      setIsWord(false);
    });

  //const composed = Gesture.Exclusive(panGesture, tapGesture);
  return (
    <View style={styles.listGridWrapper}>
      <Text style={styles.titleText}>Word Hunt</Text>
      <View style={styles.wordListWrapper}>
        <Text style={styles.wordListTitle}>Word List</Text>
        <Timer timer={timer}/>
        <WordList board={board} usedWords={usedWords}/>
      </View>
    <View style={styles.gridWrapper}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.gridContainer} ref={targetRef}
        onLayout={() => {
          const timer = setTimeout(() => {
            targetRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setLayout({x: pageX, y: pageY});
          });
          }, 100);
    return () => clearTimeout(timer);
        }}
        >
        {board.map((row, key1) => (
          <View key={key1} style={styles.gridRow}>
            {row.map((tile, key2) => (
              <LetterBox 
                key={`${key1}-${key2}`}
                letter={tile.toUpperCase()}
                isSelected={isSelected[key1]![key2]!}
                isWord2={isWord && isSelected[key1]![key2]!}
                isWordBefore={!isWord && trie.isitWord(word, []) && isSelected[key1]![key2]!}
                onPressIn={() => {}}
                onPressOut={() => {}}
              />
            ))}
          </View>
        ))}
      </View>
      </GestureDetector>
      <Text style={styles.score}>Score: {score}</Text>
    </View>
    </View>
  );
};

export default function GameScreen() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Grid/>
    </GestureHandlerRootView> 
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c79a20',
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    margin: 2,
  },
  selected: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDDDDD',
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    margin: 2,
  },
  selectedCorrect: {
    backgroundColor: 'green',
  },
  selectedBefore: {
    backgroundColor: '#d77621',
  },
  score: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 20,
  },
  wordsInList: {
    fontSize: 10,
  },
  wordList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: 300,
  },
  wordListWrapper: {
    backgroundColor: '#2e7da782',
    padding: 10,
    borderWidth: 2,
    borderColor : '#2e34a4000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listGridWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  wordListTitle: {
    fontSize: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    fontWeight: '700',
    marginBottom: 3,
  },
  letterText: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  letterTextSelected: {
    color: 'black',
  },
  gridContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 300,
    borderWidth: 5,
    borderColor: 'black',
    backgroundColor: '#888888',
    padding: 10,
    borderRadius: 10,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
    width: '70%',
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  timerText: {
    fontSize: 14,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '500',
    marginBottom: 2,
  }
});
