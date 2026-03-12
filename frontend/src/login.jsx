import { useState } from "react";
import axios from "axios";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    try {

      const res = await axios.post("https://unimarket-itwd.onrender.com/login", {
        email,
        password
      });

      localStorage.setItem("utente", JSON.stringify(res.data));

      alert("Login effettuato!");

      window.location.href = "/";

    } catch (error) {

      alert("Email o password errati");

    }

  };

  return (

    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>

      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button onClick={login}>
        Accedi
      </button>

    </div>

  );
}

export default Login;
