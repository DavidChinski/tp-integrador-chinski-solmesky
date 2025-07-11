import { createContext, useContext, useState } from "react";
import axios from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);

const login = async (username, password) => {
const { data } = await axios.post("/api/user/login", { username, password });
localStorage.setItem("token", data.token);
setUser({ username });
};

const logout = () => {
localStorage.removeItem("token");
setUser(null);
};

return (
<AuthContext.Provider value={{ user, login, logout }}>
{children}
</AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);
