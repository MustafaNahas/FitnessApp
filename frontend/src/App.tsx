import "./App.css";
import ViewWorkouts from "./component/ViewWorkouts.tsx";
import {Navigate, Route, Routes} from "react-router-dom";
import ViewWorkout from "./component/ViewWorkout.tsx";
import AddWorkoutForm from "./component/AddWorkoutForm.tsx";

function App() {

  return (

    <>
            <Routes>
                <Route path="/" element={<Navigate to="/workouts" />} />
                <Route path="/workouts" element={<ViewWorkouts />} />
                <Route path="/workouts/:id" element={<ViewWorkout />} />
                <Route path="/workouts/add" element={<AddWorkoutForm />} />
            </Routes>
    </>
  )
}

export default App
