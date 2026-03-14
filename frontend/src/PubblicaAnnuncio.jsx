import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function PubblicaAnnuncio() {
  useEffect(() => {
    const utente = localStorage.getItem("utente");
    if (!utente) {
      alert("Devi essere loggato per pubblicare un annuncio!");
      window.location.href = "/login";
    }
  }, []);

  const [titolo, setTitolo] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [prezzo, setPrezzo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [citta, setCitta] = useState("");
  const [universita, setUniversita] = useState("");
  const [immagine, setImmagine] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setImmagine(e.target.files[0]);
  };

  const pubblica = async () => {
    if (!titolo || !descrizione || !prezzo) {
      alert("Titolo, descrizione e prezzo sono obbligatori!");
      return;
    }

    const formData = new FormData();
    formData.append("titolo", titolo);
    formData.append("descrizione", descrizione);
    formData.append("prezzo", prezzo);
    formData.append("categoria", categoria);
    formData.append("citta", citta);
    formData.append("universita", universita);
    if (immagine) formData.append("immagine", immagine);

    const utente = JSON.parse(localStorage.getItem("utente"));
    formData.append("utente_id", utente.id);

    try {
      await axios.post("https://unimarket-1-n0al.onrender.com/annunci", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Annuncio pubblicato!");
      // pulisce i campi
      setTitolo("");
      setDescrizione("");
      setPrezzo("");
      setCategoria("");
      setCitta("");
      setUniversita("");
      setImmagine(null);

      navigate("/"); // torna alla home

    } catch (error) {
      console.error(error);
      alert("Errore durante la pubblicazione");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto", backgroundColor: "#f5f5f5" }}>
      <h1>Pubblica Annuncio</h1>

      <input
        type="text"
        placeholder="Titolo"
        value={titolo}
        onChange={(e) => setTitolo(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <textarea
        placeholder="Descrizione"
        value={descrizione}
        onChange={(e) => setDescrizione(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="number"
        placeholder="Prezzo"
        value={prezzo}
        onChange={(e) => setPrezzo(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="Categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="Città"
        value={citta}
        onChange={(e) => setCitta(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="Università"
        value={universita}
        onChange={(e) => setUniversita(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: "15px" }}
      />

      <button
        onClick={pubblica}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Pubblica
      </button>
    </div>
  );
}

export default PubblicaAnnuncio;

