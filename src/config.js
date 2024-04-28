// Config window
let configElements =
{
    textInput: document.getElementById("cfgTextInput"),
    textColourInput: document.getElementById("cfgTextColourInput"),
    bgColourInput: document.getElementById("cfgBgColourInput"),
    fontInput: document.getElementById("cfgFontInput"),
    marginInput: document.getElementById("cfgMarginInput"),
    speedInput: document.getElementById("cfgSpeedInput"),
    AOTInput: document.getElementById("cfgAOTInput"),
    widthInput: document.getElementById("cfgWidthInput"),
    heightInput: document.getElementById("cfgHeightInput")
};

function cfgApply()
{
    let configValues =
    {
        textInput: configElements.textInput.value,
        textColourInput: configElements.textColourInput.value,
        bgColourInput: configElements.bgColourInput.value,
        fontInput: configElements.fontInput.value,
        marginInput: configElements.marginInput.value,
        speedInput: configElements.speedInput.value,
        AOTInput: configElements.AOTInput.value,
        widthInput: configElements.widthInput.value,
        heightInput: configElements.heightInput.value
    };
    console.log(configValues);
    window.api.send("cfgUpdate", configValues);
}