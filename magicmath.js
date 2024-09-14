/******************************************************************************************************************************

 ** Name:   Tej Singh and Leo Yudelson
 ** Date:   5 / 8 / 2023
 
******************************************************************************************************************************/

let firstNum = secondNum = num1 = num2 = num3 = num4 = goal = wins = loses = 0;
let formula = operator = "";
let prompt = -1;
let gameEnded = false;

/* Runs the domLoaded function when the DOM content is loaded */
window.addEventListener("DOMContentLoaded", domLoaded);

/******************************************************************************************************************************

 ** Function: domLoaded
 ** Description: Adds event listeners to the buttons and starts a new game.
 ** Parameters: NA
 ** Pre-Conditions: The DOM is loaded.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function domLoaded() {

    /* Gets list of number and operator buttons */
    const numButtons = getNumButtons();
    const opButtons = getOpButtons();

    /* Starts a new game on load */
    newGame();
    
    /* Adds event listeners to the new game and reset button */
	document.getElementById("newGameButton").addEventListener("click", newGame);
    document.getElementById("resetButton").addEventListener("click", reset);

    /* Adds event listeners to the number buttons */
	for (let numButton of numButtons) {
 
        numButton.addEventListener("click",  function () { numberClicked(numButton); });
	}
 
    /* Adds event listeners to the operator buttons */
    for (let opButton of opButtons) {
    
        opButton.addEventListener("click",  function () { operatorClicked(opButton); });
	}
}

/******************************************************************************************************************************

 ** Function: newGame
 ** Description: Creates a new game.
 ** Parameters: NA
 ** Pre-Conditions: DOM is loaded or new game button is pressed.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function newGame() {

    const numButtons = getNumButtons();
    let nums = [];
    let index1 = index2 = randNum1 = randNum2 = operator = 0;
    let solution = "";
    prompt = -1;
    
    /* Gets 4 random numbers and assigns them to each number button */
    for (i = 0; i < 4; i++) {
    
        nums[i] = Math.floor(Math.random() * 10);
        numButtons[i].innerHTML = nums[i];
        numButtons[i].removeAttribute("disabled");        
        numButtons[i].style.fontSize = "100pt";
        numButtons[i].style.paddingTop = "0px";
    
        /* Adds previosuly removed buttons back */
        if (numButtons[i].id === "removed") {
        
            numButtons[i].removeAttribute("id");
        }
    }
    
    /* Keeps track of starting 4 numbers */
    num1 = nums[0];
    num2 = nums[1];
    num3 = nums[2];
    num4 = nums[3];
    
    /* Loop until nums array only has 1 element */
    do {
    
        /* Assign index1 and index2 to random numbers within range of nums array without having them be the same */
        do {
        
            index1 = Math.floor(Math.random() * nums.length);
            index2 = Math.floor(Math.random() * nums.length);
                     
        } while (index1 === index2);
        
        /* Gets 2 random numbers from the nums array and gets a random operator */
        randNum1 = nums[index1];
        randNum2 = nums[index2];
        operator = Math.floor(Math.random() * 3);
        
        /* Removes randomly selected numbers from the nums array */
        nums.splice(nums.indexOf(randNum1), 1);
        nums.splice(nums.indexOf(randNum2), 1);
        
        /* Adds the sum of the two random numbers back to the nums array and adjusts the solution accordingly */
        if (operator === 0) {
        
            nums.push(randNum1 + randNum2);
            solution += randNum1 + " + " + randNum2 + " = " + add(randNum1, randNum2) + "<br>";
        
        /* Adds the difference of the two random numbers back to the nums array and adjusts the solution accordingly */
        } else if (operator === 1) {
        
            nums.push(randNum1 - randNum2);
            solution += randNum1 + " - " + randNum2 + " = " + subtract(randNum1, randNum2) + "<br>";
        
        /* Adds the product of the two random numbers back to the nums array and adjusts the solution accordingly */
        } else {
        
            nums.push(randNum1 * randNum2);
            solution += randNum1 + " * " + randNum2 + " = " + multiply(randNum1, randNum2) + "<br>";  
        }
        
    } while (nums.length > 1);
    
    /* Assigns goal to the only element in nums array and displays the goal */
    goal = nums[0];
    document.getElementById("goal").innerHTML = "Goal: " + goal;
    
    /* Empties the formula string and changes the color to black */
    document.getElementById("formulas").innerHTML = "";
    document.getElementById("formulas").style.color = "black";
    
    /* Chnages the solution string and hides it from the user */
    document.getElementById("solution").innerHTML = solution;
    document.getElementById("solution").style.display = "none";
    
    /* Changes game prompt color to black */
    document.getElementById("gamePrompt").style.color = "black";
    
    /* Remove firstNum id from any element with that property */
    if (document.getElementById("firstNum") !== null) {
    
        document.getElementById("firstNum").removeAttribute("id", "firstNum");
    }
    
    /* Remove secondNum id from any element with that property */
    if (document.getElementById("secondNum") !== null) {
    
        document.getElementById("secondNum").removeAttribute("id", "secondNum");
    }

    /* Sets gameEnded to false and prompts for the first number */
    gameEnded = false;
    switchPrompt();
}

/******************************************************************************************************************************

 ** Function: numberClicked
 ** Description: Assigns the first and second button with their respective ids, updates work area, and switchs the prompt.
 ** Parameters: numButton element
 ** Pre-Conditions: The DOM is loaded or the function is called.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function numberClicked(numButton) {

    /* Records the number clicked as the first number */
    if (prompt === 0) {
    
        firstNum = numButton.innerHTML;
        numButton.setAttribute("id", "firstNum");
    
    /* Records the number clicked as the second number */
    } else if (prompt === 2) {
    
        secondNum = numButton.innerHTML;
        numButton.setAttribute("id", "secondNum");
    }

    /* Adds the number clicked to the users formula in the work area and switchs the prompt */
    updateWorkArea(numButton.innerHTML);
    switchPrompt();
}

/******************************************************************************************************************************

 ** Function: operatorClicked
 ** Description: Records the operator being clicked and adds it to the work area. Also switchs prompt.
 ** Parameters: opButton element
 ** Pre-Conditions: The DOM is loaded or the function is called.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function operatorClicked(opButton) {

    /* Assigns operator string to the operator clicked and adds it to the users formula in the work area and switchs the prompt */
    operator = opButton.innerHTML;
    updateWorkArea(" " + opButton.innerHTML + " ");
    switchPrompt();
}

/******************************************************************************************************************************

 ** Function: promptOperator
 ** Description: Disables number buttons, enables operator buttons, and changes the game's prompt.
 ** Parameters: NA
 ** Pre-Conditions: The user has clicked a number button.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function promptOperator() {

    /* Gets number and operator buttons as separate lists */
    const numButtons = getNumButtons();
    const opButtons = getOpButtons();
    
    /* Disables all number buttons */
    for (let numButton of numButtons) {
    
        numButton.setAttribute("disabled", "true");
    }
    
    /* Enables all operator buttons */
    for (let opButton of opButtons) {
    
        opButton.removeAttribute("disabled");
    }
    
    /* Prompts the user to select an operator */
    document.getElementById("gamePrompt").innerHTML = "Pick an operator...";
}

/******************************************************************************************************************************

 ** Function: promptNumber
 ** Description: Disables operator buttons, enables number buttons, and changes the game's prompt.
 ** Parameters: NA
 ** Pre-Conditions: The user has clicked an operator button.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function promptNumber() {

    /* Gets number and operator buttons as separate lists */
    const opButtons = getOpButtons();
    const numButtons = getNumButtons();
    
    /* Disables all operator buttons */
    for (let opButton of opButtons) {
    
        opButton.setAttribute("disabled", "true");
    }
    
    /* Enables all number buttons */
    for (let numButton of numButtons) {
    
        if (numButton.id !== "removed") {
        
            numButton.removeAttribute("disabled");
        }
    }
    
    /* Prompts the user to select a number */
    document.getElementById("gamePrompt").innerHTML = "Pick a number...";
}

/******************************************************************************************************************************

 ** Function: updateWorkArea
 ** Description: Disables operator buttons, enables number buttons, and changes the game's prompt.
 ** Parameters: formulaToAdd string
 ** Pre-Conditions: The user has clicked a number or operator button.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function updateWorkArea(formulaToAdd) {

    /* Adds to the user's formula in the work area */
    document.getElementById("formulas").innerHTML += formulaToAdd;
}

/******************************************************************************************************************************

 ** Function: switchPrompt
 ** Description: Controls whether to prompt for a number or an operator.
 ** Parameters: NA
 ** Pre-Conditions: gameEnded === false
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function switchPrompt() {

    /* Only switches the prompt if the game has not ended */
    if (gameEnded === false) {
        
        prompt++;
        
        /* Prompt for a number if the prompt is divisible by 2 */
        if (prompt % 2 === 0) {
        
            promptNumber();
            
            /* Prevents the user from selecting the first number they clicked again */
            if (prompt === 2) {
            
                document.getElementById("firstNum").setAttribute("disabled", "true");
            }
        
        /* Prompts for the operator if user already selected a number */
        } else if (prompt === 1) {
        
            promptOperator();
        
        /* Resets prompt back to -1, changes work area and number buttons accordingly. Also checks whether the game is over */
        } else if (prompt === 3) {
        
            prompt = -1;
            
            /* Updates the work area and number buttons with addition and checks whether the game is over */
            if (operator === "+") {
        
                updateWorkArea(" = " + add(firstNum, secondNum) + "<br>");
                changeButtons(add(firstNum, secondNum));
                checkForEnd(add(firstNum, secondNum));
            
            /* Updates the work area and number buttons with subtraction and checks whether the game is over */
            } else if (operator === "-") {
        
                updateWorkArea(" = " + subtract(firstNum, secondNum) + "<br>");
                changeButtons(subtract(firstNum, secondNum));
                checkForEnd(subtract(firstNum, secondNum));
        
            /* Updates the work area and number buttons with multiplication and checks whether the game is over */
            } else if (operator === "*") {
        
                updateWorkArea(" = " + multiply(firstNum, secondNum) + "<br>");
                changeButtons(multiply(firstNum, secondNum));
                checkForEnd(multiply(firstNum, secondNum));    
            }
        
            /* Prompts the user for the first number again */
            switchPrompt();
        }
    }
}

/******************************************************************************************************************************

 ** Function: changeButtons
 ** Description: Gets rid of a number button when an operation has been completed.
 ** Parameters: newNum integer
 ** Pre-Conditions: Function is called.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function changeButtons(newNum) {
    
    /* Get the first and second number button clicked by the user */
    let firstButton = document.getElementById("firstNum");
    let secondButton = document.getElementById("secondNum");
    
    /* Removes the first number and changes the second number to the result of the user's formula */
    firstButton.innerHTML = "";
    secondButton.innerHTML = newNum;

    /* Adjusts the size of the number text depending on how many digits the number has */
    if (newNum >= 100 || newNum <= -100) {
    
        secondButton.style.fontSize = "50pt";
        secondButton.style.paddingTop = "45px";
    }
    
    /* Disables the first number button and remove the secondNum id from the second button the user clicked */
    firstButton.setAttribute("id", "removed");
    secondButton.removeAttribute("id", "secondNum");
}

/******************************************************************************************************************************

 ** Function: checkForEnd
 ** Description: Checks whether the user has used all the numbers and decides the result of the game accordingly.
 ** Parameters: result integer
 ** Pre-Conditions: Function is called.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function checkForEnd(result) {

    /* Gets a list of number buttons, the solution, formulas, and gamePrompt. */
    const numButtons = getNumButtons();
    let solution = document.getElementById("solution");
    let formulas = document.getElementById("formulas");
    let gamePrompt = document.getElementById("gamePrompt");
    let count = 0;
    
    /* Loop through the number buttons and count how mnay are not removed */
    for (let numButton of numButtons) {
    
        if (numButton.id !== "removed") {
        
            count++;
        }
    }
    
    /* End the game and disable all the buttons if only one number button is left */
    if (count === 1) {
    
        disableButtons();
        gameEnded = true;
        
        /* Update win counter, reveal solution, change formula color to green, and tell the user that they won */
        if (result === goal) {
        
            wins++;
            solution.style.display = "block";
            formulas.style.color = "green";
            gamePrompt.style.color = "green";
            gamePrompt.innerHTML = "You win!";
            document.getElementById("wins").innerHTML = "Wins: " + wins;
        
        /* Update loss counter, reveal solution, change formula color to red, and tell the user that they lost */
        } else {
        
            loses++;
            solution.style.display = "block";
            formulas.style.color = "red";
            gamePrompt.style.color = "red";
            gamePrompt.innerHTML = "You lose!";
            document.getElementById("loses").innerHTML = "Loses: " + loses;
        }
    }
}

/******************************************************************************************************************************

 ** Function: disableButtons
 ** Description: Disables all the number and operator buttons.
 ** Parameters: NA
 ** Pre-Conditions: Function is called.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function disableButtons() {

    /* Gets a list of number and operator buttons */
    const opButtons = getOpButtons();
    const numButtons = getNumButtons();
    
    /* Disable all number buttons */
    for (let numButton of numButtons) {
    
        numButton.setAttribute("disabled", "true");
    }
    
    /* Disable all operator buttons */
    for (let opButton of opButtons) {
    
        opButton.setAttribute("disabled", "true");
    }
}

/******************************************************************************************************************************

 ** Function: reset
 ** Description: Resets the number buttons and clears the work area when reset button is clicked.
 ** Parameters: NA
 ** Pre-Conditions: Reset button is clicked.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function reset() {

    /* Only reset the game if the game has not ended */
    if (gameEnded === false) {

        /* Get list of number buttons, reset the formulas in work area, and set the prompt back to -1 */
        const numButtons = getNumButtons();
        document.getElementById("formulas").innerHTML = "";
        prompt = -1;
    
        /* Remove the firstNum id from the element that has it */
        if (document.getElementById("firstNum") !== null) {
        
            document.getElementById("firstNum").removeAttribute("id", "firstNum");
        }
    
        /* Remove the secondNum id from the element that has it */
        if (document.getElementById("secondNum") !== null) {
        
            document.getElementById("secondNum").removeAttribute("id", "secondNum");
        }
    
        /* Reset the number buttons font size and bring back any removed buttons */
        for (let numButton of numButtons) {
    
            numButton.style.fontSize = "100pt";
            numButton.style.paddingTop = "0px";
    
            /* Bring back removed buttons */
            if (numButton.id === "removed") {
                numButton.removeAttribute("id");
            }
        }
    
        /* Reset the number buttons back to the original four numbers */
        numButtons[0].innerHTML = num1;
        numButtons[1].innerHTML = num2;
        numButtons[2].innerHTML = num3;
        numButtons[3].innerHTML = num4;

        /* Set gameEnded to be false and prompt for the first number again */
        gameEnded = false;
        switchPrompt();  
    }
}

/******************************************************************************************************************************

 ** Function: add
 ** Description: Adds the two numbers being passed.
 ** Parameters: firstNum integer, secondNum integer
 ** Pre-Conditions: Addition operator button is clicked.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function add(firstNum, secondNum) {

    /* return the sum of the two numbers */
    return (parseInt(firstNum) + parseInt(secondNum));
}

/******************************************************************************************************************************

 ** Function: subtract
 ** Description: Subtracts the two numbers being passed.
 ** Parameters: firstNum integer, secondNum integer
 ** Pre-Conditions: Subtraction operator button is clicked.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function subtract(firstNum, secondNum) {
    
    /* return the difference of the two numbers */
    return (parseInt(firstNum) - parseInt(secondNum));
}

/******************************************************************************************************************************

 ** Function: multiply
 ** Description: Multiplies the two numbers being passed.
 ** Parameters: firstNum integer, secondNum integer
 ** Pre-Conditions: Multiplication operator button is clicked.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function multiply(firstNum, secondNum) {

    /* return the product of the two numbers */
    return (parseInt(firstNum) * parseInt(secondNum));
}

/******************************************************************************************************************************

 ** Function: getNumButtons
 ** Description: Returns a list of four number buttons.
 ** Parameters: NA
 ** Pre-Conditions: The DOM is loaded or the function is called.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function getNumButtons() {

    /* return a list of the number buttons */
    return document.querySelectorAll("#numbers > button");
}

/******************************************************************************************************************************

 ** Function: getOpButtons
 ** Description: Returns a list of three operator buttons.
 ** Parameters: NA
 ** Pre-Conditions: The function is called.
 ** Post-Conditions: NA
 
******************************************************************************************************************************/

function getOpButtons() {

    /* return a list of the operator buttons */
    return document.querySelectorAll("#operators > button");
}