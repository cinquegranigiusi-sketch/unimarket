import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [apriMenu, setApriMenu] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const chiudiMenu = () => setApriMenu(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/?q=${encodeURIComponent(search.trim())}`);
      setSearch(""); // opzionale: pulisce la barra dopo la ricerca
    }
  };

  return (
    <nav style={{
      backgroundColor: "#226999",
      padding: "10px 20px",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      {/* Logo */}
      <div>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "20px" }}>UniMarket</Link>
      </div>

      {/* Barra di ricerca */}
      <form onSubmit={handleSearch} style={{ flex: 1, margin: "0 20px", position: "relative", maxWidth: "500px" }}>
        <input
          type="text"
          placeholder="Cerca annunci..."
          value={search}
          onChange={(e) => {
          const valore = e.target.value;
          setSearch(valore);
          navigate(`/?q=${encodeURIComponent(valore)}`);
        }}
        style={{
          width: "100%",
          padding: "8px 35px 8px 12px",
          borderRadius: "8px",
          border: "none",
          outline: "none",
          fontSize: "16px"
        }}
      />

      <span
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#666",
          fontSize: "18px"
        }}
      >
        &#128269;
      </span>

      </form>

      {/* Menu a tendina */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setApriMenu(!apriMenu)}
          style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "16px" }}
        >
          Menu &#x25BC;
        </button>

        {apriMenu && (
          <div style={{
            position: "absolute",
            right: 0,
            top: "100%",
            backgroundColor: "white",
            color: "#25437c",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(9, 51, 129, 0.2)",
            marginTop: "5px",
            minWidth: "150px",
            zIndex: 100
          }}>
            <Link to="/" style={linkStyle} onClick={chiudiMenu}>Home</Link>
            <Link to="/pubblica" style={linkStyle} onClick={chiudiMenu}>Pubblica</Link>
            <Link to="/login" style={linkStyle} onClick={chiudiMenu}>Login</Link>
            <Link to="/registrati" style={linkStyle} onClick={chiudiMenu}>Registrati</Link>
            <Link to="/preferiti" style={linkStyle} onClick={chiudiMenu}>Preferiti</Link>
            <Link to="/miei-annunci" style={linkStyle} onClick={chiudiMenu}>I miei annunci</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  display: "block",
  padding: "10px 15px",
  textDecoration: "none",
  color: "#194a81",
  borderBottom: "1px solid #eee",
  transition: "background 0.2s",
  cursor: "pointer"
};

export default Navbar;