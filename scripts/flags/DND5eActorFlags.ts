import { Flag } from "./Flag";
import { DND5EFlag } from "./DND5EFlag";
import { SettingsSection } from "./Models";
import { HookRegistrant, RegisterHook } from "../Models";

const FLAGS: Flag[] = [
  new DND5EFlag("weaponCritFailThreshold", "FlagsWeaponCritFailThresholdHint", "FlagsWeaponCritFailThreshold", 1, Number, SettingsSection.FEATS),
  new DND5EFlag("spellCritFailThreshold", "FlagsSpellCritFailThresholdHint", "FlagsSpellCritFailThreshold", 1, Number, SettingsSection.FEATS),
  new DND5EFlag("sneakAttackDamage", "SneakAttackDamageHint", "SneakAttackDamage", null, Boolean, SettingsSection.CLASS)
];

class DND5eActorFlags implements HookRegistrant {

  public name = () => {
    return "DND5eActorFlags";
  }

  register = () => {
    FLAGS.forEach(flag => {
      flag.register();
    });
  }

  registerWhen = () => {
    return RegisterHook.READY;
  }

  dependsOn = () => {
    return [];
  }

}

export default new DND5eActorFlags();