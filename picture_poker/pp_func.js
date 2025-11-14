//pp_func.js

/* EECS 581: Group 21 Project 3
 * The JavaScript Section for Picture Poker
 * of Codesino.
 */

//Definitions

// --------- Global Variables ---------
const THIS_HAND = document.getElementById('bottom');
const OTHER_HAND = document.getElementById('top');
let THIS_HAND_COUNT = 0;
let OTHER_HAND_COUNT = 0;
let PLAYING = false;
let NEXT_PHASE = false;
var deck;
const ranks = ['S_CARD', 'A_CARD', 'B_CARD', 'C_CARD', 'D_CARD', 'F_CARD'];
const hands = ['FIVE_OF_A_KIND', 'FOUR_OF_A_KIND', 'FULL_HOUSE', 'THREE_OF_A_KIND', 'TWO_PAIR', 'PAIR', 'HIGH_CARD'];

// --------- Stack Data Structure (Array Implementation) ---------
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

// --------- Card Class ---------
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

/************************************
 * Picture Poker Helper Functions   *
 *                                  *
 ************************************/

//Create Card Array Function [HELPER]
function create_card_array(container_name) {
    //Local Variable
    var card_array = [];

    //Collect Cards from Container
    let cards = container_name.querySelectorAll('*');
    cards.forEach(card => {
        card_array.push(card);
    })
    return card_array
}

//Second Pair Search Function [HELPER]
function find_second_pair(count_array, LARGEST_COUNT_INDEX) {
    for (let i = 0; i < count_array.length; i++) {
        if (count_array[i] == 2 && !(i == LARGEST_COUNT_INDEX)) return true;
    }
    return false;
}

//Fit Hands Function [HELPER]
function fit_hands(count_array, LARGEST_COUNT, LARGEST_COUNT_INDEX) {
    //Find the highest hand
    switch (LARGEST_COUNT) {
        case 1: return hands[6];
        case 2: 
            if (find_second_pair(count_array, LARGEST_COUNT_INDEX)) return hands[4];
            else return hands[5];
        case 3:
            if (find_second_pair(count_array, LARGEST_COUNT_INDEX)) return hands[2];
            else return hands[3];
        case 4: return hands[1];
        case 5: return hands[0];
        default: return hands[6];
    }
}

//Find Largest Count Function [HELPER]
function find_largest_count(count_array) {
    //Local Variables
    var hand_info = [];
    hand_info.length = 2;
    var LARGEST_COUNT = -1;
    var LARGEST_COUNT_INDEX = -1;

    //
    for (let i = 0; i < count_array.length; i++) {
        if (count_array[i] > LARGEST_COUNT) {
            LARGEST_COUNT = count_array[i];
            LARGEST_COUNT_INDEX = i;
        }
    }
    let current_hand = fit_hands(count_array, LARGEST_COUNT, LARGEST_COUNT_INDEX);
    let weight = ranks[LARGEST_COUNT_INDEX];
    hand_info[0] = current_hand;
    hand_info[1] = weight;
    return hand_info;
}

//Count Card Type Amount Function [HELPER]
function count_card(card_array) {
    //Create Card Rank Count Array
    let rank_count_array = [];
    rank_count_array.length = 6;

    //
    for (let i = 0; i < 6; i++) {
        let count = 0;
        for (let j = 0; j < card_array.length; j++) {
            if (card_array[j].id == ranks[i]) count++;
        }
    rank_count_array[i] = count;
    }
    return rank_count_array;
}

/************************
 * Main Game Functions
 * 
 ************************/

//Get Hand Information Function
function check_hand(container_name) {
    let hand_info = [];
    hand_info.length = 3;

    let card_array = create_card_array(container_name);
    let count_array = count_card(card_array);
    let current_hand = find_largest_count(count_array);

    hand_info[0] = count_array;
    hand_info[1] = current_hand[0];
    hand_info[2] = current_hand[1];

    return hand_info;

}

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
    const rank = card.getAttribute('id');
    return ranks.indexOf(rank);
}

//Unhide Function
function unhide_cards() {
    let hidden_cards = document.querySelectorAll(".hidden");
    hidden_cards.forEach(card => {
        card.classList.remove("hidden");
    })
    return;
}

/*
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

    //Clear & Place Sorted Hand
    clear(container_name);
    for (let k = 0; k < 5; k++) {
        card_array.forEach(card => container_name.appendChild(card));
    }

}
*/

//Distribute Cards Function
function distribute() {
    draw_cards(deck, THIS_HAND);
    draw_cards(deck, OTHER_HAND);
    return;
}

//
function compare_hands(this_data, other_data) {

}

//Smart Dealer Function
function dealer_plays() {
    /* Smart Selection Function here*/
  
}

//Finish Turn Function
function finish_turn() {
    clear(THIS_HAND);
    clear(OTHER_HAND);
    console.log(deck.peek());
    distribute();
}

//Turn Continuation Function
function continue_turn() {
    let this_data = check_hand(THIS_HAND);
    let other_data = check_hand(OTHER_HAND);
    unhide_cards();
    console.log(this_data, other_data);
    finish_turn();

}

//Discard Card Function
function discard() {
    let selected_cards = document.querySelectorAll(".selected");
    selected_cards.forEach(card => {
        card.remove();
        THIS_HAND_COUNT--;
    })
    draw_cards(deck, THIS_HAND);
    continue_turn();
    return;
}

//Start Function
function start() {
    deck = load_cards();
    distribute();
    
}
    