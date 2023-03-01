import React from 'react';
import { Form } from 'react-bootstrap';
import styles from './Input.module.css';
import Error from '../../helpers/Error';

function InputSelect({
	options,
	label,
	defaultOption,
	value,
	onChange,
	error
}) {
	return (
		<div className={styles.container}>
			<p
				className={styles.label}
				style={{ marginBottom: '8px' }}
			>
				{label}
			</p>
			<Form.Select
				className={styles.input}
				onChange={onChange}
				value={value}
			>
				<option value=''>{defaultOption}</option>
				{options &&
					options.map(({ option, value }, index) => {
						return (
							<option
								key={index + option}
								value={value}
							>
								{option}
							</option>
						);
					})}
			</Form.Select>
			{error && <Error margin={4}>{error}</Error>}
		</div>
	);
}

export default InputSelect;
