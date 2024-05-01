// Config window
let fontSize = 32;

let configElements =
{
    textInput: document.getElementById("cfgTextInput"),
    textColourInput: document.getElementById("cfgTextColourInput"),
    bgColourInput: document.getElementById("cfgBgColourInput"),
    fontInput: document.getElementById("cfgFontInput"),
    fontSizePreview: document.getElementById("cfgFontSizePreview"),
    marginInput: document.getElementById("cfgMarginInput"),
    speedInput: document.getElementById("cfgSpeedInput"),
    FPSInput: document.getElementById("cfgFPSInput"),
    AOTInput: document.getElementById("cfgAOTInput"),
    widthInput: document.getElementById("cfgWidthInput"),
    heightInput: document.getElementById("cfgHeightInput")
};

function cfgApply()
{
    window.api.send("cfgUpdate", {
        initialised: "1",
        text: configElements.textInput.value,
        textColour: configElements.textColourInput.value,
        bgColour: configElements.bgColourInput.value,
        fontFamily: configElements.fontInput.value,
        fontSize: fontSize.toString(),
        margin: configElements.marginInput.value,
        speed: configElements.speedInput.value,
        FPS: configElements.FPSInput.value,
        AOT: (Number(configElements.AOTInput.checked)).toString(),
        width: configElements.widthInput.value,
        height: configElements.heightInput.value
    });
}
function cfgReset()
{
    window.api.send("cfgUpdate", {
        initialised: "1",
        text: "Welcome to Roccoller v2! Press C to open the configuration menu. Here, you can change the text, colours, font, speed and more!",
        textColour: "#FFFF00",
        bgColour: "#000000",
        fontFamily: "Arial",
        fontSize: "32",
        margin: "4",
        speed: "100",
        FPS: "60",
        AOT: "1",
        width: "800",
        height: "48"
    });
}

function changeFontSize(amount, setNotIncrement=false)
{
    if ((amount < 0 && fontSize > 16) || (amount > 0 && fontSize < 96))
    {
        if (setNotIncrement)
            fontSize = amount;
        else
            fontSize += amount;
        configElements.fontSizePreview.style = "font-size:"+fontSize+"px";
        configElements.fontSizePreview.innerHTML = fontSize.toString() + "px";
    }
}
changeFontSize(0);

window.api.receive("cfgReturn", (data) => {
    configElements.textInput.value = data.text;
    configElements.textColourInput.value = data.textColour;
    configElements.bgColourInput.value = data.bgColour;
    configElements.fontInput.value = data.fontFamily;
    changeFontSize(parseInt(data.fontSize), true);
    configElements.marginInput.value = data.margin;
    configElements.speedInput.value = data.speed;
    configElements.FPSInput.value = data.FPS;
    configElements.AOTInput.value = data.AOT;
    configElements.widthInput.value = data.width;
    configElements.heightInput.value = data.height;
});
window.api.send("cfgRequest");

window.addEventListener("keydown", function(e){
    if (e.code == "Escape")
        window.api.send("quit", "configWindow");
    else if (e.code == "Enter")
        cfgApply();
});