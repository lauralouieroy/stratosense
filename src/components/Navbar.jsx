import logo from "../assets/statosense-logo.png";

function Navbar({ city, setCity, onSearch, loading }) {
  return (
    <header className="
      sticky top-0 z-50
      px-4 md:px-6 py-3 md:py-4

      bg-white/90 backdrop-blur-xl
      border-b border-gray-200

      shadow-sm
    ">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} className="w-7 h-7 md:w-8 md:h-8" />
          <h1 className="text-base md:text-lg font-semibold tracking-tight text-slate-800">
            StratoSense
          </h1>
        </div>

        {/* Search */}
        <form onSubmit={onSearch} className="flex gap-2 w-full md:w-auto">

          {/* Input (FIXED VISIBILITY) */}
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city..."
            className="
              flex-1 md:w-60

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
            "
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              relative overflow-hidden

              px-4 md:px-5 py-2.5
              text-sm font-medium text-white

              rounded-xl
              bg-gradient-to-r from-blue-500 via-sky-500 to-blue-600

              shadow-md

              transition-all duration-200
              hover:brightness-110 hover:scale-[1.02]

              active:scale-[0.97]

              disabled:opacity-70 disabled:cursor-not-allowed
            "
          >
            <span className="relative flex items-center gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Searching
                </>
              ) : (
                <>
                Search
                </>
              )}
            </span>
          </button>

        </form>

      </div>
    </header>
  );
}

export default Navbar;