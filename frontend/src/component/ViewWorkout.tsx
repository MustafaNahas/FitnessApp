import {
    useEffect,
    useState
} from "react";
import axios from "axios";
import type {workoutType} from "../type/workoutType.ts";
import {useNavigate, useParams} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faDumbbell, faFloppyDisk,
    faPencil,
    faPersonBiking,
    faPersonRunning,
    faPersonWalking,
    faTrash, faXmark
} from "@fortawesome/free-solid-svg-icons";
import HeartCheckbox from "./FavoriteCheckbox.tsx";

export default function ViewWorkout() {
    const nav=useNavigate();


    const {id} = useParams();
    const [successfullDelete, setSuccessfullDelete] = useState<boolean>(false);
    const [workout, setWorkout] = useState<workoutType | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [workoutName, setWorkoutName] = useState<string>("Running");
    const [description, setDescription] = useState<string| null>("");
    const [date, setDate] = useState<string>(new Date(Date.now()).toISOString().split("T")[0]);
    const [startTime, setStartTime] = useState<string>(new Date(Date.now()).toLocaleTimeString("de-DE").slice(0,5));
    const [favorite, setFavorite] = useState<boolean>(false);
    const [duration, setDuration] = useState<number | null>(null);

    const [workouts, setWorkouts] = useState([{id: "", description: "", workoutName:"Running",
        date: new Date(Date.now()).toISOString().split("T") [0],startTime:new Date(Date. now()).toLocaleTimeString("de-DE").slice(0,5),favorite:false,duration:null}]);

    const handleUpdate = () => {
        if (!id) return;

        const updatedWorkout ={
            workoutName: workoutName,
            description: description,
            date: date,
            startTime: startTime+":00",
            favorite: favorite,
            duration: duration ?? null
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
        // Optimistic UI
        const prev = [...workouts];
        setWorkouts(ws => ws.filter(w => w.id !== id));

        try {
            await axios.delete(`/api/workouts/${id}`)
                .then(() => {
                    setSuccessfullDelete(true);
                    setTimeout(() => { nav("/workouts") }, 5000)}
                )
        } catch (e) {
            console.error(e);
            alert("Failed by deleting");
            setWorkouts(prev); // rollback bei Fehler
        }
    }

    const maxDatePick = new Date().toISOString().split("T")[0];
    return (
        <div key={workout.id} className="workout-card">
            {isEditing ? (
                <div className={"ViewWorkoutDetails"} >
                    <div>
                        <h2>
                            {getIcon(workout.workoutName) &&
                                <FontAwesomeIcon icon={getIcon(workout.workoutName)!} />}
                            {" "}          <select name ="type"
                                                   value={workoutName}
                                                   onChange={(e) => setWorkoutName(e.target.value)}
                        >
                            <option value="Running">Running</option>
                            <option value="Walking">Walking</option>
                            <option value="Cycling">Cycling</option>
                            <option value="Lifting">Lifting</option>
                        </select>
                        </h2>
                    </div>
                    <div className={"break-row"}></div>
                    <div>
                        <strong>Description:</strong>
                        <input value={description ? description : ""} onChange={ e =>setDescription(e.target.value)} />
                    </div>
                        <div className={"break-row"}></div>
                    <div>
                        <label htmlFor={"date"}>Date:</label>
                        <input type={"date"}  id={"date"} name={"date"}  max={maxDatePick}  placeholder={maxDatePick} value={date}
                               onChange={e => setDate(new Date(e.target.value).toISOString().split("T")[0])}/>
                    </div>
                    <div>
                    <label htmlFor={"Time"}>Time:</label>
                    <input type={"time"} value={startTime}
                           min="00:00" max="23:59" step={60}  id={"Time"} name={"Time"}
                           onChange={(e) => setStartTime(e.target.value)}/>
                    </div>

                    <div>
                    <label htmlFor={"Duration"}>Duration:</label>
                    <div className={"break-row"}></div>
                    <input className={"durationInput"} type={"number"} value={duration ?? ""} min={1} placeholder={"20"} id={"Duration"} name={"Duration"}
                           onChange={e=> setDuration(Number(e.target.value))}/>
                    </div>
                    <div>
                        <label htmlFor={"favorite"}>Favorite:</label>
                        <div className={"break-row"}></div>
                        <div>
                            <HeartCheckbox
                                checked={favorite}
                                disableOnClick={false}
                                onChange={(val:boolean) =>{
                                    setFavorite(val);
                                }}
                            />
                        </div>
                    </div>
                    <div className={"break-row"}></div>
                    <div className={"buttonAlignment"}>
                        <button onClick={handleUpdate}><FontAwesomeIcon icon={faFloppyDisk} /> Save</button>
                        <button onClick={() => setIsEditing(false)}><FontAwesomeIcon icon={faXmark} /> Cancel</button>

                            <button
                                type="button"
                                className="delete-btn"
                                onClick={(e) => { e.stopPropagation(); handleDelete(workout.id); }}
                            >
                                <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>

                    </div>
                    <div className={"break-row"}></div>
                    {successfullDelete&&<p>Deleted successfully.</p>}
                </div>
                ) : (
                <div className={"ViewWorkoutDetails"} >
                    <div>
                        <h2>
                            {getIcon(workout.workoutName) &&
                                <FontAwesomeIcon icon={getIcon(workout.workoutName)!} />}
                            {" "}{workout.workoutName}
                        </h2>
                    </div>

                    <div className={"break-row"}></div>

                    <div>
                        <strong>Description:</strong>
                        <input disabled value={description ? description : ""} />
                    </div>

                    <div className={"break-row"}></div>

                    <div>
                        <label htmlFor={"date"}>Date:</label>
                        <input disabled type={"date"}  id={"date"} name={"date"}  max={maxDatePick}  placeholder={maxDatePick} value={date}/>
                    </div>
                    <div>
                        <label htmlFor={"Time"}>Time:</label>
                        <input disabled type={"time"} value={startTime} placeholder={startTime}
                               min="00:00" max="23:59" step={60}  id={"Time"} name={"Time"}/>
                    </div>

                    <div>
                        <label htmlFor={"Duration"}>Duration:</label>
                        <div className={"break-row"}></div>
                        <input className={"durationInput"} disabled type={"number"} value={duration ?? ""} min={1} placeholder={"20"} id={"Duration"} name={"Duration"}/>
                    </div>
                    <div>
                        <label htmlFor={"favorite"}>Favorite:</label>
                        <div className={"break-row"}></div>
                        <div>
                            <HeartCheckbox
                                checked={favorite}
                                disableOnClick={true}
                            />
                        </div>
                    </div>
                    <div className={"break-row"}></div>

                    <div className={"buttonAlignment"}>
                        <button onClick={() => setIsEditing(true)}><FontAwesomeIcon icon={faPencil} /> Update </button>

                        <button
                            type="button"
                            className="delete-btn"
                            onClick={(e) => { e.stopPropagation(); handleDelete(workout.id); }}
                        >
                            <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>

                    </div>
                    <div className={"break-row"}></div>
                    {successfullDelete&&<p>Deleted successfully.</p>}
                </div>

            )}

        </div>
    );
}