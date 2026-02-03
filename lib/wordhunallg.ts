// fix modules
//import * as fs from 'fs';
import words from './words_dictionary.json';
const lines: string[] = Object.keys(words);

//import trieJson from './preBuiltTrie.json';

// this is node.js wont work
//gotta fix the file reading, modules etc
//const filePath: string = 'app/words_alpha.txt';
//const contents: string = fs.readFileSync(filePath, 'utf-8'); //for node.js
//const lines: string[] = contents.split('\n');

// Need a function to manage check words when user is swiping
// figure out tsx modules or wtv
export class TrieNode {
    public text: string;
    public children: Map<string, TrieNode>;
    public isWord: boolean;
    constructor(text: string, isWord: boolean = false) {
        this.text = text;
        this.isWord = isWord;
        this.children = new Map<string, TrieNode>();
    }
    /* toString(): string {
        return `${this.children}`;
    } */
    public insert_word(word: string): void {
        let cha: string;
        let this2: TrieNode = this;
        for (let i = 0; i<word.length; i++){
            cha = word.charAt(i);
            if(!this2.children.has(cha)){
                this2.children.set(cha, new TrieNode(this2.text + cha))
            }
            this2 = this2.children.get(cha)!;
        }
        this2.isWord = true;
    }
    private word_finder(board: string[][], visited: boolean[][], words: string[][], x: number, y: number, lent: number, size: number): string[][] {
        // dunno if this is best/solid practice
        visited[x]![y] = true;
        if(lent-2 > words.length){
            words.push([]);
        }
        if(this.isWord && lent>=3 && words[lent-3]!.includes(this.text) === false){
            words[lent-3]!.push(this.text);
        }
        let curr: TrieNode = this;
        if(x>0 && !visited[x-1]![y]! && curr.children.has(board[x-1]![y]!)){
            curr = curr.children.get(board[x-1]![y]!)!;
            words = curr.word_finder(board, visited, words, x-1, y, lent+1, size);
            curr = this;
        }
        if(x<size-1 && !visited[x+1]![y]! && curr.children.has(board[x+1]![y]!)){
            curr = curr.children.get(board[x+1]![y]!)!;
            words = curr.word_finder(board, visited, words, x+1, y, lent+1, size);
            curr = this;
        }
        if(y>0 && !visited[x]![y-1]! && curr.children.has(board[x]![y-1]!)){
            curr = curr.children.get(board[x]![y-1]!)!;
            words = curr.word_finder(board, visited, words, x, y-1, lent+1, size);
            curr = this;
        }
        if(y<size-1 && !visited[x]![y+1]! && curr.children.has(board[x]![y+1]!)){
            curr = curr.children.get(board[x]![y+1]!)!;
            words = curr.word_finder(board, visited, words, x, y+1, lent+1, size);
            curr = this;
        }
        if(x>0 && y>0 && !visited[x-1]![y-1]! && curr.children.has(board[x-1]![y-1]!)){
            curr = curr.children.get(board[x-1]![y-1]!)!;
            words = curr.word_finder(board, visited, words, x-1, y-1, lent+1, size);
            curr = this;
        }
        if(x>0 && y<size-1 && !visited[x-1]![y+1]! && curr.children.has(board[x-1]![y+1]!)){
            curr = curr.children.get(board[x-1]![y+1]!)!;
            words = curr.word_finder(board, visited, words, x-1, y+1, lent+1, size);
            curr = this;
        }
        if(x<size-1 && y>0 && !visited[x+1]![y-1]! && curr.children.has(board[x+1]![y-1]!)){
            curr = curr.children.get(board[x+1]![y-1]!)!;
            words = curr.word_finder(board, visited, words, x+1, y-1, lent+1, size);
            curr = this;
        }
        if(x<size-1 && y<size-1 && !visited[x+1]![y+1]! && curr.children.has(board[x+1]![y+1]!)){
            curr = curr.children.get(board[x+1]![y+1]!)!;
            words = curr.word_finder(board, visited, words, x+1, y+1, lent+1, size);
            curr = this;
        }
        visited[x]![y] = false;
        return words;
    }
    public isitWord(word: string, used: string[]): boolean {
        if(used.includes(word)){
            return false;
        }
        if(word.length <3){
            return false;
        }
        let t2: TrieNode = this;
        for(let i = 0; i<word.length; i++){
            if(t2.children.has(word.charAt(i))){
                t2 = t2.children.get(word.charAt(i))!;
            }
            else{
                return false;
            }
        }
        return t2.isWord;
    }
    public solve_board(board: string[][], size: number): string[][] {
        let result: string[][] = [];
        let visited: boolean[][];
        let trie2: TrieNode;
        for(let i = 0; i<size; i++){
            for(let j = 0; j<size; j++){
                trie2 = this.children.get(board[i]![j]!)!;
                //review this syntax below
                visited = Array.from({ length: size }, () => Array(size).fill(false));
                result = trie2.word_finder(board, visited, result, i, j, 1, size);
            }
        }
        return result;
    }
}


export function build_trie(): TrieNode{
    let root: TrieNode = new TrieNode('');
    for (let line of lines) {
        root.insert_word(line.trim());
    }
    return root;
} 

/* export function jsonToTrie(): TrieNode{
    let root: TrieNode = new TrieNode('');
    for(let i = 0; i<trieJson["children"].length; i++){

    }
} */

export function make_rand_board(size: number): string[][] {
    let board: string[][] = [];
    for (let i = 0; i < size; i++) {
        board.push([]);
        for (let j = 0; j < size; j++) {
            board[i]!.push(rand_word_gen());
        }
    }
    return board;
}

function rand_word_gen(): string {
    const letters: string = 'abcdefghijklmnopqrstuvwxyz';
    const randInt: number = Math.floor(Math.random()*letters.length);
    return letters.charAt(randInt);
}

export function calculate_points(word: string): number {
    if(word.length <3){
        return 0;        
    }
    else if(word.length === 3){
        return 100;
    }
    else{
        return 200*2*(word.length-3);
    }
}
