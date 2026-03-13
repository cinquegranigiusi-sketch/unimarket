import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Home() {

const [annunci, setAnnunci] = useState([]);
const [preferiti, setPreferiti] = useState([]);
const [filtroCitta, setFiltroCitta] = useState("");
const [filtroUniversita, setFiltroUniversita] = useState("");

const utente = JSON.parse(localStorage.getItem("utente"));

const location = useLocation();
const params = new URLSearchParams(location.search);
const searchQuery = params.get("q") || "";

const API =
 window.location.hostname === "localhost"
   ? "http://localhost:3001"
   : "http://unimarket-1-n0al.onrender.com";

// CARICA ANNUNCI
useEffect(() => {
fetch(`${API}/annunci`)
.then(res => res.json())
.then(data => setAnnunci(data))
.catch(err => console.log(err));
}, []);

// CARICA PREFERITI
useEffect(() => {

if (!utente) return;

fetch(`${API}/preferiti/${utente.id}`)
  .then(res => res.json())
  .then(data => {
    const ids = data.map(a => a.id);
    setPreferiti(ids);
  })
  .catch(err => console.log(err));


}, [utente]);

// AGGIUNGI/RIMUOVI PREFERITI
const togglePreferito = (annuncioId) => {

if (!utente) {
  alert("Devi fare il login!");
  return;
}

const isPreferito = preferiti.includes(annuncioId);

if (isPreferito) {

  fetch(`${API}/preferiti`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      utente_id: utente.id,
      annuncio_id: annuncioId
    })
  })
  .then(() => {
    setPreferiti(prev => prev.filter(id => id !== annuncioId));
  });

} else {

  fetch(`${API}/preferiti`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      utente_id: utente.id,
      annuncio_id: annuncioId
    })
  })
  .then(() => {
    setPreferiti(prev => [...prev, annuncioId]);
  });

}


};

// FILTRI
const annunciFiltrati = annunci.filter((annuncio) => {

const campi = [
  annuncio.titolo || "",
  annuncio.descrizione || "",
  annuncio.categoria || "",
  annuncio.citta || "",
  annuncio.universita || ""
].map(c => c.toLowerCase());

const queryParole = searchQuery
  .toLowerCase()
  .trim()
  .split(" ")
  .filter(p => p !== "");

const matchRicerca = queryParole.every(parola =>
  campi.some(campo => campo.includes(parola))
);

const matchCitta = filtroCitta
  ? (annuncio.citta || "")
      .toLowerCase()
      .includes(filtroCitta.toLowerCase())
  : true;

const matchUniversita = filtroUniversita
  ? (annuncio.universita || "")
      .toLowerCase()
      .includes(filtroUniversita.toLowerCase())
  : true;

return matchRicerca && matchCitta && matchUniversita;


});

return (

<div style={{ backgroundColor:"#cfdee2",minHeight:"100vh",padding:"40px 20px" }}>

  <div style={{ maxWidth:"1200px",margin:"0 auto" }}>

    <h1>Trova quello che cerchi 🎓</h1>

    <p style={{ color:"#2b2d99" }}>
      Il marketplace per studenti universitari
    </p>

    {/* FILTRI */}
    <div style={{ margin:"30px 0",display:"flex",gap:"50px",flexWrap:"wrap" }}>

      <input
        placeholder="Città"
        value={filtroCitta}
        onChange={(e)=>setFiltroCitta(e.target.value)}
        style={{
        padding: "12px 15px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        flex: "1",
        minWidth: "220px"
    }}
/>

      <input
        placeholder="Università"
        value={filtroUniversita}
        onChange={(e)=>setFiltroUniversita(e.target.value)}
        style={{
        padding: "12px 15px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        flex: "1",
        minWidth: "220px"
    }}
/>

    </div>

    <p>{annunciFiltrati.length} annunci trovati</p>

    <div style={{
      display:"grid",
      gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",
      gap:"25px"
    }}>

      {annunciFiltrati.map((annuncio)=>{

        const isFav = preferiti.includes(annuncio.id);

        return (

          <Link
            to={`/annuncio/${annuncio.id}`}
            key={annuncio.id}
            style={{ textDecoration:"none",color:"black" }}
          >

            <div style={{
              background:"white",
              borderRadius:"12px",
              boxShadow:"0 15px 6px rgba(0,0,0,0.2)",
              position:"relative"
            }}>

              {/* CUORE */}
              <div
                onClick={(e)=>{
                  e.preventDefault();
                  togglePreferito(annuncio.id);
                }}
                style={{
                  position:"absolute",
                  top:"10px",
                  right:"10px",
                  fontSize:"24px",
                  color:isFav?"red":"white",
                  textShadow:"0 0 5px black"
                }}
              >
                {isFav ? "♥" : "♡"}
              </div>

              {annuncio.immagine && (
                <img
                  src={`${API}/uploads/${annuncio.immagine}`}
                  alt={annuncio.titolo}
                  style={{
                    width:"100%",
                    height:"180px",
                    objectFit:"cover"
                  }}
                />
              )}

              <div style={{ padding:"15px" }}>

                <h3>{annuncio.titolo}</h3>

                <p style={{ fontWeight:"bold",fontSize:"20px" }}>
                  {annuncio.prezzo}€
                </p>

                <p>{annuncio.citta}</p>

                <p style={{ fontSize:"12px" }}>
                  {annuncio.universita}
                </p>

              </div>

            </div>

          </Link>

        );

      })}

    </div>

  </div>

</div>


);

}

export default Home;