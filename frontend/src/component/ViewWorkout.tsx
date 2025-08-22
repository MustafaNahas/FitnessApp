import { useEffect, useState } from "react";
import axios from "axios";
import type { workoutType } from "../type/workoutType"; // no .ts in import
import { useParams } from "react-router-dom";
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
    const [isEditing, setIsEditing] = useState(false);

    // local form state
    const [description, setDescription] = useState("");
    const [workoutName, setWorkoutName] = useState("");
    const [dateTime, setDateTime] = useState<string>("");

    useEffect(() => {
        if (!id) return;
        axios
            .get(`/api/workouts/${id}`)
            .then((res) => {
                const w: workoutType = res.data;
                setWorkout(w);
                setDescription(w.description);
                setWorkoutName(w.workoutName);
                if (w.dateTime) setDateTime(w.dateTime);
            })
            .catch((err) => console.error(err));
    }, [id]);

    const handleUpdate = () => {
        if (!id) return;

        const updatedWorkout: workoutType = {
            id,
            description,
            workoutName,
            // datetime-local has no seconds; add :00 to keep ISO-like shape
            dateTime: dateTime
                ? dateTime.length === 16
                    ? `${dateTime}:00`
                    : dateTime
                : new Date().toISOString(),
        };

        axios
            .put(`/api/workouts/${id}`, updatedWorkout)
            .then((res) => {
                setWorkout(res.data);
                setIsEditing(false);
            })
            .catch((err) => console.error(err));
    };

    async function handleDelete(workoutId: string) {
        const confirmed = window.confirm("Möchten Sie dieses Workout wirklich löschen?");
        if (!confirmed) return;

        try {
            await axios.delete(`/api/workouts/${workoutId}`);
            setWorkout(null); // cleared after delete (could redirect if desired)
        } catch (e) {
            console.error(e);
            alert("Fehler beim Löschen des Workouts");
        }
    }

    if (!workout) return <p>I didn't find...</p>;

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

    return (
        <div key={workout.id} className="workout-card workout-card--detail">
            {isEditing ? (
                <>
                    <h2 className="workout-card__title">
                        {getIcon(workout.workoutName) && (
                            <FontAwesomeIcon icon={getIcon(workout.workoutName)!} />
                        )}
                        <select
                            name="type"
                            value={workoutName}
                            onChange={(e) => setWorkoutName(e.target.value)}
                        >
                            <option value="Running">Running</option>
                            <option value="Walking">Walking</option>
                            <option value="Cycling">Cycling</option>
                            <option value="Lifting">Lifting</option>
                        </select>
                    </h2>

                    <div className="form-grid">
                        <label>
                            <strong>Description</strong>
                            <input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </label>

                        <label>
                            <strong>Date/Time</strong>
                            <input
                                type="datetime-local"
                                value={dateTime ? dateTime.slice(0, 16) : ""}
                                onChange={(e) => setDateTime(e.target.value)}
                            />
                        </label>
                    </div>

                    <div className="actions">
                        <button className="btn" onClick={handleUpdate}>
                            Save
                        </button>
                        <button className="btn btn--ghost" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="workout-card__title">
                        {getIcon(workout.workoutName) && (
                            <FontAwesomeIcon icon={getIcon(workout.workoutName)!} />
                        )}
                        {workout.workoutName}
                    </h2>

                    <p>
                        <strong>Description:</strong> {workout.description}
                    </p>

                    {workout.dateTime && (
                        <p>
                            <strong>Date:</strong>{" "}
                            <time dateTime={workout.dateTime}>
                                {new Date(workout.dateTime).toLocaleString()}
                            </time>
                        </p>
                    )}

                    <div className="actions">
                        <button className="btn" onClick={() => setIsEditing(true)}>
                            Update
                        </button>
                        <button
                            type="button"
                            className="btn btn--danger"
                            onClick={() => handleDelete(workout.id)}
                        >
                            <FontAwesomeIcon icon={faTrash} /> Löschen
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
