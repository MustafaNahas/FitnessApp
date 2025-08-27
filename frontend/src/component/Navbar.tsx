import '../App.css'
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUser, faHouse, faPlus, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";


interface NavbarProps {
    user: string | null;
    onUserChange: (user: string | null) => void;
}

export default function Navbar({ user, onUserChange }: Readonly<NavbarProps>) {
    const nav = useNavigate();


    function login() {
        const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080' : window.location.origin;
        window.open(host + '/oauth2/authorization/github', '_self');
    }

    function logout() {
        const host = window.location.host === 'localhost:5173' ? 'http://localhost:8080' : window.location.origin;
        window.open(host + '/logout', '_self');
        onUserChange(null);
    }

    return (
        <nav>
            {user && <h2 className={"userGreetingNav"}>Welcome {user}</h2>}
            {user && (
                    <>
                        <button onClick={()=>(nav("/workouts"))}>Home <FontAwesomeIcon icon={faHouse} /></button>
                        <button onClick={()=>(nav("/workouts/add"))}>Add workout <FontAwesomeIcon icon={faPlus} /></button>
                    </>
                )}
            {user ? (
                <button onClick={logout} ><span>Logout <FontAwesomeIcon icon={faRightFromBracket} /></span></button>
            ) : (
                <button onClick={login} ><span>Login with GitHub <FontAwesomeIcon icon={faCircleUser} /></span></button>
            )}
        </nav>
    );
}