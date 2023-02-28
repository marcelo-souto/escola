const API_URL = 'http://localhost:8080';

// Login
const POST_TOKEN = (body) => {
	return {
		url: API_URL + '/diretor/auth',
		options: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}
	};
};

const POST_VALIDATE_TOKEN = (token) => {
	return {
		url: API_URL + '/token/validate',
		options: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ token })
		}
	};
};

const GET_USER = (token) => {
	return {
		url: API_URL + '/diretor/get',
		options: {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token
			}
		}
	};
};

const POST_RESET_PASSWORD = (body) => {
	return {
		url: API_URL + '/diretor/resetpassword',
		options: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}
	};
};

export { POST_TOKEN, GET_USER, POST_VALIDATE_TOKEN, POST_RESET_PASSWORD };
