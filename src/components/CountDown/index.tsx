import { useTaskContext } from '../../contexts/TaskContext';
import styles from './styles.module.css';

export function CountDown() {
    const taskContext = useTaskContext();
    
    return (
        <div className={styles.container}>
            {taskContext.state.formattedSecondsRemaining}
        </div>
    )
}