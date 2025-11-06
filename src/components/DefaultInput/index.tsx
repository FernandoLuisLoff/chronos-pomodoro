import styles from './styles.module.css';

type DefaultInputProps = {
    id: string;
    labelText: string;
} & React.ComponentProps<'input'>;

export function DefaultInput({ id, labelText, ...props }: DefaultInputProps) {
    return (
        <>
            <label htmlFor={id}>{labelText}</label>
            <input id={id} {...props} className={styles.input} />
        </>
    );
}