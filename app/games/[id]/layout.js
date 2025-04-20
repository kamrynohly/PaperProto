// app/games/[id]/layout.js
export default function GameLayout({ children }) {
    return (
      <div className="w-full h-screen">
        {children}
      </div>
    );
}