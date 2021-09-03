import { ExtendedConfig } from "./flags/Models";

export enum RegisterHook {
    SETUP = "setup",
    READY = "ready"
};

export const Game: () => Game = () => game as Game;
export const Config: ExtendedConfig = CONFIG as ExtendedConfig;

export interface HookRegistrant {

    name: () => string;
    
    //Actual libWrapper registration
    register: () => void;
    
    //When to register the libWrapper override
    registerWhen: () => RegisterHook;
    
    //What libraries this libWrapper depends on
    dependsOn: () => string[];
}