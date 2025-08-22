import { useEffect, useState } from "react";
import axios from "axios";
import type { workoutType } from "../type/workoutType";
import { useNavigate } from "react-router-dom";

type Period = "" | "day" | "week" | "month";

export default function FilterWorkouts() {
    const nav = useNavigate();
    const [workouts, setWorkouts] = useState<workoutType[]>([]);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState<Period>("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    function loadAll() {
        setLoading(true);
        axios.get("/api/workouts")
            .then(res => setWorkouts(res.data))
            .catch(err => {
                console.error(err);
                alert("Fehler beim Laden der Workouts");
            })
            .finally(() => setLoading(false));
    }

    function fetchWith(url: string) {
        setLoading(true);
        axios.get(url)
            .then(res => setWorkouts(res.data))
            .catch(err => {
                console.error(err);
                alert("Fehler beim Laden der Workouts");
            })
            .finally(() => setLoading(false));
    }

    function applyPreset(p: Exclude<Period, "">) {
        setPeriod(p);
        setFrom("");
        setTo("");
        fetchWith(`/api/workouts?period=${p}`);
    }

    function applyCustomRange() {
        if (!from && !to) {
            alert("Please select at least a start or end time");
            return;
        }
        setPeriod("");
        const params = new URLSearchParams();
        if (from) params.append("from", from.length === 16 ? `${from}:00` : from);
        if (to)   params.append("to",   to.length   === 16 ? `${to}:00`   : to);
        fetchWith(`/api/workouts/filter?${params.toString()}`);
    }

    function clearFilters() {
        setPeriod("");
        setFrom("");
        setTo("");
        loadAll();
    }

    useEffect(() => {
        loadAll();
    }, []);

    return (
        <div className="filters-page">
            <h1>Workouts</h1>

            {/* Filter Bar */}
            <div className="filters" style={{display:"grid", gap:8, marginBottom:16}}>
                <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
                    <button type="button" onClick={() => applyPreset("day")}  disabled={period==="day"}>This Day</button>
                    <button type="button" onClick={() => applyPreset("week")} disabled={period==="week"}>This Week</button>
                    <button type="button" onClick={() => applyPreset("month")} disabled={period==="month"}>This Month</button>
                    <button type="button" onClick={clearFilters}>Clear</button>
                </div>

                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:8}}>
                    <label>
                        <span style={{display:"block", fontSize:12, opacity:.7}}>From</span>
                        <input
                            type="datetime-local"
                            value={from}
                            onChange={(e)=>setFrom(e.target.value)}
                        />
                    </label>

                    <label>
                        <span style={{display:"block", fontSize:12, opacity:.7}}>To</span>
                        <input
                            type="datetime-local"
                            value={to}
                            onChange={(e)=>setTo(e.target.value)}
                        />
                    </label>

                    <div style={{display:"flex", alignItems:"end"}}>
                        <button type="button" onClick={applyCustomRange}>Apply</button>
                    </div>
                </div>
            </div>

            {/* Loading / Empty / List */}
            {loading && <p style={{opacity:.7}}>Loading…</p>}
            {!loading && workouts.length === 0 && (
                <p style={{opacity:.7}}>No activities found.</p>
            )}

            <div className="ViewWorkouts">
                {workouts.map(w => (
                    <button
                        key={w.id}
                        className="workout-card"
                        onClick={() => nav(`/workouts/${w.id}`)}
                    >
                        <h2 style={{marginBottom: 8}}>{w.workoutName}</h2>
                        <p><strong>Description:</strong> {w.description}</p>
                        {w.dateTime && (
                            <p>
                                <strong>Date:</strong>{" "}
                                <time dateTime={w.dateTime}>
                                    {new Date(w.dateTime).toLocaleString()}
                                </time>
                            </p>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
