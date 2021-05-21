Hooks.on("setup", () => {
  if(!game.modules.get('lib-wrapper')?.active && game.user.isGM) {
    ui.notifications.error("Module Wound Tracker requires the 'libWrapper' module. Please install and activate it.");
  }

  libWrapper.register("5e-settings", 'CONFIG.Item.entityClass.prototype.rollAttack', function (wrapped, ...args) {
    const actor = this.actor;
    const options = {...args[0]};
    const flags = actor.data.flags.dnd5e;

    //Modify fumble values if needed
    if (this.type == "weapon" && flags.weaponCritFailThreshold != null) {
      options.fumble = flags.weaponCritFailThreshold;
    } else if (this.type == "spell" && flags.spellCritFailThreshold != null) {
      options.fumble = flags.spellCritFailThreshold;
    }

    return wrapped(options);
  }, "MIXED");
});

Hooks.on("ready", () => {
  CONFIG.DND5E.characterFlags["weaponCritFailThreshold"] = {
    hint: "DND5E.FlagsWeaponCritFailThresholdHint",
    name: "DND5E.FlagsWeaponCritFailThreshold",
    placeholder: 1,
    section: "Feats",
    type: Number,
  };

  CONFIG.DND5E.characterFlags["spellCritFailThreshold"] = {
    hint: "DND5E.FlagsSpellCritFailThresholdHint",
    name: "DND5E.FlagsSpellCritFailThreshold",
    placeholder: 1,
    section: "Feats",
    type: Number,
  };
});