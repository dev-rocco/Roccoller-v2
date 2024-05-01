// Main window
let marqueeTexts = [];
let configContents = {};

let textPositions = [];
let parsedSpeed;
let parsedTextWidth = 0;
const SPACING = 70;

function makeText()
{
    textPositions.push(textPositions[textPositions.length-1]);
    let tempText = document.createElement("h1");
    tempText.style = "position:fixed; top:0px; white-space:nowrap; color:"+configContents.textColour+"; font-family:"+configContents.fontFamily+"; font-size:"+configContents.fontSize+"px; padding:"+configContents.margin+"px;";
    tempText.innerHTML = configContents.text;
    tempText.className = "unselectable";
    marqueeTexts.push(tempText);
    document.body.appendChild(tempText);
}

function update()
{
    for (let i=0; i<marqueeTexts.length; i++)
    {
        textPositions[i] -= parsedSpeed;
        if (textPositions[i] + parsedTextWidth == window.innerWidth - SPACING)
            makeText();
        else if (textPositions[i] + parsedTextWidth < 0)
        {
            textPositions.splice(i, 1);
            marqueeTexts[i].remove();
            marqueeTexts.splice(i, 1);
        }
        marqueeTexts[i].style.left = textPositions[i]+"px";
    }
}

window.api.receive("cfgReturn", (data) => {
    document.body.style.backgroundColor = data.bgColour;
    
    console.log(data);
    configContents = data;
    parsedSpeed = parseInt(data.speed) / 100;
    textPositions[0] = parseInt(data.width);
    textPositions[1] = parseInt(data.width) + parsedTextWidth;
    
    makeText();
    parsedTextWidth = parseInt(marqueeTexts[0].clientWidth);

    window.setInterval(update, 1000/parseInt(data.FPS)); // call update data.FPS times per second
});
window.api.send("cfgRequest");

window.addEventListener("keydown", function(e) {
    if (e.code == "KeyC")
        window.api.send("cfgOpenWindow");
    else if (e.code == "Escape")
        window.api.send("quit", "mainWindow");
});