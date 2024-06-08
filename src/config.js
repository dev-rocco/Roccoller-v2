// Config window
let fontSize = 32;

let configElements =
{
    textInput: document.getElementById("cfgTextInput"),
    textColourInput: document.getElementById("cfgTextColourInput"),
    bgColourInput: document.getElementById("cfgBgColourInput"),
    fontInput: document.getElementById("cfgFontInput"),
    autoHeightInput: document.getElementById("cfgAutoHeightInput"),
    fontSizePreview: document.getElementById("cfgFontSizePreview"),
    marginInput: document.getElementById("cfgMarginInput"),
    speedInput: document.getElementById("cfgSpeedInput"),
    FPSInput: document.getElementById("cfgFPSInput"),
    AOTInput: document.getElementById("cfgAOTInput"),
    widthInput: document.getElementById("cfgWidthInput"),
    heightInput: document.getElementById("cfgHeightInput"),
    autoHeight: document.getElementById("cfgAutoHeightInput")
};

function cfgApply()
{
    let tempHeight;
    if (configElements.autoHeight.checked) tempHeight = (fontSize * 1.2) + 5;
    else tempHeight = configElements.heightInput.value;

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
        height: tempHeight.toString(),
        autoHeight: (Number(configElements.autoHeight.checked)).toString()
    });
}
function cfgReset()
{
    window.api.send("cfgUpdate", "default");
}

function changeFontSize(amount, set=false)
{
    if ((amount <= 0 && fontSize > 16) || (amount >= 0 && fontSize < 200))
    {
        if (set)
            fontSize = amount;
        else
            fontSize += amount;

        configElements.fontSizePreview.style = "font-size:"+fontSize+"px";
        configElements.fontSizePreview.innerHTML = fontSize.toString() + "px";
    }
}

function autoHeightToggled()
{
    configElements.heightInput.disabled = !!configElements.autoHeight.checked;
}

window.api.receive("cfgReturn", (data) => {
    configElements.textInput.value = data.text;
    configElements.textColourInput.value = data.textColour;
    configElements.bgColourInput.value = data.bgColour;
    configElements.fontInput.value = data.fontFamily;
    changeFontSize(parseInt(data.fontSize), true);
    configElements.marginInput.value = data.margin;
    configElements.speedInput.value = data.speed;
    configElements.FPSInput.value = data.FPS;
    configElements.AOTInput.checked = parseInt(data.AOT);
    configElements.widthInput.value = data.width;
    configElements.heightInput.value = data.height;
    configElements.autoHeight.checked = parseInt(data.autoHeight);
    autoHeightToggled();
});
window.api.send("cfgRequest");

window.addEventListener("keydown", function(e){
    if (e.code == "Escape")
        window.api.send("quit", "configWindow");
    else if (e.code == "Enter")
        cfgApply();
});