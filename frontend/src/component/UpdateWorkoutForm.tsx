import { type FormEvent, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateWorkoutForm() {
    const { id } = useParams();             // ID aus der URL /workouts/:id/edit
    const navigate = useNavigate();

    // States für die Felder
    const [workoutName, setWorkoutName] = useState<string>("");
    const [description, setDescription] = useState<string | null>("");
    const [date, setDate] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("00:00");
    const [favorite, setFavorite] = useState<boolean>(false);
    const [duration, setDuration] = useState<number | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    // Workout laden
    useEffect(() => {
        if (!id) return;
        axios.get(`/api/workouts/${id}`)
            .then(res => {
                const workout = res.data;
                setWorkoutName(workout.workoutName);
                setDescription(workout.description ?? "");
                setDate(workout.date);
               // setStartTime(workout.startTime.slice(0, 5)); // hh:mm
                setFavorite(workout.favorite);
                setDuration(workout.duration ?? null);
            })
            .catch(err => {
                console.error("Failed to load workout", err);
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Update absenden
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        axios.put(`/api/workouts/${id}`, {
            workoutName,
            description,


            favorite,
            duration: duration ?? null
        })
            .then(() => {
                setSuccess(true);
                // Redirect zur Detailseite nach erfolgreichem Update
                navigate(`/workouts/${id}`);
            })
            .catch(err => {
                console.error(err);
                setSuccess(false);
                alert("Update failed: " + err);
            });
    }

    if (loading) return <p>Loading workout...</p>;

    const maxDatePick = new Date().toISOString().split("T")[0];

    return (
        <form onSubmit={handleSubmit} className={"InputForm"}>
            <div>
                <label htmlFor="workoutName">Workout type:</label>
                <br/>
                <select value={workoutName}
                        onChange={e=>setWorkoutName(e.target.value)}
                        id="workoutName"
                        name="workoutName"
                        required>
                    <option value="Running">Running</option>
                    <option value="Walking">Walking</option>
                    <option value="Cycling">Cycling</option>
                    <option value="Lifting">Lifting</option>
                </select>
            </div>

            <div>
                <label htmlFor="description">Workout description:</label>
                <input type="text"
                       value={description ?? ""}
                       placeholder="Workout description"
                       id="description"
                       name="description"
                       onChange={e => setDescription(e.target.value)}/>
            </div>

            <div>
                <label htmlFor="date">Date:</label>
                <input type="date"
                       id="date"
                       name="date"
                       value={date}
                       max={maxDatePick}
                       onChange={e => setDate(new Date(e.target.value).toISOString().split("T")[0])}/>
            </div>

            <div>
                <label htmlFor="Time">Time:</label>
                <input type="time"
                       value={startTime}
                       min="00:00"
                       max="23:59"
                       step={60}
                       id="Time"
                       name="Time"
                       onChange={(e) => setStartTime(e.target.value)}/>
            </div>


            <div>
                <label htmlFor="favorite">Favorite:</label>
                <input type="checkbox"
                       checked={favorite}
                       id="favorite"
                       name="favorite"
                       onChange={e=>setFavorite(e.target.checked)}/>
            </div>

            <div>
                <label htmlFor="Duration">Duration:</label>
                <input type="number"
                       value={duration ?? ""}
                       min={1}
                       placeholder="20"
                       id="Duration"
                       name="Duration"
                       onChange={e=> setDuration(Number(e.target.value))}/>
            </div>

            <div className={"submitButtons"}>
                <button type="submit">Update Workout</button>
                {success && <p>Workout updated successfully!</p>}
            </div>
            <button type="button" onClick={() => navigate(`/workouts/${id}`)}>
                Cancel
            </button>
        </form>
    );
}

export default UpdateWorkoutForm;
