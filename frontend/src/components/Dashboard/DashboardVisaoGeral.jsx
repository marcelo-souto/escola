import React from 'react';
import styles from './DashboardProfessor.module.css';
import { GET_PROFESSORES_BY_DIRETOR } from '../../api/api';
import useFetch from '../../hooks/useFetch';
import Loading from '../../helpers/Loading';
import { ReactComponent as ProfessorIcone } from '../../img/chapeu.svg';
import { ReactComponent as TurmaIcone } from '../../img/turma.svg';
import Button from '../Form/Button';
import { Link } from 'react-router-dom';
import Head from '../../helpers/Head'

function DashboardVisaoGeral() {
	const { loading, data, error, request } = useFetch();

	React.useEffect(() => {
		const getData = async () => {
			const { url, options } = GET_PROFESSORES_BY_DIRETOR();
			await request(url, options);
		};

		getData();
	}, []);

	if (loading) return <Loading />;
	return (
		<section className={styles.container}>
			<Head title='Visão Geral' />
			<h1 className={`${styles.title2} comeFromRight`}>Visão Geral</h1>
			<div className={`${styles.visaoGeral} comeFromRight`}>
				{data && data.professores && (
					<div>
						<p>
							<ProfessorIcone />
							{data.professores.length > 0 ? (
								<>
									{data.professores.length}{' '}
									{data.professores.length > 1 ? 'Professores' : 'Professor'}
								</>
							) : (
								<>Não há cadastros</>
							)}
						</p>
						<Button
							as={Link}
							to='/dashboard/professor'
						>
							Ver Mais
						</Button>
					</div>
				)}
				{data && data.turmas && (
					<div>
						<p>
							{data.turmas.length > 0 ? (
								<>
									<TurmaIcone
										style={{ marginLeft: '8px', marginRight: '8px' }}
										height='56'
									/>
									{data.turmas.length}{' '}
									{data.turmas.length > 1 ? 'Turmas' : 'Turma'}
								</>
							) : (
								<>Não há cadastros</>
							)}
						</p>
						<Button
							as={Link}
							to='/dashboard/turma'
						>
							Ver mais
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}

export default DashboardVisaoGeral;
