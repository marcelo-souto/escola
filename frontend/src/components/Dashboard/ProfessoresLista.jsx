import React from 'react';
import Button from '../Form/Button';
import styles from './ProfessoresLista.module.css';

function Lista({ data, handleDelete, handleEdit }) {
	if (data)
		return (
			<div className={styles.lista}>
				<ul>
					{data &&
						data.map((professor, index) => {
							return (
								<li
									data-id={professor.professorId}
									key={index}
									className={styles.item}
								>
									<div>
										<p>{professor.nome}</p>
										<p>{professor.materia.nome}</p>

										{professor.turmas.map((turma) => {
											return <p>{turma}</p>;
										})}
										
									</div>

									<Button
										variant='secondary'
										onClick={handleEdit}
									>
										Editar
									</Button>
									<Button
										variant='danger'
										onClick={handleDelete}
									>
										Excluir
									</Button>
								</li>
							);
						})}
				</ul>
			</div>
		);
}

export default Lista;
