import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import DashboardProfessor from '../components/Dashboard/DashboardProfessor';
import DashboardAluno from '../components/Dashboard/DashboardAluno';
import DashboardTurma from '../components/Dashboard/DashboardTurma';
import DashboardMenu from '../components/Dashboard/DashboardMenu';
import DashboardVisaoGeral from '../components/Dashboard/DashboardVisaoGeral';
import styles from './DashboardPage.module.css';
import PageNotFound from './PageNotFound';

function DashboardPage() {
	return (
		<div className={styles.container}>
			<DashboardMenu />
			<Routes>
				<Route
					path=''
					element={<DashboardVisaoGeral />}
				/>
				<Route
					path='professor'
					element={<DashboardProfessor />}
				/>
				<Route
					path='turma'
					element={<DashboardTurma />}
				/>
				<Route
					path='aluno'
					element={<DashboardAluno />}
				/>
				<Route
					path='*'
					element={<PageNotFound />}
				/>
			</Routes>
		</div>
	);
}

export default DashboardPage;
