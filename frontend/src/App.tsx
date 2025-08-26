import "./App.css";
import ViewWorkouts from "./component/ViewWorkouts.tsx";
import { Route, Routes} from "react-router-dom";
import ViewWorkout from "./component/ViewWorkout.tsx";
import AddWorkoutForm from "./component/AddWorkoutForm.tsx";
import Navbar from "./component/Navbar.tsx";
import axios from "axios";
import {useEffect, useState} from "react";
import ProtectedRoute from "./component/ProtectedRoute.tsx";


function App() {
    const [user, setUser] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const loadUser = () => {
        axios.get('/api/auth/me')
            .then(response => {
                setUser(response.data)
                setLoading(false)
            })
            .catch(e => {
                console.log(e)
                setUser(null)
                setLoading(false)
            })
    }

    useEffect(() => {
        loadUser()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

  return (
      <>
          <h2>Welcome {user}</h2>
          <Navbar user={user} onUserChange={setUser} />

          <Routes>
              <Route path="/" element={
                  <ProtectedRoute user={user}>
                      <ViewWorkouts />
                  </ProtectedRoute>
              } />

              <Route path="/workouts" element={
                  <ProtectedRoute user={user}>
                      <ViewWorkouts />
                  </ProtectedRoute>
              } />

              <Route path="/workouts/:id" element={
                  <ProtectedRoute user={user}>
                      <ViewWorkout />
                  </ProtectedRoute>
              } />

              <Route path="/workouts/add" element={
                  <ProtectedRoute user={user}>
                      <AddWorkoutForm />
                  </ProtectedRoute>
              } />
          </Routes>
      </>
  )
}

export default App
