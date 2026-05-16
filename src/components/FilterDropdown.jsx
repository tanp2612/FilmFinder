const FilterDropdown = ({
  isOpen,
  onClose,
  year,
  onYearChange,
  selectedTypes,
  onTypeChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="filter-dropdown">
      <button type="button" className="filter-close-button" onClick={onClose}>
        ×
      </button>

      <label className="filter-label" htmlFor="year">
        Year
      </label>

      <input
        id="year"
        value={year}
        onChange={event => {
          const value = event.target.value.replace(/\D/g, "");
          onYearChange(value);
        }}
        placeholder="2024"
        maxLength={4}
        className="filter-year-input"
      />

      <p className="filter-label">Type</p>

      <div className="filter-checkbox-row">
        <label>
          <input
            type="checkbox"
            checked={selectedTypes.movie}
            onChange={() => onTypeChange("movie")}
          />
          Movie
        </label>

        <label>
          <input
            type="checkbox"
            checked={selectedTypes.series}
            onChange={() => onTypeChange("series")}
          />
          Series
        </label>
      </div>
    </div>
  );
};

export default FilterDropdown;