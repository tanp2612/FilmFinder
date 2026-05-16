import { Button } from "@bigbinary/neetoui";
import useFavouritesStore from "../stores/favouritesStore";

const Favourites = () => {
  const favourites = useFavouritesStore(state => state.favourites);
  const removeFavourite = useFavouritesStore(state => state.removeFavourite);

  return (
    <main className="favourites-page">
      <section className="favourites-container">
        {favourites.length === 0 ? (
          <p className="empty-message">No favourites added yet.</p>
        ) : (
          favourites.map(movie => (
            <article className="favourite-item" key={movie.imdbID}>
              <div>
                <h3>{movie.Title}</h3>

                <p>
                  <span>Rating:</span>{" "}
                  {movie.imdbRating && movie.imdbRating !== "N/A"
                    ? `${movie.imdbRating}/10`
                    : "N/A"}
                </p>
              </div>

              <Button
                label="Remove"
                className="remove-favourite-button"
                onClick={() => removeFavourite(movie.imdbID)}
              />
            </article>
          ))
        )}
      </section>
    </main>
  );
};

export default Favourites;