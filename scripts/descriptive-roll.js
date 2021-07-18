const decorateInnerRoll = (inlineRollHtml, rollText) => {
  if (inlineRollHtml != null) {
    const displayTextRegex = /\|(.+?)\|/;
    const matches = displayTextRegex.exec(rollText);

    if (matches != null) {
      const diceIcon = inlineRollHtml.firstElementChild;
      const formula = inlineRollHtml.text.substring(1).replace(matches[0], "");
      inlineRollHtml.dataset.formula = formula;
      inlineRollHtml.text = " " + matches[1];
      inlineRollHtml.prepend(diceIcon);
    }
  }

  return inlineRollHtml;
};

Hooks.on("ready", function() {
  libWrapper.register("5e-settings", "TextEditor._createInlineRoll", (wrapped, ...args) => {
    const rollText = args[0];
    return decorateInnerRoll(wrapped(...args), rollText);
  }, "MIXED");
});