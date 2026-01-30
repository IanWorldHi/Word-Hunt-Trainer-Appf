import React, {useLayoutEffect, useState} from 'react'; 
import {Button, Text, View, StyleSheet, Pressable} from 'react-native';  //uses JSX
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TrieNode, build_trie, calculate_points, make_rand_board} from '../lib/wordhunallg';
import {GestureHandlerRootView, GestureDetector ,Gesture} from 'react-native-gesture-handler';
//figure out where we build the trie and how to cache it


type letProp = {
  letter: string;
  isSelected: boolean;
  onPressIn: () => void;
  style?: any;
};

//what does removing safeareaprovider do?
const LetterBox = (props: letProp) => {
  return (
    <Pressable
      style={[styles.button, props.isSelected && styles.selected]}
      onPressIn={props.onPressIn}
    >
      <Text style={[styles.letterText, props.isSelected && styles.letterTextSelected]}>
        {props.letter}
      </Text> 
    </Pressable>
  );
};

//gonna have to change onPress, event handler?
//so actually grid would have a container for each row
const Grid = () => {
  const [isSelected, setIsSelected] = useState<boolean[][]>(new Array(5).fill(new Array(5).fill(false)));
  const [board, setBoard] = useState<string[][]>(make_rand_board(5));
  const [posx, setPosx] = useState<number>(0);
  const [posy, setPosy] = useState<number>(0);
  //const [layout, setLayout] = useState<{x: number, y: number, width: number, height: number}>({x: 0, y: 0, width: 0, height: 0});
  const [layout, setLayout] = useState<{x: number, y: number}>({x: 0, y: 0});
  const targetRef = React.useRef<View>(null);
  const lastSelectedRef = React.useRef<string>('');
  const [word, setWord] = useState<string>('');

  const handlePanStart = (e: any) => {
    setPosx(e.absoluteX); 
    setPosy(e.absoluteY);
  }
  useLayoutEffect(() => {
    targetRef.current?.measure((x: number, y: number) => {
      setLayout({x, y});
    });
  });
  
  //function getLetFromPos(x: number, y: number):  {}
  //naming convention?
  //i have to somehow turn off just tappping it or make a gesture for just a tap
  //will also have to fix diagnoals, maybe just make the hitboxes smaller
  //can maybe fix logic with just math
  const panningButtons = (currentX: number, currentY: number) => {
    const relX = currentX - layout.x;
    const relY = currentY - layout.y; 
    for(let i = 0; i<5; i++){
      for(let j = 0; j<5; j++){
        if(!isSelected[i]![j]! && 50*i+20 < relY && relY < 50*i+50+20 && 50*j+20 < relX && relX < 50*j+50+20){
          const buttonKey = `${i}-${j}`;
          if(lastSelectedRef.current !== buttonKey){
            lastSelectedRef.current = buttonKey;
            setIsSelected(prev => {
              const newSelected = prev.map(r => r.slice());
              newSelected[i]![j]! = !newSelected[i]![j]!;
              return newSelected;
            });
            setWord(word+board[i]![j]!); 
          }
          return;
        }
      }
    }
  }
  //function handlePressIn(x: number, y: number) {}


  //prob have to set some specifications to make it instantly register/respond
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
    });

  //what did safeareaprovider do again and does it break it lol
  return (
    <View style={styles.gridWrapper}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.gridContainer} ref={targetRef}>
        {board.map((row, key1) => (
          <View key={key1} style={styles.gridRow}>
            {row.map((tile, key2) => (
              <LetterBox 
                key={`${key1}-${key2}`}
                letter={tile.toUpperCase()}
                isSelected={isSelected[key1]![key2]!}
                onPressIn={() => {
                  setIsSelected(prev => {
                    const newSelected = prev.map(r => r.slice());
                    newSelected[key1]![key2] = !newSelected[key1]![key2];
                    return newSelected;
                  });
                }}
              />
            ))}
          </View>
        ))}
      </View>
      </GestureDetector>
      <Text>{layout.x}</Text>
      <Text>{layout.y}</Text>
      <Text>{posx}</Text>
      <Text>{posy}</Text>
      <Text>Current Word: {word}</Text>
    </View>
  );
};


const HelloWorlder = () => {
  return (
    <View style={{flex: 1}}>
      <Text style={styles.titleText}>Word Hunt</Text>
      <Grid/>
    </View> 
  );
};

export default HelloWorlder;

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






