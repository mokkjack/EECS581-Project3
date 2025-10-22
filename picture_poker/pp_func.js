//pp_func.js

/* EECS 581: Group 21 Project 3
 * The JavaScript Section for Picture Poker
 * of Codesino.
 */

//6 RANKS ||| S > A > B > C > D > F

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
            return "Empty Stack";
        }
        return this.elements.pop();
    }

    peek() { //Peek Method
        if (this.isEmpty()) {
            return "Empty Stack";
        }
        return this.elements[this.elements.length - 1];
    }

    isEmpty() { //IsEmpty Method
        return this.elements.length === 0;
    }

    size() { //Size Method
        return this.elements.length;
    }
}


function start() {}