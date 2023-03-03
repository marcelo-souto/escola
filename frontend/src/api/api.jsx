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

const POST_RESEND_EMAIL = (body) => {
	return {
		url: API_URL + '/diretor/resendemail',
		options: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}
	};
};

const POST_CREATE_DIRETOR = (body) => {
	return {
		url: API_URL + '/diretor/create',
		options: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}
	};
};

const GET_PROFESSORES_BY_DIRETOR = () => {
	return {
		url: API_URL + '/diretor/get?include=professores',
		options: {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + window.localStorage.getItem('token')
			}
		}
	};
};

const POST_CREATE_PROFESSOR = (body) => {
	return {
		url: API_URL + '/professor/create',
		options: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + window.localStorage.getItem('token')
			},
			body: JSON.stringify(body)
		}
	};
};

const POST_UPDATE_PROFESSOR = (body) => {
	return {
		url: API_URL + '/professor/update',
		options: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + window.localStorage.getItem('token')
			},
			body: JSON.stringify(body)
		}
	};
};

const DELETE_DELETE_PROFESSOR = (id) => {
	return {
		url: API_URL + '/professor/delete/' + id,
		options: {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + window.localStorage.getItem('token')
			}
		}
	};
};

const GET_MATERIAS = () => {
	return {
		url: API_URL + '/materia/get',
		options: {
			method: 'GET'
		}
	};
};

const GET_TURMA_DIRETOR = () => {
	return {
		url: API_URL + '/turno/get',
		options: {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + window.localStorage.getItem('token')
			},
		}
	};
}

const GET_ANO_DIRETOR = () => {
	return {
		url: API_URL + '/ano/getall',
		options: {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + window.localStorage.getItem('token')
			},
		}
	};
}

const POST_CREATE_TURMA = (body) => {
	console.log(body)
	return {
		url: API_URL + '/turma/create',
		options: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + window.localStorage.getItem('token')
			},
			body: JSON.stringify(body)
			
		}
	};
};
export {
	POST_TOKEN,
	GET_USER,
	POST_VALIDATE_TOKEN,
	POST_RESET_PASSWORD,
	POST_CREATE_DIRETOR,
	POST_RESEND_EMAIL,
	GET_PROFESSORES_BY_DIRETOR,
	GET_MATERIAS,
	POST_CREATE_PROFESSOR,
	POST_UPDATE_PROFESSOR,
	DELETE_DELETE_PROFESSOR,
	GET_TURMA_DIRETOR,
	GET_ANO_DIRETOR,
	POST_CREATE_TURMA
};
