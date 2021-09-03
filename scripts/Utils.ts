import { Game } from "./Models";

export const characterHasAllyWithin5Feet = (user: User | null) => {
    if (user == null) {
        return false;
    }
    
    const activeScene = Game().scenes!.get(user.viewedScene as string);
    if (activeScene == null) {
      return false;
    }
  
    const gridDistance = activeScene.data.gridDistance;
    if (gridDistance == null) {
      return false;
    }
  
    let foundNearbyToken = false;
    const targetIterator = user.targets.values();
    let target = targetIterator.next();
    while (!target.done && !foundNearbyToken) {
      if (target.value.scene.id == activeScene.id) {
        const tokensNearTarget = MidiQOL.findNearby(null, target.value, gridDistance);
        if (tokensNearTarget.some(token => token.actor!.data.type === "character")) {
          foundNearbyToken = true;
        }
      }
  
      target = targetIterator.next();
    } 
    
    return foundNearbyToken;
}

export const log = (msg: string) => {
  console.log("5e-settings | " + msg);
}