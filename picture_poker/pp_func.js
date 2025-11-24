/* ======================================================================== *
 * Prologue Comments for pp_func.js                                         *
 * File Name: pp_func.js                                                    *
 * Author: Evan Zhuo                                                        *
 * EECS 581: Group 21 Project 3                                             *
 * ------------------------------------------------------------------------ *
 * Picture Poker Game Logic                                                 *
 * Inputs/Outputs                                                           *
 *  Inputs:     User Bet Increment | Card Select | Discard                  *
 *  Outputs:    Change in Currency Amount                                   *
 * ======================================================================== */

//Definitions

/* ============================================ *
 * Global Variables                             *
 * ============================================ */
//Hand Variables
const THIS_HAND = document.getElementById('bottom');
const OTHER_HAND = document.getElementById('top');
let THIS_HAND_COUNT = 0;
let OTHER_HAND_COUNT = 0;

//Deck Variables
var deck;
const ranks = ['S_CARD', 'A_CARD', 'B_CARD', 'C_CARD', 'D_CARD', 'F_CARD'];
const hands = ['FIVE_OF_A_KIND', 'FOUR_OF_A_KIND', 'FULL_HOUSE', 'THREE_OF_A_KIND', 'TWO_PAIR', 'PAIR', 'HIGH_CARD'];

//Button Variables
const DISCARD_BUTTON = document.getElementById('discard_button');

//Currency Variables
var BET_AMOUNT = 100;

/* ============================================ *
 * Classes                                      *
 * ============================================ */
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



/* ============================================ *
 * Deck Functions                               *
 * ============================================ */

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




/* ============================================ *
 * Hand Functions                               *
 * ============================================ */

//Second Pair Search Function
function find_second_pair(count_array, LARGEST_COUNT_INDEX) {
    for (let i = 0; i < count_array.length; i++) {
        if (count_array[i] == 2 && !(i == LARGEST_COUNT_INDEX)) return true;
    }
    return false;
}

//Fit Hands Function
function fit_hands(count_array, LARGEST_COUNT, LARGEST_COUNT_INDEX) {
    //Find the highest hand
    switch (LARGEST_COUNT) {
        case 1: return hands[6];    //High Card
        case 2:                     //Pair or Two Pair
            if (find_second_pair(count_array, LARGEST_COUNT_INDEX)) return hands[4];
            else return hands[5];
        case 3:                     //Three of a Kind or Full House
            if (find_second_pair(count_array, LARGEST_COUNT_INDEX)) return hands[2];
            else return hands[3];
        case 4: return hands[1];    //Four of a Kind
        case 5: return hands[0];    //Five of a Kind
        default: return hands[6];   //High Card (Default)
    }
}

//Find Largest Count Function
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

//Count Card Type Amount Function
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



/* ============================================ *
 * Find Functions                               *
 * ============================================ */

//Hand Value Search Function
function find_hand_value(hand_name) {
    return hands.indexOf(hand_name);
}

//Rank Value Search Function (RANK NAME)
function find_rank_value(rank_name) {
    return ranks.indexOf(rank_name);
}

//Rank Value Search Function (CARD)
function find_value_of_card(card) {
    const rank = card.getAttribute('id');
    return ranks.indexOf(rank);
}



/* ============================================ *
 * Container Functions                          *
 * ============================================ */

//Clear Value Function
function clear_value(container_name) {
    if (container_name == THIS_HAND) THIS_HAND_COUNT = 0;
    else OTHER_HAND_COUNT = 0;
    return;
}

//Clear Function
function clear(container_name) {
    let cards = container_name.querySelectorAll('*');
    cards.forEach(card => {
        card.remove();
    })
    clear_value(container_name);
    return;
}

//Create Card Array Function
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



/* ============================================ *
 * Comparison Second Pair Function              *
 * ============================================ */

//Compare Second Hand Function
function compare_second_hand(array_data) {
    let = second_pair_rank = -1;
    for (let i = array_data.size - 1; i >= 0; i--) {
        if (array_data[i] == 2) {
            second_pair_rank = i;
            break;
        }
    }
    console.log(second_pair_rank);
    return second_pair_rank;
}



/* ============================================ *
 * Sort Function                                *
 * ============================================ */

//Array Move Back Function
function array_move_back_one(array) {}

//Sort Function
function sort() {
    //Local Variables
    var sorted_THIS_HAND = [];
    var sorted_OTHER_HAND = [];
    let data_THIS = check_hand(THIS_HAND);
    let data_OTHER = check_hand(OTHER_HAND);

    //Sort by Rank (THIS_HAND)
    for (let i = 0; i < 6; i++) {
        let cards = THIS_HAND.querySelectorAll(`#${ranks[i]}`);
        cards.forEach(card => {
            sorted_THIS_HAND.push(card);
        })
    }

    //Sort by Rank (OTHER_HAND)
    for (let i = 0; i < 6; i++) {
        let cards = OTHER_HAND.querySelectorAll(`#${ranks[i]}`);
        cards.forEach(card => {
            sorted_OTHER_HAND.push(card);
        })
    }

    //Redistribute Sorted Hand (THIS_HAND)
    clear(THIS_HAND);
    for (let i = 0; i < 5; i++) {
        sorted_THIS_HAND.forEach(card => THIS_HAND.appendChild(card));
        THIS_HAND_COUNT++;
    }

    //Redistribute Sorted Hand (OTHER_HAND)
    clear(OTHER_HAND);
    for (let i = 0; i < 5; i++) {
        sorted_OTHER_HAND.forEach(card => OTHER_HAND.appendChild(card));
        OTHER_HAND_COUNT++;
    }

    console.log(sorted_THIS_HAND);

}



/* ============================================ *
 * Minor Functions                              *
 * ============================================ */

//Unhide Function
function unhide_cards() {
    let hidden_cards = document.querySelectorAll(".hidden");
    hidden_cards.forEach(card => {
        card.classList.remove("hidden");
    })
    return;
}

//Remove EventListener Function
function remove_event_listener() {
    let cards = THIS_HAND.querySelectorAll('*');
    cards.forEach(card => {
        card.removeEventListener("click", () => card.select_toggle());
    })
    return;
}

//Distribute Cards Function
function distribute() {
    draw_cards(deck, THIS_HAND);
    draw_cards(deck, OTHER_HAND);
    return;
}

//New Round Function
function new_round() {
    //Clear Board
    clear(THIS_HAND);
    clear(OTHER_HAND);

    distribute();
    DISCARD_BUTTON.disabled = false;
    return;
}

//Compare Function
function compare_hands(this_data, other_data) {
    //Local Variables
    let THIS_HAND_VALUE = find_hand_value(this_data[1]);
    let THIS_HAND_RANK = find_rank_value(this_data[2]);
    let OTHER_HAND_VALUE = find_hand_value(other_data[1]);
    let OTHER_HAND_RANK = find_rank_value(other_data[2]);

    //Compare Hands
    if (THIS_HAND_VALUE < OTHER_HAND_VALUE) return 'WIN';
    else if (THIS_HAND_VALUE > OTHER_HAND_VALUE) return 'LOSE';

    //Compare Weight (OTHERS)
    else if (THIS_HAND_RANK < OTHER_HAND_RANK) return 'WIN';
    else if (THIS_HAND_RANK > OTHER_HAND_RANK) return 'LOSE';

    //Compare Weight (FULL HOUSE & TWO PAIR)
    else if (compare_second_hand(this_data[0]) < compare_second_hand(other_data[0])) return 'WIN';
    else if (compare_second_hand(this_data[0]) > compare_second_hand(other_data[0])) return 'LOSE';
    
    else return 'TIE';
}

//Smart Dealer Function
function dealer_plays() {
    //Local Variable
    let data = check_hand(OTHER_HAND);

    //Check Hand & Discard Accordingly
    if (data[1] == hands[0] || data[1] == hands[2]) return; //Do Nothing if FIVE_OF_A_KIND or FULL_HOUSE
    else if (data[1] == hands[1] || data[1] == hands[4]) { //DISCARD ONE CARD IF FOUR_OF_A_KIND or TWO PAIRS
        for (let i = 5; i >= 0; i--) {
            if (data[0][i] == 1) {
                let delete_card = OTHER_HAND.querySelectorAll(`#${ranks[i]}`);
                delete_card[0].remove();
                OTHER_HAND_COUNT--;
                break;
            }
        }

    } else if (data[1] == hands[3]) { //DISCARD TWO CARDS IF THREE_OF_A_KIND
        for (let i = 5; i >= 0; i--) {
            if (data[0][i] == 1) {
                let delete_card = OTHER_HAND.querySelectorAll(`#${ranks[i]}`);
                delete_card[0].remove();
                OTHER_HAND_COUNT--;
            }
        }

    } else { //DISCARD THREE CARDS IF PAIR or HIGH CARD
        let counter = 0;
        for (let i = 5; i >= 0; i--) {
            if (counter == 3) break;
            if (data[0][i] == 1) {
                let delete_card = OTHER_HAND.querySelectorAll(`#${ranks[i]}`);
                delete_card[0].remove();
                OTHER_HAND_COUNT--;
                counter++;
            }
        }
    }
    return;
}



/* ============================================ *
 * Turn-Related Functions                       *
 * ============================================ */

//Turn (Refill Deck & Clear Hands & Distribute Cards) Function
function finish_turn() {
    //Refill Deck
    if (deck.size() < 16) {
        deck = load_cards();
    }

    new_round();
    console.log(deck.size());
    
}

//Turn (Dealer Plays & Hands Comparision & Currency Distributed) Function
function continue_turn() {
    //Dealer Plays
    dealer_plays();
    draw_cards(deck, OTHER_HAND);

    //Create Data
    let this_data = check_hand(THIS_HAND);
    let other_data = check_hand(OTHER_HAND);
    console.log(this_data, other_data);

    //Sort Hands
    sort();

    //Show Results
    unhide_cards();
    var GAME_RESULT = compare_hands(this_data, other_data); //GAME_RESULT -> WIN | LOSE | DRAW

    if (GAME_RESULT == 'WIN') {
        GoonCoin += BET_AMOUNT;
        updateBalance();
        console.log("winner");
    } else if (GAME_RESULT == 'LOSE') {
        GoonCoin -= BET_AMOUNT;
        updateBalance();
        console.log("loser");
    } else console.log("draw");    

    setTimeout(finish_turn, 3000); //3 Second Delay
}

//Turn (Discard Card) Function
function discard() { //start_turn Function
    if (currency_check()) {
        let selected_cards = document.querySelectorAll(".selected");
        selected_cards.forEach(card => {
            card.remove();
            THIS_HAND_COUNT--;
        })

        remove_event_listener(); //FIX THIS
        DISCARD_BUTTON.disabled = true;   

        draw_cards(deck, THIS_HAND);
        continue_turn();
    } else {
        alert(`You must have at least \n\t$${BET_AMOUNT}\nin order to play Picture Poker!`);
    }
    return;
}

//Valid Currency Function
function currency_check() {
    if (GoonCoin - BET_AMOUNT < 0) return false;
    else return true;
}

//Start Function
function start() {
    deck = load_cards();
    distribute();
}

/* ============================================ *
 * Picture Poker Currency Functions             *
 * ============================================ */

//Update Currency Function
function updateBalance() { 
  document.getElementById("balance").textContent = GoonCoin; 
  saveGoonCoin(); 
}

//Bank Load Currency On-Start Up Function
window.addEventListener("DOMContentLoaded", () => {
    let balanceDisplay = document.getElementById("balance");
    balanceDisplay.textContent = GoonCoin; 
});
    