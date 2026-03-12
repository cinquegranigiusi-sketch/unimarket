import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Preferiti() {
  const [annunci, setAnnunci] = useState([]);
  const utente = JSON.parse(localStorage.getItem("utente"));

  useEffect(() => {
    if (!utente) return;

    fetch(`https://unimarket-itwd.onrender.com/preferiti/${utente.id}`)
      .then(res => res.json())
      .then(data => setAnnunci(data))
      .catch(err => console.log(err));
  }, [utente]);

  if (!utente) {
    return <p>Devi effettuare il login per vedere i preferiti.</p>;
  }

  return (
    <div style={{ padding: "40px", backgroundColor: "#dde4e6", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "30px" }}>I miei preferiti</h1>

      {annunci.length === 0 ? (
        <p>Non hai ancora salvato nessun annuncio.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "25px"
        }}>
          {annunci.map((a, index) => (
            <Link
              to={`/annuncio/${a.id}`}
              key={a.id || index}
              style={{
                textDecoration: "none",
                color: "black",
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
              }}
            >
              {a.immagine && (
                <img
                  src={`https://unimarket-itwd.onrender.com/uploads/${a.immagine}`}
                  alt={a.titolo}
                  style={{ width: "100%", height: "180px", objectFit: "cover" }}
                />
              )}
              <div style={{ padding: "15px", display: "flex", flexDirection: "column", flex: 1 }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>{a.titolo}</h3>
                <p style={{ fontWeight: "bold", fontSize: "20px", color: "#181717", margin: "0 0 10px 0" }}>
                  {a.prezzo}€
                </p>
                {a.citta && <p style={{ color: "#555", margin: "0 0 5px 0", fontSize: "14px" }}>{a.citta}</p>}
                {a.universita && <p style={{ color: "#181717", margin: "0", fontSize: "12px" }}>{a.universita}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Preferiti;