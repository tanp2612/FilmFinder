const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export const searchMovies = async (query, page = 1, filters = {}) => {
  const params = new URLSearchParams({
    apikey: API_KEY,
    s: query,
    page,
  });

  if (filters.year) {
    params.append("y", filters.year);
  }

  if (filters.type && filters.type !== "all") {
    params.append("type", filters.type);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error);
  }

  return data;
};
export const getMovieDetails = async imdbID => {
  const response = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`
  );

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error);
  }

  return data;
};