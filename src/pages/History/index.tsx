import { TrashIcon } from "lucide-react";
import { Container } from "../../components/Container";
import { DefaultButton } from "../../components/DefaultButton";
import { Heading } from "../../components/Heading";
import { MainTemplate } from "../../templates/MainTemplate";
import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { formatDate } from "../../Utils/formatDate";
import { getTaskStatus } from "../../Utils/getTaskStatus";
import { sortTasks, type SortTasksOptions } from "../../Utils/sortTasks";
import { useEffect, useState } from "react";
import { TaskActionsTypes } from "../../contexts/TaskContext/TaskActions";
import { showMessage } from "../../adapters/showMessage";

import styles from './styles.module.css';

export function History() {
    const { state, dispatch } = useTaskContext();
    const hasTasks = state.tasks.length > 0;
    const [confirmClearHistory, setConfirmClearHistory] = useState(false);
    const [sortTasksOptions, setSortTasksOptions] = useState<SortTasksOptions>(() => {
        return {
            tasks: sortTasks({ tasks: state.tasks }),
            field: 'startDate',
            direction: 'desc',
        };
    });

    useEffect(() => {
        document.title = 'Histórico - Chronos Pomodoro';
    }, []);

    useEffect(() => {
        setSortTasksOptions((prevState) => ({
            ...prevState,
            tasks: sortTasks({
                tasks: state.tasks,
                field: prevState.field,
                direction: prevState.direction
            }),
        }));
    }, [state.tasks]);

    function handleSortTasks({ field }: Pick<SortTasksOptions, 'field'>) {
        const newDirection = sortTasksOptions.direction === 'desc' ? 'asc' : 'desc';

        setSortTasksOptions({
            direction: newDirection,
            field,
            tasks: sortTasks({ tasks: state.tasks, field, direction: newDirection })
        });
    }

    function handleResetHistory() {
        showMessage.dismiss();
        showMessage.confirm('Tem certeza?', (confirmation) => {
            setConfirmClearHistory(confirmation);
        });
    }

    useEffect(() => {
        if (!confirmClearHistory) return;

        setConfirmClearHistory(false);

        dispatch({ type: TaskActionsTypes.RESET_STATE });
    }, [confirmClearHistory, dispatch]);

    useEffect(() => {
        return () => {
            showMessage.dismiss();
        }
    }, []);

    return (
        <MainTemplate>
            <Container>
                <Heading>
                    <span>History</span>
                    {hasTasks && (
                        <span className={styles.buttonContainer}>
                            <DefaultButton
                                icon={<TrashIcon />}
                                color='red'
                                aria-label="Apagar todo o histórico"
                                title="Apagar histórico"
                                onClick={handleResetHistory}
                            />
                        </span>
                    )}
                </Heading>
            </Container>
            <Container>
                {hasTasks && (
                    <div className={styles.responsiveTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th
                                        onClick={() => handleSortTasks({ field: 'name'})}
                                        className={styles.thSort}
                                    >
                                        Tarefa ↕
                                    </th>
                                    <th
                                        onClick={() => handleSortTasks({ field: 'duration'})}
                                        className={styles.thSort}
                                    >
                                        Duração ↕
                                    </th>
                                    <th
                                        onClick={() => handleSortTasks({ field: 'startDate'})}
                                        className={styles.thSort}
                                    >
                                        Inicio Data ↕
                                    </th>
                                    <th>Status</th>
                                    <th>Tipo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortTasksOptions.tasks.map(task => {
                                    const taskTypeDictionary = {
                                        workTime: 'Foco',
                                        shortBreakTime: 'Descanso curto',
                                        longBreakTime: 'Descanso longo'
                                    }
                                    return (
                                        <tr key={task.id}>
                                            <td>{task.name}</td>
                                            <td>{task.duration}min</td>
                                            <td>{formatDate(task.startDate)}</td>
                                            <td>{getTaskStatus(task, state.activeTask)}</td>
                                            <td>{taskTypeDictionary[task.type]}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {!hasTasks && (
                    <p className={styles.noHasTasks}>Ainda não existem tarefas criadas</p>
                )}
            </Container>
        </MainTemplate>
    )
    
}