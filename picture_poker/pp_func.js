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
var deck;
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

/***********************
 *
 *
 * 
 */

//Clear Function
function clear(container_name) {
    let cards = container_name.querySelectorAll('*');
    cards.forEach(card => {
        card.remove();
    })
    return;
}

//Value Function
function find_value_of_card(card) {
    for (let i = 0; i < ranks.size; i++) {
        if (ranks[i] === card.rank) return i;
    }
    return -1;
}

//Tally Score Function
function tally_score() {

}

//Unhide Function
function unhide_cards() {
    let hidden_cards = document.querySelectorAll(".hidden");
    hidden_cards.forEach(card => {
        card.classList.remove("hidden");
    })
    return;
}

//Sort Function (Bubble Sort)
function sort(container_name) {
    let card_array = []; //Card Array

    //Pushing Cards into the Array
    let cards = container_name.querySelectorAll('*');
    cards.forEach(card => {
        card_array.push(card);
    })

    //Bubble Sort
    for (let i = 0; i < 4; i++) {
        swap = false;
        for (let j = 0; j < 4 - i; j++) {
            let comparable1 = find_value_of_card(card_array[j]);
            let comparable2 = find_value_of_card(card_array[j+1]);
            if (comparable1 > comparable2) {
                [card_array[j], card_array[j+1]] = [card_array[j+1], card_array[j]]; //Swap
                swap = true;
            }
        }
        if (!(swap)) break; //Early Termination
    }
    clear(container_name);
    for (let k = 0; k < 5; k++) {
        console.log(card_array[k]);
    }

}

//Dealer Function
function dealer_plays() {
    /* Smart Selection Function here*/
    unhide_cards();
    
}


//Discard Card Function
function discard() {
    let selected_cards = document.querySelectorAll(".selected");
    selected_cards.forEach(card => {
        card.remove();
        THIS_HAND_COUNT--;
    })
    draw_cards(deck, THIS_HAND);
    sort(THIS_HAND);
    dealer_plays();
    return;
}

//Distribute Cards Function
function distribute() {
    draw_cards(deck, THIS_HAND);
    draw_cards(deck, OTHER_HAND);
    return;
}

//Start Function
function start() {
    deck = load_cards();
    distribute();
}
    