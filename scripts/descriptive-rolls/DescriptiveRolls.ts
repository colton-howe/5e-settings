import { RegisterHook } from "../Models";
import { HookRegistrant } from "../Models";
import { MODULE_NAME } from "../Utils";

class DescriptiveRolls implements HookRegistrant {

  public name = () => {
    return "DescriptiveRolls";
  }

  public register = () => {
    libWrapper.register(MODULE_NAME, "TextEditor._createInlineRoll", (wrapped, ...args) => {
      const rollText: string = String(args[0]);
      return this.decorateInnerRoll(wrapped(...args), rollText);
    }, "MIXED");
  }

  public registerWhen = () => {
    return RegisterHook.READY;
  }

  public dependsOn = () => {
    return ["libWrapper"];
  }

  private decorateInnerRoll = (inlineRollHtml: any, rollText: string) => {
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
}

export default new DescriptiveRolls();