import React from 'react';

function Head({ title }) {
	
	React.useEffect(() => {
		document.title = 'Elite | ' + title;
	}, [title]);

	return <></>;
}

export default Head;
