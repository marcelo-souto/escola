import React from 'react';
import useFetch from '../hooks/useFetch';
import { POST_TOKEN, POST_VALIDATE_TOKEN, GET_USER } from '../api/api';
import { useNavigate } from 'react-router-dom';

export const UserContext = React.createContext();

export const UserStorage = ({ children }) => {
	const navigate = useNavigate()

	const { loading, error, request } = useFetch();

	const [loggedIn, setLoggedIn] = React.useState(false);
	const [user, setUser] = React.useState(null);

	// Fazer Logout
	const userLogout = React.useCallback(() => {
		setLoggedIn(false);
		setUser(null);
		window.localStorage.removeItem('token');
	}, []);

	// Pegar informação do usuario
	const userGet = React.useCallback(
		async (token) => {
			if (token) {
				const { url, options } = GET_USER(token);
				const { response, json } = await request(url, options);

				if (response.ok) {
					setUser(json);
					setLoggedIn(true);
				}
			}
		},
		[request]
	);

	// Fazer Login
	const userLogin = async (email, senha) => {
		const { url, options } = POST_TOKEN({ email, senha });
		const { response, json } = await request(url, options);

		if (response.ok && json.token) {
			window.localStorage.setItem('token', json.token);
			await userGet(json.token);
			navigate('/dashboard')
		}
	};

	// Fazer login automatico
	const autoLogin = React.useCallback(
		async (token) => {
			const { url, options } = POST_VALIDATE_TOKEN(token);
			const { response } = await request(url, options);

			if (response.ok) {
				await userGet(token);
				navigate('/dashboard')
			} else {
				userLogout();
			}
		},
		[request, userGet, userLogout]
	);

	React.useEffect(() => {
		const token = window.localStorage.getItem('token');

		if (token) autoLogin(token);
		else userLogout();
	}, [autoLogin, userLogout]);


	return (
		<UserContext.Provider
			value={{ user, loggedIn, userLogin, loading, error, userLogout }}
		>
			{children}
		</UserContext.Provider>
	);
};