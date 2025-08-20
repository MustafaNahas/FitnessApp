import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDumbbell,
    faPersonBiking,
    faPersonRunning,
    faPersonWalking,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

type Workout = {
    id: string;
    description: string;
    workoutName: string;
};

export default function ViewWorkouts() {
    const nav = useNavigate();
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    function loadWorkouts() {
        axios
            .get("/api/workouts")
            .then((res) => setWorkouts(res.data))
            .catch((err) => {
                console.error(err);
                alert("Fehler beim Laden der Workouts");
            });
    }

    useEffect(() => {
        loadWorkouts();
    }, []);

    function handleGetById(id: string) {
        nav(`/workouts/${id}`);
    }

    return (
        <div className="ViewWorkouts">
            <h1>Workouts</h1>
            {workouts.map((workout) => (
                <button
                    key={workout.id}
                    className="workout-card"
                    onClick={() => handleGetById(workout.id)}
                >
                    {workout.workoutName === "Running" && (
                        <h2>
                            <FontAwesomeIcon icon={faPersonRunning} /> {workout.workoutName}
                        </h2>
                    )}
                    {workout.workoutName === "Weight training" && (
                        <h2>
                            <FontAwesomeIcon icon={faDumbbell} /> {workout.workoutName}
                        </h2>
                    )}
                    {workout.workoutName === "Walking" && (
                        <h2>
                            <FontAwesomeIcon icon={faPersonWalking} /> {workout.workoutName}
                        </h2>
                    )}
                    {workout.workoutName === "Cycling" && (
                        <h2>
                            <FontAwesomeIcon icon={faPersonBiking} /> {workout.workoutName}
                        </h2>
                    )}
                    {workout.workoutName === "Lifting" && (
                        <h2>
                            <FontAwesomeIcon icon={faDumbbell} /> {workout.workoutName}
                        </h2>
                    )}

                    <p>
                        <strong>Beschreibung:</strong> {workout.description}
                    </p>
                </button>
            ))}
        </div>
    );
}
