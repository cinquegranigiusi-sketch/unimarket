import { useState } from "react";
import axios from "axios";

function Registrati() {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registra = async () => {

    try {
      await axios.post("https://unimarket-1-n0al.onrender.com/registrati", {
        nome,
        email,
        password
      });

      alert("Registrazione completata!");

      window.location.href = "/login";

    } catch (error) {

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Errore durante la registrazione");
      }

    }

  };

  return (

    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>

      <h1>Registrati</h1>

      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

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

      <button
        onClick={registra}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#3d6df1",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Registrati
      </button>

    </div>

  );

}

export default Registrati;