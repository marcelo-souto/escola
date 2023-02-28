import React from 'react';
import { Form } from 'react-bootstrap';
import Error from '../../helpers/Error';
import styles from './Input.module.css';

function Input({
	onChange,
	onBlur,
	value,
	setValue,
	error,
	type,
	placeholder,
	label,
	disabled,
	id,
	as,
	mask,
	min,
	max,
	ref
}) {
	return (
		<div className={styles.container}>
			<Form.Group
				className={styles.subContainer}
				controlId={id}
			>
				<Form.Label className={styles.label}>{label}</Form.Label>
				<Form.Control
					as={as}
					mask={mask}
					ref={ref}
					className={styles.input}
					onChange={onChange}
					onBlur={onBlur}
					value={value}
					type={type}
					placeholder={placeholder}
					disabled={disabled}
					min={min}
					max={max}
				/>
			</Form.Group>
			{error && <Error margin={4}>{error}</Error>}
		</div>
	);
}

export default Input;
