import {type FormEvent, useState} from "react";
import axios from "axios";

function AddWorkoutForm() {

    const [workoutName, setWorkoutName] = useState<string>("Running");
    const [description, setDescription] = useState<string| null>("");
    const [date, setDate] = useState<string>(new Date(Date.now()).toISOString().split("T")[0]);
    const [startTime, setStartTime] = useState<string>(new Date(Date.now()).toLocaleTimeString("de-DE").slice(0,5));
    const [favorite, setFavorite] = useState<boolean>(false);
    const [duration, setDuration] = useState<number | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    function resetForm() {
        setWorkoutName("Running");
        setDescription("");
        setDate(new Date(Date.now()).toISOString().split("T")[0])
        setStartTime(new Date(Date.now()).toLocaleTimeString("de-DE").slice(0,5));
        setFavorite(false);
        setDuration(null);
    }
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if(date==="Invalid Date"){
            setDate(new Date().toISOString().split("T")[0])
        }
        if(startTime==="Invalid Date"){
            setStartTime(new Date(Date.now()).toLocaleTimeString("de-DE").slice(0,5))
        }
        if(workoutName !== "" ) {
            axios.post("/api/workouts",{
                workoutName: workoutName,
                description: description,
                date: date,
                startTime: startTime+":00",
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
                    resetForm();
                }
            )
        }else{
            alert("Please fill in all fields.");
        }
    }

    //to not pick dates in the future
    const maxDatePick = new Date().toISOString().split("T")[0];
    const handleBlurDate = () => {
        if (!date) {
            setDate(new Date().toISOString().split("T")[0]);
        }
    };

    const handleBlurTime = () => {
        if (!startTime) {
            setStartTime(new Date(Date.now()).toLocaleTimeString("de-DE").slice(0,5));
        }
    };

    return (
        <form onSubmit={handleSubmit} className={"InputForm"}>
            <div>
                <label htmlFor={"workoutName"}>Workout type:</label>
                <br/>
                <select value={workoutName}
                        onChange={e=>setWorkoutName(e.target.value)}
                        id={"workoutName"}
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
                       id={"description"} name={"description"} onChange={e => setDescription(e.target.value)}/>
            </div>
            <div>
                <label htmlFor={"date"}>Date:</label>
                <input type={"date"}  id={"date"} name={"date"}  max={maxDatePick} onBlur={handleBlurDate} placeholder={maxDatePick}
                       onChange={e => setDate(new Date(e.target.value).toISOString().split("T")[0])}/>
            </div>
            <div>
                <label htmlFor={"Time"}>Time:</label>
                <input type={"time"} value={startTime?.toString()} defaultValue={new Date().toLocaleTimeString("de-DE").slice(0,5)} placeholder={new Date().toLocaleTimeString("de-DE").slice(0,5)}
                       min="00:00" max="23:59" step={60}  id={"Time"} name={"Time"}  onBlur={handleBlurTime}
                       onChange={(e) => setStartTime(e.target.value)}/>
            </div>
            <div>
                <label htmlFor={"favorite"}>Favorite:</label>
                <input type={"checkbox"} value={favorite?.toString()}  id={"favorite"} name={"favorite"}
                       onChange={e=>setFavorite(e.target.checked)}/>
            </div>
            <div>
                <label htmlFor={"Duration"}>Duration:</label>
                <input type={"number"} value={duration ?? ""} min={1} placeholder={"20"} id={"Duration"} name={"Duration"}
                       onChange={e=> setDuration(Number(e.target.value))}/>
            </div>

            <div className={"buttonAlignment"}>
                <button type={"submit"}>Add Workout</button>
                <button type={"reset"} onClick={() => {
                    resetForm();
                    setSuccess(false);
                    console.log("Form reset");
                } }> Reset</button>
                {(success)&& <p>Workout added successfully!</p>}
            </div>
        </form>
    );
}

export default AddWorkoutForm;