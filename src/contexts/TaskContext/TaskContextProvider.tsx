import { useEffect, useReducer, useState } from "react";
import { initialTaskState } from "./initialTaskState";
import { TaskContext } from "./TaskContext";
import { taskReducer } from "./TaskReducer";
import { TimerWorkerManager } from "../../workers/TimerWorkerManager";
import { TaskActionsTypes } from "./TaskActions";

type TaskContextProviderProps = {
    children: React.ReactNode;
}

export function TaskContextProvider({ children }: TaskContextProviderProps) {
    const [state, dispatch] = useReducer(taskReducer, initialTaskState);

    const worker = TimerWorkerManager.getInstance();

    worker.onmessage(e => {
        const { countDownSeconds } = e.data;

        if (countDownSeconds <= 0) {
            dispatch({ type: TaskActionsTypes.COMPLETE_TASK });
            worker.terminate();
        } else {
            dispatch({
                type: TaskActionsTypes.COUNT_DOWN,
                payload: {
                    secondsRemaining: countDownSeconds
                }
            });
        }
    });

    useEffect(() => {
        if (!state.activeTask) {
            worker.terminate();
        }

        worker.postMessage(state);
    }, [worker, state]);

    return (
        <TaskContext.Provider value={{ state, dispatch }}>
            {children}
        </TaskContext.Provider>
    );
}