import { HookRegistrant, RegisterHook, Game } from "../Models";
import { DND5eActorSettings } from "./Models";
import { characterHasAllyWithin5Feet, MODULE_NAME } from "../Utils";

let midiQOLInstalled: boolean = false;

class AutoSneakAttack implements HookRegistrant {

  public name = () => {
    return "AutoSneakAttack";
  }

  public register = () => {
    midiQOLInstalled = Game().modules.get('midi-qol') != null;
    if (!midiQOLInstalled && Game().user!.isGM) {
      ui.notifications!.warn("Auto sneak attack utilizies some features from the 'midi-qol' module. If you want Sneak Attack to only show up when applicable to targeted actors, install 'midi-qol'");
    }

    libWrapper.register(MODULE_NAME, 'CONFIG.Item.documentClass.prototype.rollDamage', async function (this: Item, wrapped, ...args) {
      if (this.data.type !== "weapon") {
        //If item isn't a weapon, then don't do anything
        return wrapped(args[0]);
      }
  
      const flags: DND5eActorSettings = this.actor!.data.flags.dnd5e as DND5eActorSettings;
      if (!flags || !flags.sneakAttackDamage) {
        return wrapped(args[0]);
      }
  
      const itemData: Record<string, any> = this.data.data;
  
      //Determines if sneak attack applys based on if the weapon is finesse OR ranged
      const isFinesseWeapon = itemData.properties.fin;
      const isRangedWeapon = itemData.weaponType === "simpleR" || itemData.weaponType === "martialR";
      const itemCanSneakAttack = isFinesseWeapon || isRangedWeapon;
  
      let characterCanSneakAttack = true;
  
      //If there is a target, then we can try and figure out if they have advantage or have any ally within 5 feet
      if (midiQOLInstalled && Game().user!.targets.size == 1) {
        const itemWorkflow = MidiQOL.Workflow.getWorkflow(this.id);
        characterCanSneakAttack = false;
        if (itemWorkflow && itemWorkflow.attackRoll && itemWorkflow.attackRoll.terms) {
          const diceTerm = itemWorkflow.attackRoll.terms.find(term => term instanceof Die);
          if (diceTerm && diceTerm.options && (diceTerm.options as any).advantage) {
            characterCanSneakAttack = true;
          }
        } else {
          characterCanSneakAttack = characterHasAllyWithin5Feet(Game().user);
        }
      }
  
      const roll = await wrapped(args[0]);
  
      const sneakAttackFeature: any = this.actor!.items.find(item => item.name === "Sneak Attack");
      if (sneakAttackFeature && roll && itemCanSneakAttack && characterCanSneakAttack) {
        sneakAttackFeature.roll();
      }
  
      return roll;
    }, "WRAPPER");
  }

  public registerWhen = () => {
    return RegisterHook.SETUP;
  }

  public dependsOn = () => {
    return ["libWrapper"];
  }
}

export default new AutoSneakAttack();