import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StudentProvider, useStudent } from './context/StudentContext'
import Onboarding from './pages/Onboarding'
import StudentWorld from './pages/StudentWorld'
import Mission1GreenDetective from './pages/Mission1GreenDetective'
import Mission2ThinkBeforeCode from './pages/Mission2ThinkBeforeCode'
import Mission3AlgorithmBuilder from './pages/Mission3AlgorithmBuilder'
import Mission4DebugDetective from './pages/Mission4DebugDetective'
import Mission5GreenSorter from './pages/Mission5GreenSorter'
import Mission6CodeBuilder from './pages/Mission6CodeBuilder'
import Mission7GameCreator from './pages/Mission7GameCreator'
import CodingLabHub from './pages/CodingLabHub'
import CodingLabLevel from './pages/CodingLabLevel'
import Assessment from './pages/Assessment'
import TeacherDashboard from './pages/TeacherDashboard'
import EvidenceReport from './pages/EvidenceReport'
import ClassProgress from './pages/ClassProgress'
import CreatorStudioHub from './pages/CreatorStudioHub'
import NewProject from './pages/NewProject'
import ProjectDetail from './pages/ProjectDetail'
import BrowseProjects from './pages/BrowseProjects'
import GreenPortfolio from './pages/GreenPortfolio'

function RequireProfile({ children }: { children: React.ReactElement }) {
  const { profile } = useStudent()
  if (!profile) return <Navigate to="/" replace />
  return children
}

function Routed() {
  const { profile } = useStudent()
  return (
    <Routes>
      <Route path="/" element={profile ? <Navigate to="/world" replace /> : <Onboarding />} />
      <Route
        path="/world"
        element={
          <RequireProfile>
            <StudentWorld />
          </RequireProfile>
        }
      />
      <Route
        path="/mission/m1"
        element={
          <RequireProfile>
            <Mission1GreenDetective />
          </RequireProfile>
        }
      />
      <Route
        path="/mission/m2"
        element={
          <RequireProfile>
            <Mission2ThinkBeforeCode />
          </RequireProfile>
        }
      />
      <Route
        path="/mission/m3"
        element={
          <RequireProfile>
            <Mission3AlgorithmBuilder />
          </RequireProfile>
        }
      />
      <Route
        path="/mission/m4"
        element={
          <RequireProfile>
            <Mission4DebugDetective />
          </RequireProfile>
        }
      />
      <Route
        path="/mission/m5"
        element={
          <RequireProfile>
            <Mission5GreenSorter />
          </RequireProfile>
        }
      />
      <Route
        path="/mission/m6"
        element={
          <RequireProfile>
            <Mission6CodeBuilder />
          </RequireProfile>
        }
      />
      <Route
        path="/mission/m7"
        element={
          <RequireProfile>
            <Mission7GameCreator />
          </RequireProfile>
        }
      />
      <Route
        path="/lab"
        element={
          <RequireProfile>
            <CodingLabHub />
          </RequireProfile>
        }
      />
      <Route
        path="/lab/:levelId"
        element={
          <RequireProfile>
            <CodingLabLevel />
          </RequireProfile>
        }
      />
      <Route
        path="/assessment/:type"
        element={
          <RequireProfile>
            <Assessment />
          </RequireProfile>
        }
      />
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/evidence" element={<EvidenceReport />} />
      <Route
        path="/progress"
        element={
          <RequireProfile>
            <ClassProgress />
          </RequireProfile>
        }
      />
      <Route
        path="/studio"
        element={
          <RequireProfile>
            <CreatorStudioHub />
          </RequireProfile>
        }
      />
      <Route
        path="/studio/new"
        element={
          <RequireProfile>
            <NewProject />
          </RequireProfile>
        }
      />
      <Route
        path="/studio/browse"
        element={
          <RequireProfile>
            <BrowseProjects />
          </RequireProfile>
        }
      />
      <Route
        path="/studio/project/:projectId"
        element={
          <RequireProfile>
            <ProjectDetail />
          </RequireProfile>
        }
      />
      <Route
        path="/portfolio"
        element={
          <RequireProfile>
            <GreenPortfolio />
          </RequireProfile>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <StudentProvider>
      <HashRouter>
        <Routed />
      </HashRouter>
    </StudentProvider>
  )
}
