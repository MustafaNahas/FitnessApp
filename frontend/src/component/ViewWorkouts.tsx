import "../App.css"
import {useEffect, useState} from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faDumbbell, faPersonBiking, faPersonRunning, faPersonWalking} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";

export default function ViewWorkouts(){

    const nav = useNavigate();
    const [workouts, setWorkouts] = useState([{id: "", description: "", workoutName: ""}]);


    function loadTodos() {
        axios.get("/api/workouts")
            .then(res => {
                setWorkouts(res.data);
            })
            .catch(err => {
                console.error(err)
                alert(err)
            });
    }



    useEffect(() => {
        loadTodos();
    }, []);

    function handleGetById(id: string) {
        nav(`/workouts/${id}`);
    }


    return(
        <div className={"ViewWorkouts"}>
            <h1>Workouts</h1>
            {workouts.map(workout => (
                <button key={workout.id} className="workout-card" onClick={() => handleGetById(workout.id)}
                >
                    {workout.workoutName==="Running"?
                        <h2><FontAwesomeIcon icon={faPersonRunning} /> {workout.workoutName}</h2>:null
                    }
                    {workout.workoutName==="Weight training"?
                        <h2><FontAwesomeIcon icon={faPersonRunning} /> {workout.workoutName}</h2>:null
                    }
                    {workout.workoutName==="Walking"?
                        <h2><FontAwesomeIcon icon={faPersonWalking} /> {workout.workoutName}</h2>:null
                    }
                    {workout.workoutName==="Cycling"?
                        <h2><FontAwesomeIcon icon={faPersonBiking} /> {workout.workoutName}</h2>:null
                    }
                    {workout.workoutName==="Lifting"?
                        <h2><FontAwesomeIcon icon={faDumbbell} /> {workout.workoutName}</h2>:null
                    }

                    <p><strong>Description:</strong> {workout.description}</p>
                </button>
            ))}
        </div>
    )
}