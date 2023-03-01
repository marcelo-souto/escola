import React from 'react';
import { Form } from 'react-bootstrap';
import Error from '../../helpers/Error';
import styles from './Input.module.css';

const Input = React.forwardRef((props, ref) => {
	return (
		<div className={styles.container}>
			<Form.Group
				className={styles.subContainer}
				controlId={props.id}
			>
				<Form.Label className={styles.label}>{props.label}</Form.Label>
				<Form.Control
					as={props.as}
					ref={ref}
					mask={props.mask}
					className={styles.input}
					onChange={props.onChange}
					onBlur={props.onBlur}
					value={props.value}
					type={props.type}
					placeholder={props.placeholder}
					disabled={props.disabled}
					min={props.min}
					max={props.max}
				/>
			</Form.Group>
			{props.error && <Error margin={4}>{props.error}</Error>}
		</div>
	);
})

export default Input;
