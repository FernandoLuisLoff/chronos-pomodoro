import { useTaskContext } from "../../contexts/TaskContext/UseTaskContext";
import { getNextCycle } from "../../Utils/getNextCycle";
import { getNextCycleType } from "../../Utils/getNextCycleType";

export function Tips() {
    const { state } = useTaskContext();
    
    const nextCycle = getNextCycle(state.currentCycle);
    const nextCycleType = getNextCycleType(nextCycle);

    const tipsForWhenActiveTask = {
        workTime: <span>Foque por <b>{state.config.workTime}min</b></span>,
        shortBreakTime: <span>Descanse por <b>{state.config.shortBreakTime}min</b></span>,
        longBreakTime: <span>Descanso <b>longo</b></span>
    }

    const tipsForWhenNoActiveTask = {
        workTime: <span>Próximo ciclo é de <b>{state.config.workTime}min</b></span>,
        shortBreakTime: <span>Próximo ciclo é de <b>{state.config.shortBreakTime}min</b></span>,
        longBreakTime: <span>Próximo descanso sera <b>longo</b></span>
    }

    return (
        <>
            {!!state.activeTask && tipsForWhenActiveTask[state.activeTask.type]}
            {!state.activeTask && tipsForWhenNoActiveTask[nextCycleType]}
        </>
    )
}