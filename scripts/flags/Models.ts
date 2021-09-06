export type FlagType = NumberConstructor | BooleanConstructor | StringConstructor;

export enum SettingsSection {
  FEATS = "Feats",
  CLASS = "Class Features"
}

export interface RollOptions {
  [index: string]: any;

  fumble?: number;
}

export interface DND5eActorSettings {
  [index: string]: string | number | boolean;

  weaponCritFailThreshold: number;
  spellCritFailThreshold: number;
  sneakAttackDamage: boolean;
}

export interface ExtendedConfig extends CONFIG {
  [index: string]: any;
  
  DND5E: DND5eConfig;
}

export interface DND5eConfig {
  [index: string]: Record<string, any>;
  
  characterFlags: Record<string, DND5eValidActorFlags>;
  spellPreparationModes: DND5eSpellPreperationModes;
}

export interface DND5eSpellPreperationModes {
  prepared: "Prepared",
  pact: "Pact Magic",
  always: "Always Prepared",
  atwill: "At-Will",
  innate: "Innate Spellcasting"
}

export type DND5eValidActorFlags = DND5eActorStringFlag | DND5eActorNumberFlag | DND5eActorBooleanFlag;

type ActorFlagDataType = string | number | boolean;
interface DND5eActorFlag<T extends ActorFlagDataType, D extends FlagType> {
  hint: string;
  name: string;
  placeholder: T;
  section: SettingsSection;
  type: D
}

export type DND5eActorStringFlag = DND5eActorFlag<string, StringConstructor>;
export type DND5eActorNumberFlag = DND5eActorFlag<number, NumberConstructor>;
export type DND5eActorBooleanFlag = DND5eActorFlag<boolean, BooleanConstructor>;