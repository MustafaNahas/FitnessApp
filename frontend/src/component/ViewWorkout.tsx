import { useEffect, useState } from "react";
import axios from "axios";
import type { workoutType } from "../type/workoutType.ts";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDumbbell,
    faPersonBiking,
    faPersonRunning,
    faPersonWalking,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function ViewWorkout() {
    const { id } = useParams();
    const [workout, setWorkout] = useState<workoutType | null>(null);

    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState("");
    const [favorite, setFavorite] = useState(false);

    const [workouts, setWorkouts] = useState<
        { id: string; description: string; workoutName: string }[]
    >([]);

    useEffect(() => {
        if (id) {
            axios
                .get(`/api/workouts/${id}`)
                .then((res) => {
                    setWorkout(res.data);
                    setDescription(res.data.description);
                    setDate(res.data.date);
                    setStartTime(res.data.startTime);
                    setDuration(res.data.duration);
                    setFavorite(res.data.favorite);
                })
                .catch((err) => console.error(err));
        }
    }, [id]);

    if (!workout) {
        return <p>I didn't find...</p>; // oder ein Spinner
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "Running":
                return faPersonRunning;
            case "Walking":
                return faPersonWalking;
            case "Cycling":
                return faPersonBiking;
            case "Lifting":
                return faDumbbell;
            default:
                return undefined;
        }
    };

    async function handleDelete(id: string) {
        const confirmed = window.confirm(
            "Möchten Sie dieses Workout wirklich löschen?"
        );
        if (!confirmed) return;

        // Optimistic UI
        const prev = [...workouts];
        setWorkouts((ws) => ws.filter((w) => w.id !== id));

        try {
            await axios.delete(`/api/workouts/${id}`);
        } catch (e) {
            console.error(e);
            alert("Fehler beim Löschen des Workouts");
            setWorkouts(prev); // rollback bei Fehler
        }
    }

    return (
        <div key={workout.id} className="workout-card">
            <h2>
                {getIcon(workout.workoutName) && (
                    <FontAwesomeIcon icon={getIcon(workout.workoutName)!} />
                )}{" "}
                {workout.workoutName}
            </h2>

            <p>
                <strong>Description:</strong> {description}
            </p>
            <p>
                <strong>Date:</strong> {date}
            </p>
            <p>
                <strong>Start Time:</strong> {startTime}
            </p>
            <p>
                <strong>Duration:</strong> {duration}
            </p>
            <p>
                <strong>Favorite:</strong>{" "}
                <input type="checkbox" checked={favorite} readOnly />
            </p>

            <div style={{ marginTop: "1rem" }}>
                <Link to={`/workouts/${id}/edit`}>
                    <button style={{ marginRight: "0.5rem" }}>Update</button>
                </Link>

                <button
                    type="button"
                    className="delete-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(workout.id);
                    }}
                >
                    <FontAwesomeIcon icon={faTrash} /> Löschen
                </button>
            </div>
        </div>
    );
}
