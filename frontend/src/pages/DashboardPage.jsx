import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import DashboardProfessor from '../components/Dashboard/DashboardProfessor'
import DashboardAluno from '../components/Dashboard/DashboardAluno'
import DashboardTurma from '../components/Dashboard/DashboardTurma'
import DashboardMenu from '../components/Dashboard/DashboardMenu';
import styles from './DashboardPage.module.css'

function DashboardPage() {
  return (
    <div className={styles.container}>
      <DashboardMenu />
      <Routes>
        <Route path='professor' element={<DashboardProfessor />} />
        <Route path='turma' element={<DashboardTurma />} />
        <Route path='aluno' element={<DashboardAluno />} />
      </Routes>
    </div>
  )
}

export default DashboardPage