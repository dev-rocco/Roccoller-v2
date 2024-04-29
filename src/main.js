// Main window
let marqueeText = document.getElementById("text1");

window.api.receive("cfgReturn", (data) => {
    marqueeText.innerHTML = data.text;
    marqueeText.style.color = data.textColour;
    marqueeText.style.font = data.font;
    marqueeText.scrollamount = data.speed;
    marqueeText.style.padding = parseFloat(data.margin);
    document.body.style.backgroundColor = data.bgColour;
    
    console.log(data);
});
window.api.send("cfgRequest");

window.addEventListener("keydown", function(e) {
    if (e.code == "KeyC")
        window.api.send("cfgOpenWindow");
    else if (e.code == "Escape")
        window.api.send("quit", "mainWindow");
});