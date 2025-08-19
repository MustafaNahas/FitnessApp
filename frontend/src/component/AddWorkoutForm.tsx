import {useState} from "react";
import axios from "axios";

function AddWorkoutForm() {

    const [workoutName, setWorkoutName] = useState<string>("Running");
    const [description, setDescription] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if(workoutName !== "" && description !== "") {
            axios.post("/api/workouts",{
                workoutName: workoutName,
                description: description
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
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor={"workoutName"}>Workout type:</label>
                <select value={workoutName}
                        onChange={e=>setWorkoutName(e.target.value)}
                        name={"workoutName"}>
                    <option value="Running">Running </option>
                    <option value="Walking">Walking  </option>
                    <option value="Cycling">Cycling </option>
                    <option value="Lifting">Lifting </option>
                </select>
            </div>
            <div>
                <label htmlFor={"description"}>Workout description:</label>
                <input type={"text"} value={description} placeholder={"Workout description"} name={"description"} onChange={e => setDescription(e.target.value)}/>
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