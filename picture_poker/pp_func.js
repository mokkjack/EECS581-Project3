//pp_func.js

/* EECS 581: Group 21 Project 3
 * The JavaScript Section for Picture Poker
 * of Codesino.
 */

//Definitions

//Global Variables
const THIS_HAND = document.getElementById('bottom');
const OTHER_HAND = document.getElementById('top');
let THIS_HAND_COUNT = 0;
let OTHER_HAND_COUNT = 0;
let PLAYING = false;
let NEXT_PHASE = false;
const ranks = ['S_CARD', 'A_CARD', 'B_CARD', 'C_CARD', 'D_CARD', 'F_CARD'];

//Stack Data Structure (Array Implementation) 
//Used GeeksforGeeks for array implementation idea
class Stack {
    constructor() { //Construct Stack Array
        this.elements = [];
    }

    //Stack Methods
    push(entry) { //Push Method
        this.elements.push(entry);
        return;
    }
    pop() { //Pop Method
        if (this.isEmpty()) {
            console.log("Empty Stack");
            return;
        }
        return this.elements.pop();
    }
    peek() { //Peek Method
        if (this.isEmpty()) {
            console.log("Empty Stack");
            return;
        }
        return this.elements[this.elements.length - 1];
    }
    isEmpty() { //IsEmpty Method
        return this.elements.length === 0;
    }
    size() { //Size Method
        return this.elements.length;
    }
    shuffle() { //Shuffle Method
        for (let i = 0; i < 60; i++) {
            let other = random_number_generator();
            [this.elements[i], this.elements[other]] = [this.elements[other], this.elements[i]];
        }
        return;
    }
}

//Card Class
class Card {
    constructor(rank) { //Create Card & Set Type
        this.rank = rank;
        this.selected = false;

        //HTML Object Creation
        this.object = document.createElement("div");
        this.object.id = this.rank;
        this.object.classList.add("card");
    }

    //Card Methods
    read() { //Read Method
        return this.rank;
    }
    select() { //Select Method
        this.object.classList.add("selected");
        this.selected = true;
        return;
    }
    deselect() { //Deselect Method
        this.object.classList.remove("selected");
        this.selected = false;
        return;
    }
    select_toggle() { //Switch Select Method
        this.selected ? this.deselect() : this.select();
        return;
    }
    display(container_name) { //Display Method
        //HTML Object Manipulation
        if (container_name == THIS_HAND) { //User Cards
            this.object.classList.add("user");            
            this.object.addEventListener("click", () => this.select_toggle()); //HTML Click Listener
            container_name.appendChild(this.object);

        } else { //Dealer Cards
            this.object.classList.add("hidden"); 
            container_name.appendChild(this.object);
        }
        return;
    }
}

//Random Number Function
function random_number_generator() {
    let rng_value = Math.floor(Math.random() * 60);
    return rng_value;
}

//Draw Cards Function
function draw_cards(deck, container_name) {
    if (container_name == THIS_HAND) {
        for (THIS_HAND_COUNT; THIS_HAND_COUNT < 5; THIS_HAND_COUNT++) {
            deck.pop().display(container_name);
        }

    } else {
        for (OTHER_HAND_COUNT; OTHER_HAND_COUNT < 5; OTHER_HAND_COUNT++) {
            deck.pop().display(container_name);
        }
    }
    return;
}

//Discard Card Function
function discard() {
    let selected_cards = document.querySelectorAll(".selected");
    selected_cards.forEach(card => {
        card.remove();
        THIS_HAND_COUNT--;
    })
    return;
}

//Load Card Function
function load_cards() {
    //Create a Card Stack
    let card_stack = new Stack();
    //Creating 10 of each Card Type
    for (let i = 0; i < ranks.length; i++) {
        for (let j = 0; j < 10; j++) {
            let card = new Card(ranks[i]);
            card_stack.push(card);
        }
    }
    card_stack.shuffle();
    return card_stack;
}

/* THIS TURN
 * BET => DISCARD
 * DRAW
 * OTHER TURN
 * OTHER DISCARD
 * COMPARE
 */

function switch_turn(deck, turn) {
    turn ? turn = false : turn = true;
    return turn;
}

function other_turn(deck) {

}

function this_turn(deck) {

}

//Start Function
function start() {
    let deck = load_cards();
    draw_cards(deck, THIS_HAND);
    draw_cards(deck, OTHER_HAND);

    this_turn(deck);

}
    