import React from 'react';
import { Button as Btn } from 'react-bootstrap';

function Button({ children, variant, type, loading }) {
	return (
		<Btn
			variant={variant}
			type={type}
			disabled={loading}
		>
			{loading ? 'Carregando...' : children}
		</Btn>
	);
}

export default Button;
