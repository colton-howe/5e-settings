const FUMBLE_VALUE = 3;

Hooks.on("ready", () => {
  if(!game.modules.get('lib-wrapper')?.active && game.user.isGM) {
    ui.notifications.error("Module Wound Tracker requires the 'libWrapper' module. Please install and activate it.");
  }

  libWrapper.register("5e-settings", 'game.dnd5e.entities.Item5e.prototype.rollAttack', (wrapped, ...args) => {
    return wrapped({fumble: FUMBLE_VALUE, ...args});
  }, "WRAPPER");
});