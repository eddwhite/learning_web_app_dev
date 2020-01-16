"use strict"

console.log("Hello inspector");

let newDigitTimerId = null;
let charGenerator = generateDigit;

function randomInt(n) {
    return Math.floor(Math.random() * n);
}

function generateDigit() {
    return randomInt(10);
}

function generateLetter() {
    return [...'abcdefghijklmnopqrstuvwxyz'][randomInt(26)];
}

function newDigit() {
    let currentText = document.getElementById("demo").innerHTML;

    if (currentText == '&nbsp;') {
        currentText = '';
    }

    // Make sure string fits within the window after adding new digit
    const bodyWidth = document.querySelector("body").clientWidth;
    const stringWidth = document.getElementById("demo").clientWidth;
    const digitWidth = stringWidth / currentText.length;

    if (stringWidth + digitWidth >= bodyWidth) {
        const excessDigits = Math.ceil((stringWidth + digitWidth - bodyWidth) / digitWidth);
        currentText = currentText.slice(excessDigits);
    }

    // Add a random number between [0, 9]
    currentText += charGenerator();
    document.getElementById("demo").innerHTML = currentText;
}

function toggleTimer() {
    if (newDigitTimerId) {
        clearInterval(newDigitTimerId);
        newDigitTimerId = null;

    } else {
        newDigitTimerId = setInterval(newDigit, 100);
    }
}

function toggleFormat() {
    if (charGenerator == generateDigit) {
        charGenerator = generateLetter;
    } else {
        charGenerator = generateDigit;
    }
}

function resetDemo() {
    if (newDigitTimerId) {
        toggleTimer();
    }
    document.getElementById("demo").innerHTML = '&nbsp;';
}
