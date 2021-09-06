import DescriptiveRolls from "./descriptive-rolls/DescriptiveRolls";
import DND5eActorFlags from "./flags/DND5eActorFlags";
import CritFailThreshold from "./flags/CritFailThreshold";
import AutoSneakAttack from "./flags/AutoSneakAttack";
import SpellPreparer from "./long-rest-enhanced/SpellPreparer";
import { Game, RegisterHook, HookRegistrant } from "./Models";
import { log } from "./Utils";

const ALL_OVERRIDES: HookRegistrant[] = [
  DescriptiveRolls,
  DND5eActorFlags,
  CritFailThreshold,
  AutoSneakAttack,
  SpellPreparer
];

Object.values(RegisterHook).forEach(hook => {
  ALL_OVERRIDES.filter(override => override.registerWhen() == hook).forEach(override => {
    log("Loading feature: " + override.name());

    Hooks.on(hook, () => {
      override.dependsOn().forEach(moduleName => {
        if (Game().modules.get(moduleName)?.active && Game().user!.isGM) {
          ui.notifications!.error("Module 5e Settings requires the " + moduleName + " module. Please install and activate it.");
          return;
        }
      })

      log("Registering feature: " + override.name());
      override.register();
    });
  });
})