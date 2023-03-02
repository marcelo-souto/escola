import React from 'react';
import { Button as Btn } from 'react-bootstrap';

function Button({ disabled, children, variant, type, loading, onClick, as, to, ...props}) {
	return (
		<Btn
			variant={variant}
			as={as}
			onClick={onClick}
			type={type}
			disabled={loading || disabled}
			to={to}
			style={{width: 'max-content', fontWeight: '500', height: 'max-content'}}
			{...props}
		>
			{loading ? 'Carregando...' : children}
		</Btn>
	);
}

export default Button;
