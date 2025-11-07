import { createContext, useContext, useState } from "react";
import type { TaskStateModel } from "../../models/TaskStateModel";


const intitialState: TaskStateModel = {
    tasks: [],
    secondsRemaining: 0,
    formattedSecondsRemaining: '00:00',
    activeTask: null,
    currentCycle: 0,
    config: {
        workTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15
    }
}

type TaskContextProps = {
    state: TaskStateModel;
    setState: React.Dispatch<React.SetStateAction<TaskStateModel>>;
}

const initialContextValue: TaskContextProps = {
    state: intitialState,
    setState: () => {}
}

type TaskContextProviderProps = {
    children: React.ReactNode;
}

export const TaskContext = createContext<TaskContextProps>(initialContextValue);


export function TaskContextProvider({ children }: TaskContextProviderProps) {
    const [state, setState] = useState(intitialState);

    return (
        <TaskContext.Provider value={{ state, setState }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTaskContext() {
    return useContext(TaskContext);
}