import { useEffect, useId, useRef, useState } from "react";
import Logo from "./Logo";
import { searchCities } from "../services/weatherApi";

function matchedName(name, query) {
  const typed = query.trim();
  if (!typed || !name.toLowerCase().startsWith(typed.toLowerCase())) return name;
  return (
    <>
      <span className="suggest-match">{name.slice(0, typed.length)}</span>
      {name.slice(typed.length)}
    </>
  );
}

function Navbar({ city, setCity, onSearch, onPick, onLocate, loading, locating }) {
  const listId = useId();
  const boxRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [active, setActive] = useState(-1);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!open) return undefined;
    const query = city.trim();

    if (query.length < 2) {
      setSuggestions([]);
      setActive(-1);
      setStatus(query ? "Keep typing…" : "");
      return undefined;
    }

    const controller = new AbortController();
    let cancelled = false;
    setStatus("Finding cities…");
    const timer = setTimeout(async () => {
      try {
        const places = await searchCities(query, controller.signal);
        if (cancelled) return;
        setSuggestions(places);
        setActive(places.length ? 0 : -1);
        setStatus(places.length ? "" : "No cities match that.");
      } catch (error) {
        if (cancelled || error.name === "AbortError") return;
        setSuggestions([]);
        setActive(-1);
        setStatus("Suggestions are unavailable.");
      }
    }, 280);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [city, open]);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (!boxRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const choose = (place) => {
    setOpen(false);
    setSuggestions([]);
    setStatus("");
    setCity(place.name);
    onPick(place);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(suggestions.length - 1, index + 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(0, index - 1));
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "Enter" && open && suggestions[active]) {
      event.preventDefault();
      choose(suggestions[active]);
    }
  };

  const showPanel = open && (suggestions.length > 0 || status);

  return (
    <header className="nav-bar px-4 md:px-6 py-3 md:py-4">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <div className="flex items-center gap-2">
          <Logo decorative className="logo-mark" />
          <h1 className="nav-title">
            StratoSense
          </h1>
        </div>

        <form onSubmit={onSearch} className="flex gap-2 w-full md:w-auto">
          <div className="search-suggest" ref={boxRef}>
            <input
              value={city}
              onChange={(event) => {
                setCity(event.target.value);
                setOpen(true);
              }}
              onFocus={() => {
                if (city.trim()) setOpen(true);
              }}
              onKeyDown={onKeyDown}
              placeholder="Search city..."
              role="combobox"
              aria-expanded={open}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
              autoComplete="off"
              className="
                search-field
                w-full

                px-4 py-2 text-sm
                rounded-xl

                bg-white
                border border-gray-300

                text-slate-800 placeholder-slate-400

                outline-none
                transition-all duration-200

                focus:ring-2 focus:ring-blue-400
                focus:border-blue-400
                focus:shadow-sm

                hover:border-sky-400 hover:shadow-md
              "
            />

            {showPanel && (
              <div className="suggest-panel">
                {suggestions.length > 0 && (
                  <ul className="suggest-list" id={listId} role="listbox">
                    {suggestions.map((place, index) => (
                      <li key={place.label} role="presentation">
                        <button
                          type="button"
                          id={`${listId}-${index}`}
                          role="option"
                          aria-selected={index === active}
                          className={`suggest-option${index === active ? " is-active" : ""}`}
                          onMouseEnter={() => setActive(index)}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => choose(place)}
                        >
                          <span className="suggest-name">{matchedName(place.name, city)}</span>
                          <span className="suggest-meta">
                            {[place.state, place.country].filter(Boolean).join(", ")}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {status && <p className="suggest-status">{status}</p>}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onLocate}
            disabled={loading || locating}
            aria-label="Use my location"
            className="locate-btn"
          >
            {locating ? (
              <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <circle cx="12" cy="12" r="3.25" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 3.5v2.2M12 18.3V20.5M3.5 12h2.2M18.3 12H20.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>

          <button
            type="submit"
            disabled={loading || locating}
            className="action-btn"
          >
            <span className="relative flex items-center gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Searching
                </>
              ) : (
                "Search"
              )}
            </span>
          </button>

        </form>

      </div>
    </header>
  );
}

export default Navbar;
