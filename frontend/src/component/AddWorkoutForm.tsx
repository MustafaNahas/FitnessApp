import {type FormEvent, useState} from "react";
import axios from "axios";

function AddWorkoutForm() {

    const [workoutName, setWorkoutName] = useState<string>("Running");
    const [description, setDescription] = useState<string| null>("");
    const [date, setDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [favorite, setFavorite] = useState<boolean>(false);
    const [duration, setDuration] = useState<number | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if(workoutName !== "" && description !== "") {
            axios.post("/api/workouts",{
                workoutName: workoutName,
                description: description,
                date: date ?? null,
                startTime: startTime ?? null,
                favorite: favorite,
                duration: duration ?? null
            }
            ).then(res=>{
                console.log(res);
                setSuccess(true)
            }).catch(err=> {
                console.error(err);
                setSuccess(false)
                alert(err);
            }).finally(
                () => {
                    setWorkoutName("");
                    setDescription("");
                }
            )
        }else{
            alert("Please fill in all fields.");
        }
    }

 // here

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor={"workoutName"}>Workout type:</label>
                <select value={workoutName}
                        onChange={e=>setWorkoutName(e.target.value)}
                        name={"workoutName"}
                        required>
                    <option value="Running">Running </option>
                    <option value="Walking">Walking  </option>
                    <option value="Cycling">Cycling </option>
                    <option value="Lifting">Lifting </option>
                </select>
            </div>
            <div>
                <label htmlFor={"description"}>Workout description:</label>
                <input type={"text"} value={description?.toString()} placeholder={"Workout description"}
                       name={"description"} onChange={e => setDescription(e.target.value)}/>
            </div>
            <div>
                <label htmlFor={"date"}>Date:</label>
                <input type={"date"}  name={"date"}
                       onChange={e => setDate(e.target.value ? new Date(e.target.value):null)}/>
            </div>
            <div>
                <label htmlFor={"Time"}>Time:</label>
                <input type={"time"} value={startTime?.toString()} placeholder={Date.now().toString()}
                       min="00:00" max="23:59" step={60}  name={"date"}
                       onChange={(e) => setStartTime(e.target.value)}/>
            </div>
            <div>
                <label htmlFor={"favorite"}>Favorite:</label>
                <input type={"checkbox"} value={favorite?.toString()}  name={"favorite"}
                       onChange={e=>setFavorite(e.target.checked)}/>
            </div>
            <div>
                <label htmlFor={"Duration"}>Duration:</label>
                <input type={"number"} value={duration ?? ""} min={1} placeholder={"20"} name={"date"}
                       onChange={e=> setDuration(Number(e.target.value))}/>
            </div>


            <button type={"submit"}>Add Workout</button>
            <button type={"reset"} onClick={() => {
                setWorkoutName("");
                setDescription("");
                setSuccess(false);
                console.log("Form reset");
            } }> Reset</button>
            {(success)&& <p>Workout added successfully!</p>}
        </form>
    );
}

export default AddWorkoutForm;