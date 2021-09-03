// Globals that don't have types
declare namespace libWrapper {

    const register: (moduleName: string, pathToFunction: string, wrappedFn: (wrapped: Function, args: any[]) => any, wrapType: "WRAPPER" | "MIXED" | "OVERRIDE") => void;
    
}

declare namespace MidiQOL {

    const findNearby: (tokenOrientation: number | null, target: Token, gridDistance: number) => Token[];

    const Workflow: WorkflowContainer;

    interface WorkflowContainer {
        getWorkflow: (itemId: string | null) => ItemWorkflow;
    }

    interface ItemWorkflow {
        attackRoll: Roll;
    }
}