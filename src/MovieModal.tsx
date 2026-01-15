import React from "react";

interface Movie {
  id: number;
  name: string;
  description?: string;
  releaseDate?: string;
}

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
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
          padding: "24px",
          borderRadius: "8px",
          minWidth: "300px",
          maxWidth: "500px",
        }}
      >
        <h2>{movie.name}</h2>
        <p><strong>ID:</strong> {movie.id}</p>
        {movie.description && <p>{movie.description}</p>}
        {movie.releaseDate && <p><strong>Release:</strong> {movie.releaseDate}</p>}
        <button
          onClick={onClose}
          style={{
            marginTop: "16px",
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "#fff",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MovieModal;
