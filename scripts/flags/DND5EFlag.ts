import { FlagType, SettingsSection } from "./Models";
import { Flag } from "./Flag";

const FLAG_NAME: string = "DND5E";

export class DND5EFlag extends Flag {

    constructor(
        characterFlagName: string, 
        flagHint: string, 
        flagName: string, 
        placeholder: any, 
        type: FlagType, 
        section: SettingsSection
    ) {
        super(FLAG_NAME, characterFlagName, flagHint, flagName, placeholder, type, section);
    }
}