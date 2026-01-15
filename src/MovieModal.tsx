import React from "react";

interface Movie {
  id: number;
  name: string;
  description?: string;
  releaseDate?: string;
  year?: number;
  genres?: string;
  actors?: string;
  directors?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  rating?: number;
  duration?: string;
}

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const parseList = (str?: string) => {
    if (!str) return [];
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  };

  const genres = parseList(movie.genres);
  const actors = parseList(movie.actors);
  const directors = parseList(movie.directors);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          width: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          display: "flex",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        {movie.thumbnailUrl && (
          <div style={{ flex: "0 0 180px", borderRadius: "12px 0 0 12px", overflow: "hidden" }}>
            <img
              src={movie.thumbnailUrl}
              alt={movie.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
        <div style={{ padding: "20px", flex: 1 }}>
          <h2 style={{ color: "#6a1b9a", marginBottom: "12px" }}>{movie.name}</h2>
          {movie.year && <p><strong>Year:</strong> {movie.year}</p>}
          {movie.rating !== undefined && <p><strong>Rating:</strong> {movie.rating}</p>}
          {movie.duration && <p><strong>Duration:</strong> {movie.duration}</p>}
          {movie.releaseDate && <p><strong>Release Date:</strong> {movie.releaseDate}</p>}

          {genres.length > 0 && (
            <div style={{ margin: "8px 0" }}>
              <strong>Genres:</strong>{" "}
              {genres.map((g: string, idx: number) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: "#e1bee7",
                    color: "#6a1b9a",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    marginRight: "4px",
                    fontSize: "12px",
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {actors.length > 0 && (
            <div style={{ margin: "8px 0" }}>
              <strong>Actors:</strong>{" "}
              {actors.map((a: string, idx: number) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: "#f3e5f5",
                    color: "#4a148c",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    marginRight: "4px",
                    fontSize: "12px",
                  }}
                >
                  {a}
                </span>
              ))}
            </div>
          )}

          {directors.length > 0 && (
            <div style={{ margin: "8px 0" }}>
              <strong>Directors:</strong>{" "}
              {directors.map((d: string, idx: number) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: "#ede7f6",
                    color: "#311b92",
                    padding: "4px 8px",
                    borderRadius: "12px",
                    marginRight: "4px",
                    fontSize: "12px",
                  }}
                >
                  {d}
                </span>
              ))}
            </div>
          )}

          {movie.description && <p style={{ marginTop: "12px" }}>{movie.description}</p>}

          <button
            onClick={onClose}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#6a1b9a",
              color: "#fff",
              fontWeight: 500,
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7b1fa2")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6a1b9a")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
