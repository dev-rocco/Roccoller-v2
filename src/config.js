// Config window
let configElements =
{
    textInput: document.getElementById("cfgTextInput"),
    textColourInput: document.getElementById("cfgTextColourInput"),
    bgColourInput: document.getElementById("cfgBgColourInput"),
    fontInput: document.getElementById("cfgFontInput"),
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
        font: configElements.fontInput.value,
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
        text: "Welcome to Roccoller. Please edit the config file in the application folder to change this placeholder text. You can even change the colour, speed and size!",
        textColour: "#FFFF00",
        bgColour: "#000000",
        font: "32px Arial",
        margin: "8",
        speed: "100",
        FPS: 60,
        AOT: "1",
        width: "800",
        height: "48"
    });
}

window.addEventListener("keydown", function(e){
    if (e.code == "Escape")
        window.api.send("quit", "configWindow");
});