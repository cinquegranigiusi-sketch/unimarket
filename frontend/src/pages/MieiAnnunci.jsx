import { useEffect, useState } from "react";
import axios from "axios";

function MieiAnnunci() {

  const [annunci, setAnnunci] = useState([]);

  const utente = JSON.parse(localStorage.getItem("utente"));

  useEffect(() => {

    axios.get("https://unimarket-1-n0al.onrender.com")
      .then(res => {

        const miei = res.data.filter(a => a.utente_id === utente.id);

        setAnnunci(miei);

      });

  }, []);

  const eliminaAnnuncio = async (id) => {

    if (!window.confirm("Vuoi eliminare questo annuncio?")) return;

    await axios.delete(`https://unimarket-1-n0al.onrender.com/annunci/${id}`);

    setAnnunci(annunci.filter(a => a.id !== id));

  };

  const modificaAnnuncio = (annuncio) => {
  const nuovoTitolo = prompt("Nuovo titolo:", annuncio.titolo);
  const nuovoPrezzo = prompt("Nuovo prezzo:", annuncio.prezzo);
  if (!nuovoTitolo || !nuovoPrezzo) return;

  axios.put(`https://unimarket-1-n0al.onrender.com/annunci/${annuncio.id}`, {
    titolo: nuovoTitolo,
    descrizione: annuncio.descrizione,
    prezzo: nuovoPrezzo,
    categoria: annuncio.categoria,
    universita: annuncio.universita,
    citta: annuncio.citta
  }).then(() => {
    alert("Annuncio aggiornato!");
    // Aggiorna la lista degli annunci senza ricaricare
    setAnnunci(prev => prev.map(a => a.id === annuncio.id ? {...a, titolo: nuovoTitolo, prezzo: nuovoPrezzo} : a));
  }).catch(err => console.error(err));
};

  return (

    <div style={{ padding: "40px", maxWidth: "1000px", margin: "auto" }}>

      <h1>I miei annunci</h1>

      {annunci.length === 0 && (
        <p>Non hai ancora pubblicato annunci</p>
      )}

      {annunci.map((annuncio) => (

  <div
    key={annuncio.id}
    style={{
      display: "flex",
      gap: "20px",
      background: "white",
      borderRadius: "10px",
      padding: "15px",
      marginTop: "20px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
    }}
  >

    {annuncio.immagine && (
      <img
        src={`https://unimarket-1-n0al.onrender.com/uploads/${annuncio.immagine}`}
        alt={annuncio.titolo}
        style={{
          width: "120px",
          height: "120px",
          objectFit: "cover",
          borderRadius: "8px"
        }}
      />
    )}

    <div style={{ flex: 1 }}>

      <h3 style={{ margin: "0 0 5px 0" }}>
        {annuncio.titolo}
      </h3>

      <p style={{
        fontSize: "20px",
        fontWeight: "bold",
        color: "#3d6df1",
        margin: "5px 0"
      }}>
        {annuncio.prezzo}€
      </p>

      <p style={{ color: "#666" }}>
        {annuncio.citta}
      </p>

      <button
        onClick={() => eliminaAnnuncio(annuncio.id)}
        style={{
          marginTop: "10px",
          background: "red",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Elimina annuncio
      </button>

      <button
  onClick={() => modificaAnnuncio(annuncio)}
  style={{
    marginTop: "10px",
    background: "#3d6df1",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    marginLeft: "10px"
  }}
>
  Modifica
</button>

    </div>

  </div>

))}
    </div>
  );
}

export default MieiAnnunci;