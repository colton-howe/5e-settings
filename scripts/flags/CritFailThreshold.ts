import { RollOptions, DND5eActorSettings } from "./Models";
import { RegisterHook, HookRegistrant, Game } from "../Models";

class CritFailThreshold implements HookRegistrant {

  public name = () => {
    return "CritFailThreshold";
  }

  register = () => {
    if (Game().modules.get('betterrolls5e')) {
      //TODO - Implement
      libWrapper.register("5e-settings", 'CONFIG.Item.entityClass.prototype.roll', function (this: Item, wrapped, ...args) {
        console.log(this);
        return wrapped(...args);
      }, "WRAPPER")
    } else {
      //For handling settings flags
      libWrapper.register("5e-settings", 'CONFIG.Item.entityClass.prototype.rollAttack', function (this: Item, wrapped, ...args) {
        const actor = this.actor;
        const options: RollOptions = { ...args[0] };

        if (actor == null) {
          console.error("5e-Settings: Cannot find actor when trying to set roll flags");
          return wrapped(options);
        }

        const flags: DND5eActorSettings = actor.data.flags.dnd5e as DND5eActorSettings;

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
  }

  registerWhen = () => {
    return RegisterHook.READY;
  }

  dependsOn = () => {
    return ["libWrapper"];
  }
}

export default new CritFailThreshold();