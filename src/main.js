// Main window
let marqueeText = document.getElementById("text1");
let configContents = {};

let textPositions = [];
let parsedSpeed;
function update()
{
    console.log(configContents.speed);
    for (let i=0; i<textPositions.length; i++)
    {
        textPositions[i] -= parsedSpeed;
    }

    marqueeText.style.left = textPositions[0]+"px";
}

window.api.receive("cfgReturn", (data) => {
    marqueeText.innerHTML = data.text;
    marqueeText.style.color = data.textColour;
    marqueeText.style.font = data.font;
    marqueeText.style.margin = data.margin+"px";
    document.body.style.backgroundColor = data.bgColour;
    
    console.log(data);
    configContents = data;
    parsedSpeed = parseInt(data.speed) / 100;
    textPositions[0] = data.width;

    window.setInterval(update, 1000/data.FPS); // call update data.FPS times per second
});
window.api.send("cfgRequest");

window.addEventListener("keydown", function(e) {
    if (e.code == "KeyC")
        window.api.send("cfgOpenWindow");
    else if (e.code == "Escape")
        window.api.send("quit", "mainWindow");
});