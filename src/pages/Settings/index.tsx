import { Save } from "lucide-react";
import { Container } from "../../components/Container";
import { DefaultButton } from "../../components/DefaultButton";
import { DefaultInput } from "../../components/DefaultInput";
import { MainTemplate } from "../../templates/MainTemplate";
import { Heading } from "../../components/Heading";
import { useEffect, useRef } from "react";
import { useTaskContext } from "../../contexts/TaskContext/useTaskContext";
import { showMessage } from "../../adapters/showMessage";
import { TaskActionsTypes } from "../../contexts/TaskContext/TaskActions";

export function Settings() {
    const { state, dispatch } = useTaskContext();
    const workTimeInputRef = useRef<HTMLInputElement>(null);
    const shortBreakTimeInputRef = useRef<HTMLInputElement>(null);
    const longBreakTimeInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        document.title = 'Configurações - Chronos Pomodoro';
    }, []);

    function handleSaveSettings(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        showMessage.dismiss();

        const formErros = [];

        const workTime = Number(workTimeInputRef.current?.value);
        const shortBreakTime = Number(shortBreakTimeInputRef.current?.value);
        const longBreakTime = Number(longBreakTimeInputRef.current?.value);

        if (isNaN(workTime) && isNaN(shortBreakTime) && isNaN(longBreakTime)) {
            formErros.push('Digite apenas numeros para TODOS os campos.');
        }

        if (workTime < 1 || workTime > 99) {
            formErros.push('Digite valores entre 1 e 99 para foco.');
        }

        if (shortBreakTime < 1 || shortBreakTime > 30) {
            formErros.push('Digite valores entre 1 e 30 para descanso curto.');
        }

        if (longBreakTime < 1 || longBreakTime > 60) {
            formErros.push('Digite valores entre 1 e 60 para descanso longo.');
        }

        if (formErros.length > 0) {
            formErros.forEach(error => {
                showMessage.error(error);
            });
            return;
        }

        dispatch({
            type: TaskActionsTypes.CHANGE_SETTINGS,
            payload: { workTime, shortBreakTime, longBreakTime }
        });

        showMessage.success('Configurações salvas');
    }

    return (
        <MainTemplate>
            <Container>
                <Heading>Configurações</Heading>
            </Container>

            <Container>
                <p style={{ textAlign: 'center' }}>
                    Modifique as configurações para tempo de foco, descanso curto e descanso longo.
                </p>
            </Container>

            <Container>
                <form className="form" action='' onSubmit={handleSaveSettings}>
                    <div className="formRow">
                        <DefaultInput
                            id="workTime"
                            type="number"
                            labelText="Foco"
                            ref={workTimeInputRef}
                            defaultValue={state.config.workTime}
                        />
                    </div>
                    <div className="formRow">
                        <DefaultInput
                            id="shortBreakTime"
                            type="number"
                            labelText="Descanso curto"
                            ref={shortBreakTimeInputRef}
                            defaultValue={state.config.shortBreakTime}
                        />
                    </div>
                    <div className="formRow">
                        <DefaultInput
                            id="longBreakTime"
                            type="number"
                            labelText="Descanso longo"
                            ref={longBreakTimeInputRef}
                            defaultValue={state.config.longBreakTime}
                        />
                    </div>
                    <div className="formRow">
                        <DefaultButton
                            icon={<Save />}
                            aria-label="Salvar configurações"
                            title="Salvar configurações"
                        />
                    </div>
                </form>
            </Container>
        </MainTemplate>
    )
    
}