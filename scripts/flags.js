Hooks.on("ready", () => {
    CONFIG.DND5E.characterFlags["weaponCritFailThreshold"] = {
      hint: "DND5E.FlagsWeaponCritFailThresholdHint",
      name: "DND5E.FlagsWeaponCritFailThreshold",
      placeholder: 1,
      section: "Feats",
      type: Number
    };
  
    CONFIG.DND5E.characterFlags["spellCritFailThreshold"] = {
      hint: "DND5E.FlagsSpellCritFailThresholdHint",
      name: "DND5E.FlagsSpellCritFailThreshold",
      placeholder: 1,
      section: "Feats",
      type: Number
    };
  
    CONFIG.DND5E.characterFlags["sneakAttackDamage"] = {
      hint: "DND5E.SneakAttackDamageHint",
      name: "DND5E.SneakAttackDamage",
      section: "Class Features",
      type: Boolean
    };
  });