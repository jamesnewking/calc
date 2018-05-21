

var calcArray = [];
var outChar = "";
var tempOperator;
var temp2ndNum = "";//to track old value from number to string? so we can do math again
var divByZero = false;
var buttonsPressed = '';
var originalRepeatVal = null;
var maxLength = 10;
var toggleTop = 1;

$(document).ready(initializeApp);

function initializeApp(){
    $('.button').on('click', whichButton);

}

function whichButton(){
    var val = $(this).text();
    buttonsPressed = buttonsPressed + val;
    switch (val) {
        case '⚠':
            toggleMessages();
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

}

function toggleMessages(){
    if (toggleTop === 1){
        $('.onTop').css('color','black');
        $('#debugMessages').addClass('greyOut');

        $('div.calcOutput').remove();
    } else {
        $('.onTop').css('color','#5bc0de');
        $('#debugMessages').removeClass('greyOut');
        var outputDiv = $('<div>').addClass('calcOutput');
        $('div#debugArea').append(outputDiv);
    }

    toggleTop = 1 - toggleTop;
}

function concatPreviousNum(currentNumber){
    if (calcArray[calcArray.length-1].length===maxLength){
     //limit the characters to 10
    return;
    }
    else if ((calcArray[calcArray.length-1]==='0') && currentNumber==='.'){
        var tempNum;
        tempNum = calcArray[calcArray.length-1];
        tempNum = tempNum + currentNumber;
        calcArray[calcArray.length-1] = tempNum;
        return;

    }
    else if(calcArray[calcArray.length-1]==='0'){
        calcArray[calcArray.length-1] = currentNumber;
        return;
    }
    var tempNum;
    tempNum = calcArray[calcArray.length-1];
    tempNum = tempNum + currentNumber;
    calcArray[calcArray.length-1] = tempNum;
}

function replacePrevOp(currentOp){
    if (currentOp === ''){
        //remove last item on array
        calcArray.pop();
    }else {
        calcArray[calcArray.length - 1] = currentOp;
    }
}


function numberIsPressed(inChar){

        //this is a number
        if (calcArray.length === 0){
            calcArray.push(inChar);
        } else if (inChar === '0' && (calcArray[calcArray.length-1]== '0') ){
            //multiple zeros without decimal
            return;
        }

        else if( typeof(calcArray[calcArray.length-1]) === 'number' ){
            clearReset();
            calcArray.push(inChar);

        }

        else if( !isNaN(calcArray[calcArray.length-1]) ) {
            //previous element is a number
            concatPreviousNum(inChar);
        }
        else if( calcArray[calcArray.length-1] === '.' ){
            //previous element is a decimal
            calcArray.pop(); //remove decimal
            var decimalNum = '.';
            decimalNum  = decimalNum + inChar;
            concatPreviousNum(decimalNum);
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
        concatPreviousNum('.');
        //need to add 0 and . to the array
        displayOnTop();
        return;
    }
    else if ( calcArray[calcArray.length-1] === '.' ) {
        //previous element is a decimal
        return;
    }
    else if ( isNaN( calcArray[calcArray.length-1] ) ){
        //previous element is an operator
        calcArray.push('0');
        concatPreviousNum('.');
    }
    else if ( typeof(calcArray[0])==='number'){
        //the first value is a number that has been calculated
        clearReset();
        calcArray.push('0');
        concatPreviousNum('.');
        //need to add 0 and . to the array
        displayOnTop();
    }
    else if ( (calcArray[calcArray.length-1].indexOf('.') ) === -1 ){
        //true statement because can't find '.' in the previous element so must be a whole number
        //previous element is an integer
        concatPreviousNum('.');
        //calcArray.push(inChar); //bug?
    }
}

function insertOperator(inChar){
    if (calcArray.length === 0){
        //no previous number to do work
        return;
    }
    else if ( calcArray[0]===Infinity){
     //Infinity error is shown
        clearReset();
        return;
    }
    else if ( calcArray[calcArray.length-1] === '.' ){
        //previous element is a decimal
        replacePrevOp('');
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
        // if ((buttonsPressed[buttonsPressed.length-1]) !== '='){
        //     temp2ndNum = calcArray[0];
        //
        // }
        //need to store calcArray[0];
        doMath('=');//bug
    } else if(typeof(calcArray[0])==='number' && calcArray.length === 2){
        if (buttonsPressed[buttonsPressed.length-2] === '='){

            mathEngine(calcArray[0],calcArray[1],temp2ndNum);
            displayOnTop();
            return;
        } else {
            originalRepeatVal = parseFloat( calcArray[0] );
            temp2ndNum = calcArray[0];
        }
        doMath('repeat');
    }
    else if(isNaN(calcArray[calcArray.length-1])){
        originalRepeatVal = parseFloat( calcArray[0] );
        doMath(calcArray[calcArray.length-1]);
        //passed in the last operator in the Array since it is a repeated operation
    } else {
        originalRepeatVal = parseFloat( calcArray[2] );
        doMath()}

}

function mathEngine(number1, calcOperator, number2){
    switch (calcOperator) {
        case '+':
            calcArray[0] = number1 + number2;
            break;
        case '-':
            calcArray[0] = number1 - number2;
            break;
        case 'x':
            calcArray[0] = number1 * number2;
            break;
        case '/':
            if (temp2ndNum === 0) {
                divByZero = true;
                break;
            };
            calcArray[0] = number1 / number2;
            break;
    }
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
        mathEngine(temp1stNum,tempOperator,temp2ndNum);
    }
    else if(inOperator === '='){
        //equals was pressed right before this, so repeat the math function
        //the value should be a number already
        mathEngine(calcArray[0], tempOperator, originalRepeatVal);
    }
    else if( inOperator === 'x' || inOperator === '/' || inOperator === '+' || inOperator === '-') {
        //case of rolling operator 1 + 1 + = + =
        tempOperator = inOperator;
        calcArray.pop(); //remove the operator
        var tempFirst = parseFloat(calcArray[0]);
        mathEngine(tempFirst, tempOperator, tempFirst);
    }
    else if( inOperator === 'repeat') {
        tempOperator = calcArray[1];
        mathEngine(temp2ndNum, tempOperator, temp2ndNum);
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
        $('.topDisplay').text('Ready');
        outChar = '0';
        if (divByZero === true){
            $('.topDisplay').text('ERROR');
            displayOnBottom(outChar);
            divByZero = false;
            return;

        }

    }
    else {
    $('.topDisplay').text(outChar);}
    displayOnBottom(outChar);
    console.log('array ' , calcArray);
    console.log('operator ' , tempOperator);
    console.log('2ndNum ' , temp2ndNum);
}

function displayOnBottom(inDisplay){
    var lastChar = inDisplay.slice(-1);
    if (lastChar === '+' || lastChar === '-' || lastChar === 'x' || lastChar === '/'){
        inDisplay = inDisplay.slice(0,inDisplay.length-1);
    } else if (['x','/','+','-'].indexOf(calcArray[1])>-1){
        //to strip out the previous operands, removes 999x in 999x999
        inDisplay = calcArray[calcArray.length-1];
    } else if ((divByZero === true) || calcArray[0]===Infinity){
        inDisplay = 'ERROR';
    }

    $('.topDisplay.outResults').text(inDisplay);
    delayOutput(inDisplay);

//need to check if operator is in the middle of inDisplay; then slice(0,loc.operation)
}

function delayOutput(message){
    var newDiv = $('<div>').addClass('fullCalculation');
    $(newDiv).text(message);
    $('.calcOutput').append(newDiv);
    setTimeout(function(){$(newDiv).remove()},2000);
}



function clearReset(){
    calcArray = [];
    displayOnTop();
    tempOperator = "";
    temp2ndNum = "";
    buttonsPressed = "";
    originalRepeatVal = null;

}

