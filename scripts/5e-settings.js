let midiQOLInstalled = false;

const characterHasAllyWithin5Feet = (user) => {
  const activeScene = game.scenes.get(user.viewedScene);
  if (activeScene == null) {
    return false;
  }

  const gridDistance = activeScene.data.gridDistance;
  if (gridDistance == null) {
    return false;
  }


  let foundNearbyToken = false;
  let targetIterator = user.targets.values();
  let target = targetIterator.next();
  while (!target.done && !foundNearbyToken) {
    if (target.value.scene.id == activeScene.id) {
      const tokensNearTarget = MidiQOL.findNearby(null, target.value, gridDistance);
      const characterNearby = tokensNearTarget.some(token => token.actor.data.type === "character");
      if (characterNearby) {
        foundNearbyToken = true;
      }
    }

    target = targetIterator.next();
  } 
  
  return foundNearbyToken;
}

Hooks.on("setup", () => {
  if (!game.modules.get('lib-wrapper')?.active && game.user.isGM) {
    ui.notifications.error("Module 5e Settings requires the 'libWrapper' module. Please install and activate it.");
    "Module 5e Settings requires the 'libWrapper' module. Please install and activate it."
    return;
  }

  midiQOLInstalled = game.modules.get('midi-qol');

  //For handling the flags
  libWrapper.register("5e-settings", 'CONFIG.Item.entityClass.prototype.rollAttack', function (wrapped, ...args) {
    const actor = this.actor;
    const options = {...args[0]};
    const flags = actor.data.flags.dnd5e;

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

  
  libWrapper.register("5e-settings", 'Roll.prototype.render', async function (wrapped, ...args) {
    return wrapped(args[0]);
  }, "WRAPPER");
    

  libWrapper.register("5e-settings", 'CONFIG.Item.entityClass.prototype.rollDamage', async function (wrapped, ...args) {
    if (this.data.type !== "weapon") {
      //If item isn't a weapon, then don't do anything
      return wrapped(args[0]);
    }

    const flags = this.actor.data.flags.dnd5e;
    if (!flags || !flags.sneakAttackDamage) {
      return wrapped(args[0]);
    }

    const itemData = this.data.data;

    //Determines if sneak attack applys based on if the weapon is finesse OR ranged
    const isFinesseWeapon = itemData.properties.fin;
    const isRangedWeapon = itemData.weaponType === "simpleR" || itemData.weaponType === "martialR";
    const itemCanSneakAttack = isFinesseWeapon || isRangedWeapon;

    let characterCanSneakAttack = true;

    //If there is a target, then we can try and figure out if they have advantage or have any ally within 5 feet
    if (midiQOLInstalled && game.user.targets.size == 1) {
      const itemWorkflow = MidiQOL.Workflow.getWorkflow(this.id);
      characterCanSneakAttack = false;
      if (itemWorkflow && itemWorkflow.attackRoll && itemWorkflow.attackRoll.terms.find(term => term instanceof Die).options.advantage) {
        characterCanSneakAttack = true;
      } else {
        characterCanSneakAttack = characterHasAllyWithin5Feet(game.user);
      }
    }

    const roll = await wrapped(args[0]);

    const sneakAttackFeature = this.actor.items.find(item => item.name === "Sneak Attack");
    if (sneakAttackFeature && roll && itemCanSneakAttack && characterCanSneakAttack) {
      sneakAttackFeature.roll();
    }

    return roll;
  }, "WRAPPER");
});