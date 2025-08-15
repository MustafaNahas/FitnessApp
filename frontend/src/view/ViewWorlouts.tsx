import {useEffect, useState} from "react";
import axios from "axios";

export  default function ViewWorlouts(){

    const [workouts, setWorkouts] = useState([{id: "",
                                              description: "",
                                              workoutName: ""}]);
    function loadTodos() {
        axios.get("/api/workouts")
            .then(res => {
                setWorkouts(res.data);
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        loadTodos();
    }, []);

return(
    <>
        {workouts.map(workout => (
            <div key={workout.id} className="workout-card">
                <p><strong>Name:</strong> {workout.workoutName}</p>
                <p><strong>Description:</strong> {workout.description}</p>
            </div>
        ))}
    </>
)

}