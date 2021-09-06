import { RollOptions, DND5eActorSettings } from "./Models";
import { RegisterHook, HookRegistrant, Game } from "../Models";
import { MODULE_NAME, log } from "../Utils";

class CritFailThreshold implements HookRegistrant {

  public name = () => {
    return "CritFailThreshold";
  }

  register = () => {
    libWrapper.register(MODULE_NAME, 'CONFIG.Item.documentClass.prototype.rollAttack', function (this: Item5e, wrapped, ...args) {
      const actor = this.actor;
      const options: RollOptions = { ...args[0] };

      if (actor == null) {
        log("Cannot find actor when trying to set roll flags");
        return wrapped(options);
      }

      const flags = actor.data.flags.dnd5e as DND5eActorSettings;

      //No changes made, return immediately
      if (flags == null) {
        return wrapped(options);
      }

      //Modify fumble values if needed
      if (this.type == "weapon" && flags.weaponCritFailThreshold != null) {
        options.fumble = flags.weaponCritFailThreshold;
      } else if (this.type == "spell" && flags.spellCritFailThreshold != null) {
        options.fumble = flags.spellCritFailThreshold;
      }

      return wrapped(options);
    }, "MIXED");
  }

  registerWhen = () => {
    return RegisterHook.READY;
  }

  dependsOn = () => {
    return ["libWrapper"];
  }
}

export default new CritFailThreshold();