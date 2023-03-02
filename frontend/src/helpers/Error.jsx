import React from 'react';

function Error({ children, margin }) {
	return (
		<p
			className='comeFromLeft'
			style={{
				color: '#ff0404',
				fontSize: '0.875rem',
				margin: `${margin ? margin : 12}px 0px`
			}}
		>
			{children}
		</p>
	);
}

export default Error;
