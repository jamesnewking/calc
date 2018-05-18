//
// my_calculator = new calculator(processCalc);
//
// function processCalc(type,value,item){
//     if (value === undefined){}
//     else {
//         $('.outResults').text(value);
//     }
// }

var calcArray = [];

var outChar = "";
var tempOperator;
var temp2ndNum = "";//to track old value from number to string? so we can do math again
var divByZero = false;

$(document).ready(initializeApp);

function initializeApp(){
    $('.button').on('click', function () {
        var val = $(this).text();
        switch (val) {

            case 'C':
                clearLastInput();
                break;
            case 'AC':
                clearReset();
                break;
            case '.':
                insertDecimal(val);
                break;
            case 'x':
            case '/':
            case '+':
            case '-':
                insertOperator(val);
                break;
            case '=':
                equalsPressed();
                break;
            default:
                numberIsPressed(val);
                break;
        }
    });

}

function concatPreviousNum(currentNumber){
    var tempNum;
    tempNum = calcArray[calcArray.length-1];
    tempNum = tempNum + currentNumber;
    calcArray[calcArray.length-1] = tempNum;
}

function replacePrevOp(currentOp){
    calcArray[calcArray.length-1] = currentOp;
}



function numberIsPressed(inChar){

        //this is a number
        if (calcArray.length === 0){
            calcArray.push(inChar);
        }
        else if( typeof(calcArray[calcArray.length-1]) === 'number' ){
            clearReset();
            calcArray.push(inChar);

        }

        else if( !isNaN(calcArray[calcArray.length-1]) ) {
            //previous element is a number
            concatPreviousNum(inChar);
            // tempNum = calcArray[calcArray.length-1];
            // tempNum = tempNum + inChar;
            // calcArray[calcArray.length-1]= tempNum;
        }
        else if( calcArray[calcArray.length-1] === '.' ){
            //previous element is a decimal
            calcArray.pop(); //remove decimal
            var decimalNum = '.';
            decimalNum  = decimalNum + inChar;
            concatPreviousNum(decimalNum);
            // tempNum = calcArray[calcArray.length-1];
            // tempNum = tempNum + inChar;
            // calcArray[calcArray.length-1]= tempNum;
        } else {
            //previous element is an operator, I hope. I'm assuming here
            calcArray.push(inChar);
        }

    displayOnTop();
}


function insertDecimal(inChar) {

    //check if previous value in array isNaN; if '.' do nothing, if 'operator' the do nothing;
    if ( calcArray.length === 0 ) {
        calcArray.push('0');
        calcArray.push('.');
        //need to add 0 and . to the array
        return;
    }
    else if ( calcArray[calcArray.length-1] === '.' ) {
        //previous element is a decimal
        return;
    }
    else if (  isNaN( calcArray[calcArray.length-1] ) ){
        //previous element is an operator
        calcArray.push('0');
        calcArray.push('.');
    }
    else if ( typeof(calcArray[0])==='number'){
        //the first value is a number that has been calculated
        clearReset();
    }
    else if ( (calcArray[calcArray.length-1].indexOf('.') ) === -1 ){
        //true statement because can't find '.' in the previous element so must be a whole number
        //previous element is an integer
        calcArray.push(inChar);
    }
}

function insertOperator(inChar){
    if (calcArray.length === 0){
        //no previous number to do work
        return;
    }
    else if ( calcArray[calcArray.length-1] === '.' ){
        //previous element is a decimal
        replacePrevOp(inChar);
        insertOperator(inChar);//will this create a loop?
    }
    else if ( !isNaN(calcArray[calcArray.length-1]) ){
    //previous element is a number

        if ( calcArray.length === 3 ){
            //there is something that can be calculated
            doMath(); //calcArray[calcArray.length-1]
        }
        //insert operator if previous number is the only number
        calcArray.push(inChar);
    } else {
        //previous element must be an operator
        replacePrevOp(inChar);
    }
    displayOnTop();
}

function equalsPressed(){
    if (calcArray.length === 0){
        clearReset();
    } else if((calcArray.length === 1) && (typeof(calcArray[0])==='string')){
        //there is a number pressed so do nothing
    } else if(calcArray[calcArray.length-1]==='.'){
        if (calcArray.length>3){
            calcArray.pop();//remove the decimal
            doMath();
        }
    } else if(typeof(calcArray[0])==='number' && calcArray.length === 1){
        doMath('=');
    } else if(typeof(calcArray[0])==='number' && calcArray.length === 2){
        doMath('repeat');
    }
    else if(isNaN(calcArray[calcArray.length-1])){
        doMath(calcArray[calcArray.length-1]);
        //passed in the last operator in the Array since it is a repeated operation
    } else {doMath()}

}

function doMath(inOperator){
//assuming the array is only 3 elements long
//check if the calcArray already has an answer, then repeat the operation
    if (calcArray.length === 3) {
        temp2ndNum = parseFloat(calcArray[2]);
        calcArray.pop();

        tempOperator = calcArray[1];
        calcArray.pop();

        var temp1stNum = parseFloat(calcArray[0]);

        switch (tempOperator) {
            case '+':
                calcArray[0] = temp1stNum + temp2ndNum;
                break;
            case '-':
                calcArray[0] = temp1stNum - temp2ndNum;
                break;
            case 'x':
                calcArray[0] = temp1stNum * temp2ndNum;
                break;
            case '/':
                if(temp2ndNum===0){
                    divByZero = true;

                    break;
                };
                calcArray[0] = temp1stNum / temp2ndNum;
                break;

        }
    } else if(inOperator === '='){
        //equals was pressed right before this, so repeat the math function
        var tempFirst = calcArray[0]; //the value should be a number already

        switch (tempOperator) {
            case '+':
                calcArray[0] = tempFirst + tempFirst;
                break;
            case '-':
                calcArray[0] = tempFirst - tempFirst;
                break;
            case 'x':
                calcArray[0] = tempFirst * tempFirst;
                break;
            case '/':
                if(temp2ndNum===0){
                    divByZero = true;

                    break;
                }
                calcArray[0] = tempFirst / tempFirst;
                break;
        }

    }
    else if( inOperator === 'x' || inOperator === '/' || inOperator === '+' || inOperator === '-') {
        //case of rolling operator 1 + 1 + = + =
        tempOperator = inOperator;
        calcArray.pop(); //remove the operator
        var tempFirst = parseFloat(calcArray[0]);
        switch (tempOperator) { //instead of tempOperator
            case '+':
                calcArray[0] = tempFirst + tempFirst;
                break;
            case '-':
                calcArray[0] = tempFirst - tempFirst;
                break;
            case 'x':
                calcArray[0] = tempFirst * tempFirst;
                break;
            case '/':
                if (temp2ndNum === 0) {
                    divByZero = true;

                    break;
                }
                calcArray[0] = tempFirst / tempFirst;
                break;


        }
    }
    else if( inOperator === 'repeat') {
        var tempFirst = calcArray[0];
        tempOperator = calcArray[1];
        switch (tempOperator) {
            case '+':
                calcArray[0] = tempFirst + tempFirst;
                break;
            case '-':
                calcArray[0] = tempFirst - tempFirst;
                break;
            case 'x':
                calcArray[0] = tempFirst * tempFirst;
                break;
            case '/':
                if (temp2ndNum === 0) {
                    divByZero = true;

                    break;
                }
                calcArray[0] = tempFirst / tempFirst;
                break;


        }
    }
    displayOnTop();

}

function displayOnTop(){
    if (divByZero === true) {
        calcArray = [];
        tempOperator = "";
        temp2ndNum = "";
    }
    outChar = "";
    for (var arrIndex = 0; arrIndex < calcArray.length; arrIndex++){
        outChar = outChar + calcArray[arrIndex];
    }
    if (outChar === ""){
        debugger;
        $('.topDisplay').text('Ready');
        if (divByZero === true){
            $('.topDisplay').text('ERROR');
            divByZero = false;
        }

    }
    else {
    $('.topDisplay').text(outChar);}

}

function clearReset(){
    debugger;
    calcArray = [];
    displayOnTop();
    tempOperator = "";
    temp2ndNum = "";

}

