import {
    useEffect,
    useState
} from "react";
import axios from "axios";
import type {workoutType} from "../type/workoutType.ts";
import {useParams} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDumbbell, faPersonBiking, faPersonRunning, faPersonWalking} from "@fortawesome/free-solid-svg-icons";

export default function ViewWorkout() {
    const {id} = useParams();
    const [workout, setWorkout] = useState<workoutType | null>(null);

    useEffect(() => {
        if (id) {
            axios.get(`/api/workouts/${id}`)
                .then(res => {
                    setWorkout(res.data);
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

    return (
        <div key={workout.id} className="workout-card">
            <h2>
                {getIcon(workout.workoutName) &&
                    <FontAwesomeIcon icon={getIcon(workout.workoutName)!} />}
                {" "}{workout.workoutName}
            </h2>
            <p><strong>Description:</strong> {workout.description}</p>
        </div>
    );
}