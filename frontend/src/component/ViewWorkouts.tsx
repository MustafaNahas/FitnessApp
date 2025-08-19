import "../App.css"
import {useEffect, useState} from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDumbbell,
    faPersonBiking,
    faPersonRunning,
    faPersonWalking,
    faTrash
} from "@fortawesome/free-solid-svg-icons";

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
                console.error(err);
                alert("Fehler beim Laden der Workouts");
            });
    }

    useEffect(() => {
        loadTodos();
    }, []);

    function handleGetById(id: string) {
        nav(`/workouts/${id}`);
    }

    async function handleDelete(id: string) {
        const confirmed = window.confirm("Möchten Sie dieses Workout wirklich löschen?");
        if (!confirmed) return;

        // Optimistic UI
        const prev = [...workouts];
        setWorkouts(ws => ws.filter(w => w.id !== id));

        try {
            await axios.delete(`/api/workouts/${id}`);
        } catch (e) {
            console.error(e);
            alert("Fehler beim Löschen des Workouts");
            setWorkouts(prev); // rollback bei Fehler
        }
    }

    return(
        <div className={"ViewWorkouts"}>
            <h1>Workouts</h1>
            {workouts.map(workout => (
                <button
                    key={workout.id}
                    className="workout-card"
                    onClick={() => handleGetById(workout.id)}
                >
                    {workout.workoutName==="Running" &&
                        <h2><FontAwesomeIcon icon={faPersonRunning} /> {workout.workoutName}</h2>
                    }
                    {workout.workoutName==="Weight training" &&
                        <h2><FontAwesomeIcon icon={faDumbbell} /> {workout.workoutName}</h2>
                    }
                    {workout.workoutName==="Walking" &&
                        <h2><FontAwesomeIcon icon={faPersonWalking} /> {workout.workoutName}</h2>
                    }
                    {workout.workoutName==="Cycling" &&
                        <h2><FontAwesomeIcon icon={faPersonBiking} /> {workout.workoutName}</h2>
                    }
                    {workout.workoutName==="Lifting" &&
                        <h2><FontAwesomeIcon icon={faDumbbell} /> {workout.workoutName}</h2>
                    }

                    <p><strong>Beschreibung:</strong> {workout.description}</p>

                    {/* Delete-Button */}
                    <button
                        type="button"
                        className="delete-btn"
                        onClick={(e) => { e.stopPropagation(); handleDelete(workout.id); }}
                    >
                        <FontAwesomeIcon icon={faTrash} /> Löschen
                    </button>
                </button>
            ))}
        </div>
    )
}
