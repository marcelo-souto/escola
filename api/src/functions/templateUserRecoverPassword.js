require('dotenv').config();

const url = process.env.URL;

const templateUserConfirmationEmail = (senha) => {
	const email = `<html lang="pt-br">
	<body
	style="
		font-family: Arial, Helvetica, sans-serif;
		text-align: center;
		margin: 0;
	"
	>
	<h3
		style="
			font-size: 1.8rem;
			background-color: #171717;
			color: #f1f1f1;
			border-radius: 16px 16px 0px 0px;
			padding: 32px;
			font-weight: 500;
			margin: 0;
		"
	>
		Recuperação de Senha
	</h3>
	<div style="padding: 42px; background: #F5F5F5; border-radius: 0px 0px 16px 16px;">
	<p
		style="
			font-size: 1rem;
			max-width: 580px;
			margin: 42px auto;
			line-height: 1.4;
			color: #000000;
		"
	>
		Para acessar sua conta novamente foi gerado uma senha provisória para você:
	</p>
	<p
		style="
			font-size: 1rem;
			max-width: max-content;
			margin: 42px auto;
			padding: 24px 32px;
			border-radius: 8px;
			background: #C1C1C1;
			line-height: 1.4;
			color: #000000;
		"
	>
		${senha}
	</p>
	<a
		style="
			display: block;
			padding: 16px 32px;
			background-color: #ffd900;
			text-decoration: none;
			color: #323232;
			font-size: 1rem;
			font-weight: 600;
			width: max-content;
			border-radius: 6px;
			margin: 0 auto;
		"
		href="${url}"
		>Ir para o site</a
	>
	</div>
	</body>
	</html>`;

	return email;
};

module.exports = templateUserConfirmationEmail;
