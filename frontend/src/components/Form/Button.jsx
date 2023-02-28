import React from 'react';
import { Button as Btn } from 'react-bootstrap';

function Button({ children, variant, type, loading, onClick }) {
	return (
		<Btn
			variant={variant}
			onClick={onClick}
			type={type}
			disabled={loading}
		>
			{loading ? 'Carregando...' : children}
		</Btn>
	);
}

export default Button;
