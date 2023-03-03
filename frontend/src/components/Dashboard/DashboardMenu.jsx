import React from 'react';
import styles from './DashboardMenu.module.css';
import { NavLink } from 'react-router-dom';

function DashboardMenu() {
	return (
		<aside className={`${styles.menu} comeFromLeft`}>
			<nav>
				<ul>
					<li>
						<NavLink
							className={styles.button}
							to=''
							end
						>
							Visão Geral
						</NavLink>
					</li>
					<li>
						<NavLink
							className={styles.button}
							to='professor'
						>
							Professores
						</NavLink>
					</li>
					<li>
						<NavLink
							className={styles.button}
							to='turma'
						>
							Turmas
						</NavLink>
					</li>
					<li>
						<NavLink
							className={styles.button}
							to='aluno'
						>
							Alunos
						</NavLink>
					</li>
				</ul>
			</nav>
		</aside>
	);
}

export default DashboardMenu;
