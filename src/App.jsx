import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signin from './auth/signin'
import Signup from './auth/signup'
import ChotaCopPage from './pages/Homepage'
import Chart from './pages/Chart'
import Analyze from './pages/Analyze'
import SuperAdmin from './auth/superadmin'
import Homepage from './pages/Homepage'
import QuestionTogglePage from './pages/questions'
import AdminHomepage from './pages/Admin_Home'
import Bulk_Submit from './pages/Bulk_Submit'

function App() {

  return (
    <BrowserRouter>
      <Routes>
          {/* <Route path='/' element={<ChotaCopPage />} /> */}
          <Route path='/' element={<Homepage />} />
          {/* <Route path='/' element={<AdminHomepage />} /> */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/questions" element={<QuestionTogglePage />} />
          <Route path="/admin" element={<AdminHomepage />} />
          <Route path="/bulk" element={<Bulk_Submit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App