import { createContext, useContext, useState, type ReactNode } from "react";
import {
    type Project,
    type ProjectMembers,
    type ProjectTasks,
    type SubTask,
} from "@/types/project";

export type StoreState = {
    projects: Project[];
    projectMembers: ProjectMembers;
    projectTasks: Record<string, ProjectTasks>;
    projectTaskSubTasks: Record<string, Record<string, SubTask[]>>;
};

//initial state
export const initialState: StoreState = {
    projects: [],
    projectMembers: {},
    projectTasks: {},
    projectTaskSubTasks: {},
};

type StoreContextState = {
    store: StoreState;
    setStore: React.Dispatch<React.SetStateAction<StoreState>>;
};

type Props = {
    children: ReactNode;
};

const StoreContext = createContext<StoreContextState | undefined>(undefined);

export const StoreProvider = ({ children }: Props) => {
    const [store, setStore] = useState<StoreState>(initialState);

    const value: StoreContextState = {
        store,
        setStore,
    };
    return (
        <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    );
};

export const useStore = (): StoreContextState => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
};
