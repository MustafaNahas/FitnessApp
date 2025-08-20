import '../App.css'
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouse, faPlus} from "@fortawesome/free-solid-svg-icons";


export default function Navbar() {
    const nav = useNavigate();
    return (
        <nav>
            <button onClick={()=>(nav("/workouts"))}>Home <FontAwesomeIcon icon={faHouse} /></button>
            <button onClick={()=>(nav("/workouts/add"))}>Add a workout <FontAwesomeIcon icon={faPlus} /></button>
        </nav>
    );
}