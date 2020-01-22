"use strict"

let paused = true;

createStreamOfThoughts();

async function createStreamOfThoughts() {
    let getShowerThoughtsData = async function (after=null) {
        return getRedditData('https://www.reddit.com/r/Showerthoughts/rising/.json', after);
    };

    let rjson = await getShowerThoughtsData();

    for (let i = 0; i < 20; i++) {
        let p1 = printAllTitles(rjson);
        let p2 = getShowerThoughtsData(rjson.data.after);

        let data = await Promise.all([p1, p2]);

        rjson = data[1];
    }
}


async function getRedditData(url, after=null) {
    if (after) {
        url += "?after=" + after
    }

    let response = await fetch(url)
    let rjson = await response.json()

    return rjson
}

async function printAllTitles(rjson) {
    for (let index in [...Array(rjson.data.dist).keys()]) {
        while (paused) {
            await new Promise((resolve, reject) => setTimeout(resolve, 100));
        }

        printThought(rjson.data.children[index].data.title);

        await new Promise((resolve, reject) => setTimeout(resolve, 100));
    }
}

function printThought(thought) {
    let currentText = document.getElementById("demo").innerHTML;

    // Make sure string fits within the window after adding new thought
    const maxHeight = window.innerHeight - document.getElementById("controls").clientHeight - 2*parseInt(window.getComputedStyle(document.body).margin);
    const demoHeight = document.getElementById("demo").clientHeight;

    if (demoHeight >= maxHeight) {
        currentText = currentText.slice(currentText.indexOf("</p>") + "</p>".length);
    }

    currentText += "<p>" + thought + "</p>"
    document.getElementById("demo").innerHTML = currentText;
}


function toggleStream() {
    paused = !paused;
}

function resetDemo() {
    if (!paused) {
        toggleStream();
    }
    document.getElementById("demo").innerHTML = '';
}
