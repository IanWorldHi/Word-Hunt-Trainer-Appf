import React, {useLayoutEffect, useEffect, useState} from 'react'; 
import {Button, Text, View, StyleSheet, Pressable} from 'react-native';
import {TrieNode, build_trie, calculate_points, make_rand_board} from '../lib/wordhunallg';
import {GestureHandlerRootView, GestureDetector ,Gesture} from 'react-native-gesture-handler';

const trie: TrieNode = build_trie();

const Timer = () => {
  const [timer, setTimer] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(preTimer => preTimer + 1); 
    }, 1000)
    return () => clearInterval(interval);
  }, [])
  return (
    <Text>Time: {timer}</Text>
  )
}

type wordListProps = {
  board: string[][];
  usedWords: string[];
}

const WordList = (props: wordListProps) => {
  const [wordList, setWordList] = useState<string[]>(trie.solve_board(props.board, 5).flat().reverse()); 
  const filteredWords = wordList.filter(word => !props.usedWords.includes(word)).slice(0, 20);
  return (
    <View style={styles.wordList}> 
      {filteredWords.map((word, key) => (
        <View key={key}>{word}</View>
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

const Grid = () => {
  const [isSelected, setIsSelected] = useState<boolean[][]>(new Array(5).fill(new Array(5).fill(false)));
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

  const handlePanStart = (e: any) => {
    setPosx(e.absoluteX); 
    setPosy(e.absoluteY);
  }
  useLayoutEffect(() => {
    targetRef.current?.measure((x: number, y: number) => {
      setLayout({x, y});
    });
  }, []);
  
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
  
  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      handlePanStart(e);
      const relX = e.absoluteX - layout.x;
      const relY = e.absoluteY - layout.y; 
      for(let i = 0; i<5; i++){
        for(let j = 0; j<5; j++){
          if(50*i+20 < relY && relY < 50*i+50+20 && 50*j+20 < relX && relX < 50*j+50+20){
            setWord(board[i]![j]!);
            lastSelectedRef.current = `${i}-${j}`;
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

  return (
    <View style={styles.listGridWrapper}>
      <View style={styles.wordListWrapper}>
        <Text style={styles.wordListTitle}>Word List</Text>
        <Timer/>
        <WordList board={board} usedWords={usedWords}/>
      </View>
    <View style={styles.gridWrapper}>
      <Text style={styles.titleText}>Word Hunt</Text>
      <GestureDetector gesture={panGesture}>
        <View style={styles.gridContainer} ref={targetRef}>
        {board.map((row, key1) => (
          <View key={key1} style={styles.gridRow}>
            {row.map((tile, key2) => (
              <LetterBox 
                key={`${key1}-${key2}`}
                letter={tile.toUpperCase()}
                isSelected={isSelected[key1]![key2]!}
                isWord2={isWord && isSelected[key1]![key2]!}
                isWordBefore={!isWord && trie.isitWord(word, []) && isSelected[key1]![key2]!}
                onPressIn={() => {
                  setIsSelected(prev => { 
                    const newSelected = prev.map(r => r.slice());
                    newSelected[key1]![key2] = !newSelected[key1]![key2];
                    return newSelected;
                  });
                }}
                onPressOut={() => {
                  setIsSelected(prev => {
                    const newSelected = prev.map(r => r.slice());
                    newSelected[key1]![key2] = false;
                    return newSelected;
                  });
                }}
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
    <View style={{flex: 1}}>
      <Grid/>
    </View> 
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordListWrapper: {
    backgroundColor: '#2e7da782',
    padding: 10,
    borderWidth: 2,
    borderColor : '#2e34a4000',
    borderRadius: 10,
  },
  listGridWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  wordListTitle: {
    fontSize: 15,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  }
});
