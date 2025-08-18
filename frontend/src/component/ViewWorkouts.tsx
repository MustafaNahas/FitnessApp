import "../App.css"
import {useEffect, useState} from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faDumbbell, faPersonBiking, faPersonRunning, faPersonWalking, faTrash} from "@fortawesome/free-solid-svg-icons";

export default function ViewWorkouts(){

    const [workouts, setWorkouts] = useState([{id: "", description: "", workoutName: ""}]);

    function loadWorkouts() {
        axios.get("/api/workouts")
            .then(res => {
                setWorkouts(res.data);
            })
            .catch(err => {
                console.error(err);
                alert("Fehler beim Laden der Workouts");
            });
    }

    useEffect(() => {
        loadWorkouts();
    }, []);

    async function handleDelete(id: string) {
        const confirmed = window.confirm("Möchten Sie dieses Workout wirklich löschen?");
        if (!confirmed) return;

        try {
            await axios.delete(`/api/workouts/${id}`);
            // Workout aus dem State entfernen
            setWorkouts(prev => prev.filter(w => w.id !== id));
        } catch (err) {
            console.error(err);
            alert("Fehler beim Löschen des Workouts");
        }
    }

    return(
        <div className={"ViewWorkouts"}>
            <h1>Workouts</h1>
            {workouts.map(workout => (
                <div key={workout.id} className="workout-card">
                    {workout.workoutName==="Running" &&
                        <h2><FontAwesomeIcon icon={faPersonRunning} /> {workout.workoutName}</h2>
                    }
                    {workout.workoutName==="Walking" &&
                        <h2><FontAwesomeIcon icon={faPersonWalking} /> {workout.workoutName}</h2>
                    }
                    {workout.workoutName==="Cycling" &&
                        <h2><FontAwesomeIcon icon={faPersonBiking} /> {workout.workoutName}</h2>
                    }
                    {workout.workoutName==="Weight training" &&
                        <h2><FontAwesomeIcon icon={faDumbbell} /> {workout.workoutName}</h2>
                    }

                    <p><strong>Beschreibung:</strong> {workout.description}</p>

                    <button
                        className="delete-btn"
                        onClick={() => handleDelete(workout.id)}
                    >
                        <FontAwesomeIcon icon={faTrash} /> Löschen
                    </button>
                </div>
            ))}
        </div>
    )
}
