import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DettaglioAnnuncio() {
  const { id } = useParams(); // prende l'id dall'URL
  const [annuncio, setAnnuncio] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://unimarket-itwd.onrender.com/annunci`)
      .then(res => res.json())
      .then(data => {
        const trovato = data.find(a => a.id === parseInt(id));
        setAnnuncio(trovato);
      })
      .catch(err => console.log(err));
  }, [id]);

  if (!annuncio) return <p style={{ padding: "40px" }}>Caricamento annuncio...</p>;

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto", backgroundColor: "#f5f5f5" }}>
      
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "8px 15px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#007bff",
          color: "white",
          cursor: "pointer"
        }}
      >
        ← Torna indietro
      </button>

      <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>

        <button
  onClick={() => navigate(`/chat/${annuncio.id}/${annuncio.utente_id}`)}
          style={{
          marginTop: "20px",
          background: "#3d6df1",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "5px",
          cursor: "pointer"
  }}
>
  Contatta venditore
</button>

        {annuncio.immagine && (
          <img
            src={`https://unimarket-itwd.onrender.com/uploads/${annuncio.immagine}`}
            alt={annuncio.titolo}
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "12px" }}
          />
        )}

        <h2 style={{ marginTop: "20px" }}>{annuncio.titolo}</h2>

        <p style={{ fontWeight: "bold", fontSize: "22px", margin: "10px 0" }}>{annuncio.prezzo}€</p>

        <p style={{ color: "#555", margin: "5px 0" }}>{annuncio.citta}</p>

        <p style={{ color: "#555", margin: "5px 0", fontSize: "14px" }}>{annuncio.universita}</p>

        <hr style={{ margin: "20px 0" }} />

        <p>{annuncio.descrizione}</p>

      </div>
    </div>
  );
}

export default DettaglioAnnuncio;

