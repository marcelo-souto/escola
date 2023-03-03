import React from 'react';

function Success({children, margin, fontSize}) {
	return (
		<p
			className='comeFromLeft'
			style={{
				color: '#37ad00',
				fontSize: fontSize ? `${fontSize}rem` : '0.875rem',
				margin: `${margin ? margin : 12}px 0px`
			}}
		>
			{children}
		</p>
	);
}

export default Success;
