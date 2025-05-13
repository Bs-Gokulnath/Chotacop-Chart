import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signin from './auth/signin'
import Signup from './auth/signup'
import ChotaCopPage from './pages/Homepage'
import Chart from './pages/Chart'
import Analyze from './pages/Analyze'
import SuperAdmin from './auth/superadmin'

function App() {

  return (
    <BrowserRouter>
      <Routes>
          {/* <Route path='/' element={<ChotaCopPage />} /> */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/chart" element={<Chart />} /> */}
          <Route path="/analyze" element={<Analyze />} />
          {/* <Route path="/admin" element={<SuperAdmin />} /> */}

      </Routes>
    </BrowserRouter>
  )
}

export default App