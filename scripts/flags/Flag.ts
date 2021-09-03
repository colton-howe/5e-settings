import { Config } from "../Models";
import { FlagType, SettingsSection } from "./Models";


export abstract class Flag {

  constructor(
    private flagLocation: string, 
    private characterFlagName: string, 
    private flagHint: string, 
    private flagName: string, 
    private placeholder: any, 
    private type: FlagType, 
    private section: SettingsSection
  ) {
  
  }

  public register() {
    Config[this.flagLocation].characterFlags[this.characterFlagName] = {
      hint: this.prependFlagName(this.flagHint),
      name: this.prependFlagName(this.flagName),
      placeholder: this.placeholder,
      section: this.section,
      type: this.type
    };
  }

  private prependFlagName = (text: string): string => {
    return this.flagLocation + "." + text;
  }
}