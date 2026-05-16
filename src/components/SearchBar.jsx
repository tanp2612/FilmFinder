import { useEffect, useRef } from "react";

const SearchBar = ({ value, onChange }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === "/") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="search-box">
      <span className="search-icon">⌕</span>

      <input
        ref={inputRef}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="Search movies"
      />
    </div>
  );
};

export default SearchBar;