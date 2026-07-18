export const NavBar = () => {
  return (
    <nav className="flex items-center justify-between h-16 px-6 border-b border-gray-800 ">
      <div className="flex items-center gap-4">
        <img
          src="/MockTrade.png"
          alt="MockTrade Logo"
          className="h-10 w-auto object-contain"
        />
        <h2 className="text-2xl font-semibold text-gray-300">MockTrade</h2>
      </div>

      <div className="flex items-center gap-6"></div>
    </nav>
  );
};
