import React from 'react';

function Head({ title }) {
	React.useEffect(() => {
		document.title = 'Elite | ' + title;
	}, []);

	return <></>;
}

export default Head;
