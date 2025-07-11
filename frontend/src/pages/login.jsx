
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const { login } = useAuth();
const navigate = useNavigate();

const handleSubmit = async (e) => {
e.preventDefault();
try {
await login(username, password);
navigate("/dashboard");
} catch (err) {
alert("Login fallido");
}
};

return (
<div className="min-h-screen flex items-center justify-center bg-white">
<form className="p-6 border rounded shadow w-80" onSubmit={handleSubmit}>
<h1 className="text-lg font-bold mb-4">Iniciar Sesión</h1>
<input
type="email"
placeholder="Email"
className="border p-2 mb-3 w-full"
value={username}
onChange={(e) => setUsername(e.target.value)}
/>
<input
type="password"
placeholder="Contraseña"
className="border p-2 mb-4 w-full"
value={password}
onChange={(e) => setPassword(e.target.value)}
/>
<button className="w-full bg-blue-500 text-white py-2 rounded">Entrar</button>
</form>
</div>
);
}
