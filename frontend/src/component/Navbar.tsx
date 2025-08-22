import '../App.css'
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouse, faPlus} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";


export default function Navbar() {
    const nav = useNavigate();
    const loadUser = () => {
        axios.get('/api/auth/me')
            .then(response => {
                console.log(response.data)
            })
    }
    function login() {
        const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080': window.location.origin

        window.open(host + '/oauth2/authorization/github', '_self')
        loadUser();
    }

    return (
        <nav>
            <button onClick={()=>(nav("/workouts"))}>Home <FontAwesomeIcon icon={faHouse} /></button>
            <button onClick={()=>(nav("/workouts/add"))}>Add a workout <FontAwesomeIcon icon={faPlus} /></button>
            <button onClick={login}>login</button>
        </nav>
    );
}