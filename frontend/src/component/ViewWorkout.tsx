import {
    useEffect,
    useState
} from "react";
import axios from "axios";
import type {workoutType} from "../type/workoutType.ts";
import {useParams} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDumbbell, faPersonBiking, faPersonRunning, faPersonWalking, faTrash} from "@fortawesome/free-solid-svg-icons";

export default function ViewWorkout() {
    const {id} = useParams();
    const [workout, setWorkout] = useState<workoutType | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [workoutName, setWorkoutName] = useState<string>("Running");
    const [description, setDescription] = useState<string| null>("");
    const [date, setDate] = useState<string>(new Date(Date.now()).toISOString().split("T")[0]);
    const [startTime, setStartTime] = useState<string>(new Date(Date.now()).toLocaleTimeString("de-DE").slice(0,5));
    const [favorite, setFavorite] = useState<boolean>(false);
    const [duration, setDuration] = useState<number | null>(null);

    const [workouts, setWorkouts] = useState([{id: "", description: "", workoutName: ""}]);

    const handleUpdate = () => {
        if (!id) return;

        const updatedWorkout = {
            id: id,
            description: description,
            workoutName: workoutName
        };

        axios.put(`/api/workouts/${id}`, updatedWorkout)
            .then(res => {
                setWorkout(res.data);
                setIsEditing(false);
            })
            .catch(err => console.error(err));
    };
    useEffect(() => {
        if (id) {
            axios.get(`/api/workouts/${id}`)
                .then(res => {
                    setWorkout(res.data);
                    setDescription(res.data.description);
                    setDate(res.data.date);
                    setDuration(res.data.duration);
                    setFavorite(res.data.favorite);
                    setWorkoutName(res.data.workoutName);
                    setStartTime(res.data.startTime);
                    console.log(res.data);
                })
                .catch(err => console.error(err));
        }
    },[id]);

    if (!workout) {
        return <p>I didn't find...</p>; // або спіннер
    }


    const getIcon = (type: string) => {
        switch (type) {
            case "Running": return faPersonRunning;
            case "Walking": return faPersonWalking;
            case "Cycling": return faPersonBiking;
            case "Lifting": return faDumbbell;
            default: return undefined;
        }
    };

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

    return (
        <div key={workout.id} className="workout-card">
            {isEditing ? (
                <>
                    <h2>
                        {getIcon(workout.workoutName) &&
                            <FontAwesomeIcon icon={getIcon(workout.workoutName)!} />}
                        {" "}          <select name ="type"
                                               value={workoutName}
                                               onChange={(e) => setworkoutName(e.target.value)}
                    >
                        <option value="Running">Running</option>
                        <option value="Walking">Walking</option>
                        <option value="Cycling">Cycling</option>
                        <option value="Lifting">Lifting</option>
                    </select>
                    </h2>
                    <strong>Description:</strong>
                    <input value={description ? description : ""} onChange={ e =>setDescription(e.target.value)} />

                    <label htmlFor={"date"}>Date:</label>
                    <input type={"date"}  id={"date"} name={"date"}  max={maxDatePick}  placeholder={maxDatePick} value={date}
                           onChange={e => setDate(new Date(e.target.value).toISOString().split("T")[0])}/>

                    <label htmlFor={"Time"}>Time:</label>
                    <input type={"time"} value={startTime}
                           min="00:00" max="23:59" step={60}  id={"Time"} name={"Time"}
                           onChange={(e) => setStartTime(e.target.value)}/>

                    <label htmlFor={"favorite"}>Favorite:</label>
                    <input type={"checkbox"} checked={favorite}  id={"favorite"} name={"favorite"}
                           onChange={e=>setFavorite(e.target.checked)}/>

                    <label htmlFor={"Duration"}>Duration:</label>
                    <input type={"number"} value={duration ?? ""} min={1} placeholder={"20"} id={"Duration"} name={"Duration"}
                           onChange={e=> setDuration(Number(e.target.value))}/>


                    <button onClick={handleUpdate}>save</button>
                    <button onClick={() => setIsEditing(false)}>cancel</button>
                </>
                ) : (
                <>
                    <h2>
                        {getIcon(workout.workoutName) &&
                            <FontAwesomeIcon icon={getIcon(workout.workoutName)!} />}
                        {" "}{workout.workoutName}
                    </h2>
                    <p><strong>Description:</strong> {description}</p>

                    <button onClick={() => setIsEditing(true)}>update</button>

                </>

            )}
            <>
                {/* Delete-Button */}
                <button
                    type="button"
                    className="delete-btn"
                    onClick={(e) => { e.stopPropagation(); handleDelete(workout.id); }}
                >
                    <FontAwesomeIcon icon={faTrash} /> Löschen
                </button>
            </>
        </div>
    );
}