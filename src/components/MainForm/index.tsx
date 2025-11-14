import { PlayCircleIcon, StopCircleIcon } from "lucide-react";
import { DefaultButton } from "../DefaultButton";
import { Cycles } from "../Cycles";
import { DefaultInput } from "../DefaultInput";
import { useRef } from "react";
import type { TaskModel } from "../../models/TaskModel";
import { useTaskContext } from "../../contexts/TaskContext/UseTaskContext";
import { getNextCycle } from "../../Utils/getNextCycle";
import { getNextCycleType } from "../../Utils/getNextCycleType";
import { formatSecondsToMinutes } from "../../Utils/formatSecondsToMinutes";

export function MainForm() {
    const { state, setState } = useTaskContext();
    const taskNameInput = useRef<HTMLInputElement>(null);

    const nextCycle = getNextCycle(state.currentCycle);
    const nextCycleType = getNextCycleType(nextCycle);

    function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (taskNameInput.current === null) return;

        const taskName = taskNameInput.current.value.trim();

        if (!taskName) {
            alert('Digite o nome da tarefa');
            return;
        }

        const newTask: TaskModel = {
            id: Date.now().toString(),
            name: taskName,
            startDate: Date.now(),
            completeDate: null,
            interruptDate: null,
            duration: state.config[nextCycleType],
            type: nextCycleType
        }

        const secondsRemaining = newTask.duration * 60;

        setState(prevState => {
            return {
                ...prevState,
                activeTask: newTask,
                currentCycle: nextCycle,
                secondsRemaining: secondsRemaining,
                formattedSecondsRemaining: formatSecondsToMinutes(secondsRemaining),
                tasks: [...prevState.tasks, newTask]
            }
        })
    }

    function handleInterruptTask() {
        setState(prevState => {
            return {
                ...prevState,
                activeTask: null,
                secondsRemaining: 0,
                formattedSecondsRemaining: '00:00',
                tasks: prevState.tasks.map(task => {
                    if (prevState.activeTask && prevState.activeTask.id === task.id) {
                        return {...task, interruptDate: Date.now() };
                    }
                    return task;
                })
            }
        })
    }

    return (
        <form className="form" action="" onSubmit={handleCreateNewTask}>
            <div className="formRow">
                <DefaultInput
                    id="meuInput"
                    type="text"
                    labelText="Atividade:"
                    placeholder="Digite algo"
                    ref={taskNameInput}
                    disabled={!!state.activeTask}
                />
            </div>

            <div className="formRow">
                <p>Próximo intervalo é de 25min</p>
            </div>

            {state.currentCycle > 0 && (
                <div className="formRow">
                    <Cycles />
                </div>
            )}

            <div className="formRow">
                {!state.activeTask && (
                    <DefaultButton
                        key="submit-button"
                        type="submit"
                        aria-label="Iniciar nova tarefa"
                        title="Iniciar nova tarefa"
                        icon={<PlayCircleIcon />}
                    />
                )}

                {!!state.activeTask && (
                    <DefaultButton 
                        key="interrupt-button"
                        type="button"
                        aria-label="Interromper tarefa atual"
                        title="Interromper tarefa atual"
                        icon={<StopCircleIcon />}
                        color="red"
                        onClick={handleInterruptTask}
                    />
                )}
            </div>
        </form>
    )
}