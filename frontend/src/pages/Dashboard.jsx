import { useEffect, useState } from "react";
import axios from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
const [eventos, setEventos] = useState([]);
const { logout } = useAuth();

useEffect(() => {
axios.get("/api/event").then(res => {
setEventos(res.data.collection || []);
});
}, []);

return (
<div className="p-6">
<div className="flex justify-between items-center mb-4">
<h1 className="text-xl font-bold">Eventos Disponibles</h1>
<button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Salir</button>
</div>
<table className="w-full border-collapse">
<thead>
<tr className="bg-gray-200">
<th className="border p-2">Nombre</th>
<th className="border p-2">Fecha</th>
<th className="border p-2">Duración</th>
<th className="border p-2">Precio</th>
</tr>
</thead>
<tbody>
{eventos.map((ev) => (
<tr key={ev.id} className="text-center">
<td className="border p-2">{ev.name}</td>
<td className="border p-2">{ev.start_date}</td>
<td className="border p-2">{ev.duration_in_minutes} min</td>
<td className="border p-2">${ev.price}</td>
</tr>
))}
</tbody>
</table>
</div>
);
}
