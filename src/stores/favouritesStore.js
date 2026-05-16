import { create } from "zustand";

const FAVOURITES_STORAGE_KEY = "cinesearcher-favourites";

const getStoredFavourites = () => {
  const storedFavourites = localStorage.getItem(FAVOURITES_STORAGE_KEY);

  if (!storedFavourites) return [];

  try {
    return JSON.parse(storedFavourites);
  } catch {
    return [];
  }
};

const saveFavourites = favourites => {
  localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favourites));
};

const useFavouritesStore = create(set => ({
  favourites: getStoredFavourites(),

  addFavourite: movie =>
    set(state => {
      const alreadyExists = state.favourites.some(
        favourite => favourite.imdbID === movie.imdbID
      );

      if (alreadyExists) {
        return state;
      }

      const updatedFavourites = [...state.favourites, movie];
      saveFavourites(updatedFavourites);

      return {
        favourites: updatedFavourites,
      };
    }),

  removeFavourite: imdbID =>
    set(state => {
      const updatedFavourites = state.favourites.filter(
        movie => movie.imdbID !== imdbID
      );

      saveFavourites(updatedFavourites);

      return {
        favourites: updatedFavourites,
      };
    }),
}));

export default useFavouritesStore;