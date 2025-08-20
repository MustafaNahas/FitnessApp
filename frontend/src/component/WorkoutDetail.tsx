import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

type Workout = {
    id: string;
    description: string;
    workoutName: string;
};

export default function WorkoutDetail() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        axios
            .get(`/api/workouts/${id}`)
            .then((res) => setWorkout(res.data))
            .catch((err) => {
                console.error(err);
                alert("Workout konnte nicht geladen werden");
                nav("/workouts");
            })
            .finally(() => setLoading(false));
    }, [id, nav]);

    async function handleDelete() {
        if (!id) return;
        const confirmed = window.confirm(
            "Möchten Sie dieses Workout wirklich löschen?"
        );
        if (!confirmed) return;

        try {
            await axios.delete(`/api/workouts/${id}`);
            nav("/workouts"); // بعد از حذف به لیست برگرد
        } catch (e) {
            console.error(e);
            alert("Fehler beim Löschen des Workouts");
        }
    }

    if (loading) return <p>Laden…</p>;
    if (!workout) return <p>Workout nicht gefunden</p>;

    return (
        <div className="WorkoutDetail">
            <h1>{workout.workoutName}</h1>
            <p>
                <strong>Beschreibung:</strong> {workout.description}
            </p>

            <div className="actions" style={{ display: "flex", gap: 12 }}>
                <button onClick={() => nav(`/workouts/${id}/edit`)}>Bearbeiten</button>
                <button className="delete-btn" onClick={handleDelete}>
                    Löschen
                </button>
            </div>
        </div>
    );
}
