// Main window
let configContents = {};

let textObjects = [];
let parsedSpeed;
let parsedTextWidth = 0;
const SPACING = 70;

function makeText()
{
    let tempText = document.createElement("h1");
    tempText.style = "position:fixed; white-space:nowrap; color:"+configContents.textColour+"; font-family:"+configContents.fontFamily+"; font-size:"+configContents.fontSize+"px; margin:"+configContents.margin+"px; line-height:"+parseInt(configContents.fontSize)+"px;";
    tempText.innerHTML = configContents.text;
    tempText.className = "unselectable";
    textObjects.push({
        element: tempText,
        x: window.innerWidth
    });
    document.body.appendChild(tempText);
}

function update()
{
    if (textObjects[textObjects.length-1].x + parsedTextWidth <= window.innerWidth - SPACING)
        makeText();

    for (let i=0; i<textObjects.length; i++)
    {
        textObjects[i].x -= parsedSpeed;

        if (textObjects[i].x + parsedTextWidth < 0)
        {
            textObjects[i].element.remove();
            textObjects.splice(i, 1);
        }

        textObjects[i].element.style.left = textObjects[i].x+"px";
    }
}

window.api.receive("cfgReturn", (data) => {
    document.body.style.backgroundColor = data.bgColour;
    
    console.log(data);
    configContents = data;
    parsedSpeed = parseInt(data.speed) / 100;
    
    makeText();
    parsedTextWidth = parseInt(textObjects[0].element.clientWidth);

    window.setInterval(update, 1000/parseInt(data.FPS)); // call update data.FPS times per second
});
window.api.send("cfgRequest");

window.addEventListener("keydown", function(e) {
    if (e.code == "KeyC")
        window.api.send("cfgOpenWindow");
    else if (e.code == "Escape")
        window.api.send("quit", "mainWindow");
});