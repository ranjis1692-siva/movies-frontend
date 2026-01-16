import React, { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import MovieModal from "./MovieModal";

import {
  Box,
  TextField,
  Autocomplete,
  ListItemAvatar,
  Avatar,
  Typography,
  useMediaQuery,
} from "@mui/material";

interface MovieSuggestion {
  id: number;
  name: string;
  thumbnailUrl?: string;
}

interface Movie extends MovieSuggestion {
  description?: string;
  releaseDate?: string;
  year?: number;
  genres?: string;
  actors?: string;
  directors?: string;
  imageUrl?: string;
  rating?: number;
  duration?: string;
}

const saveRecentMovies = (movies: MovieSuggestion[]) => {
  localStorage.setItem("recent_movies", JSON.stringify(movies));
};

const MovieSearch: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [recentMovies, setRecentMovies] = useState<MovieSuggestion[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage,setCurrentPage] = useState(1);
  const listboxRef = useRef<HTMLUListElement | null>(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const data = localStorage.getItem("recent_movies");
    setRecentMovies(data ? JSON.parse(data) : []);
  }, []);

  const fetchSuggestions = async (q: string, page: number) => {
    if (!q.trim()) {setSuggestions(recentMovies);
      setHasMore(false);
      return;
    }
    try {
      const res = await axios.get("http://localhost:8080/api/movies/searchPaginated",{params:{searchText:q,page}});
      const movies: MovieSuggestion[] = res.data.content.map((m: Movie) => ({
        id: m.id,
        name: m.name,
        thumbnailUrl: m.thumbnailUrl,
      }));

      if (page === 1) {
        setSuggestions(movies);
      } else {
        setSuggestions((prev) => prev.concat(movies));
      }
      setHasMore(!res.data.last);
    } catch (err) {
      console.error(err);
    }
  };

const handleInputChange = (_: React.SyntheticEvent,value: string) => {
  setSearchText(value);
  if (!value.trim()) {
    setSuggestions(recentMovies);
    setHasMore(false);
    return;
  }
  setHasMore(true);
  fetchSuggestions(value, 1);
};

const handleSelect = async (movie: MovieSuggestion | string | null) => {
  if (!movie || typeof movie === "string") {
    return; 
  }
  setSearchText(movie.name);
  setSuggestions([]);
  try {
    const res = await axios.get<Movie>(
      `http://localhost:8080/api/movies/${movie.id}`
    );
    setSelectedMovie(res.data);
    setRecentMovies((prev) => {
      const updated = [
        movie,
        ...prev.filter((m) => m.id !== movie.id),
      ].slice(0, 10);
      saveRecentMovies(updated);
      return updated;
    });
  } catch (err) {
    console.error(err);
  }
};

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20 && hasMore &&searchText.trim()) {
      setCurrentPage(prev => prev+1);
    }
  };

  useMemo(() => {
      fetchSuggestions(searchText, currentPage);
  },[currentPage])

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : 400,
        mx: "auto",
        mt: 4,
        px: isMobile ? 1 : 0,
      }}
    >
      <Typography variant="h5" sx={{ color: "#6A1B9A", mb: 1 }}>
        Movie Search
      </Typography>
      <Autocomplete
        freeSolo
        clearOnBlur={false}
        options={suggestions}
        value={null} 
        inputValue={searchText}
        onInputChange={handleInputChange}
        onChange={(_, value) => handleSelect(value)}
        filterOptions={(x) => x}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name
        }
        
        slotProps={{
           paper: {
      sx: {
        maxHeight: isMobile ? "50vh" : 300,
        overflowY: "auto",
      },
    },
          listbox:{
ref: listboxRef,
          onScroll: handleScroll,
          sx: {
            padding: 0,
          },
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search movies..."
            onFocus={() => {
              if(searchText=="")
                setSuggestions(recentMovies);
      }}
          />
        )}
        renderOption={(props, option) => {
          const isRecent =
            !searchText.trim() &&
            recentMovies.some((r) => r.id === option.id);

          return (
            <li {...props} key={option.id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 1,
                  py: 1,
                  width: "100%",
                }}
              >
                {option.thumbnailUrl && (
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={option.thumbnailUrl}
                      sx={{ width: 40, height: 60, mr: 1 }}
                    />
                  </ListItemAvatar>
                )}

                <Box sx={{ flex: 1 }}>
                  <Typography>{option.name}</Typography>
                  {isRecent && (
                    <Typography
                      variant="caption"
                      sx={{ color: "#6A1B9A" }}
                    >
                      Recent
                    </Typography>
                  )}
                </Box>
              </Box>
            </li>
          );
        }}
      />

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => {setSelectedMovie(null)}}
        />
      )}
    </Box>
  );
};

export default MovieSearch;
