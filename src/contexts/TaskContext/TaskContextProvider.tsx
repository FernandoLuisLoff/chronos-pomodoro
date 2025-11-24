import { useEffect, useReducer, useRef } from "react";
import { initialTaskState } from "./initialTaskState";
import { TaskContext } from "./TaskContext";
import { taskReducer } from "./TaskReducer";
import { TimerWorkerManager } from "../../workers/TimerWorkerManager";
import { TaskActionsTypes } from "./TaskActions";
import { loadBeep } from "../../Utils/loadBeep";
import type { TaskStateModel } from "../../models/TaskStateModel";

type TaskContextProviderProps = {
    children: React.ReactNode;
}

export function TaskContextProvider({ children }: TaskContextProviderProps) {
    const [state, dispatch] = useReducer(taskReducer, initialTaskState, () => {
        const storageState = localStorage.getItem('state');

        if (storageState === null) return initialTaskState;

        const parsedStorageState = JSON.parse(storageState) as TaskStateModel;

        return {
            ...parsedStorageState,
            activeTask: null,
            secondsRemaining: 0,
            formattedSecondsRemaining: '00:00'
        };
    });
    const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);

    const worker = TimerWorkerManager.getInstance();

    worker.onmessage(e => {
        const { countDownSeconds } = e.data;

        if (countDownSeconds <= 0) {
            if (playBeepRef.current) {
                playBeepRef.current();
            }
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
        localStorage.setItem('state', JSON.stringify(state));

        if (!state.activeTask) {
            worker.terminate();
        }

        document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`;

        worker.postMessage(state);
    }, [worker, state]);

    useEffect(() => {
        if (state.activeTask && playBeepRef.current === null) {
            playBeepRef.current = loadBeep();
        } else {
            playBeepRef.current = null;
        }
    }, [state.activeTask]);

    return (
        <TaskContext.Provider value={{ state, dispatch }}>
            {children}
        </TaskContext.Provider>
    );
}