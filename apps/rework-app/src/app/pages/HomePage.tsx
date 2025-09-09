export default function HomePage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4 bg-black text-white">
      <h1 className="font-medium text-3xl">Hello, ReWork App</h1>

      <button
        className="border border-zinc-700 p-5 transition-colors hover:cursor-pointer hover:border-zinc-400"
        onClick={() => {
          fetch("http://localhost:3000/api");
        }}
        type="button"
      >
        Click To Check API
      </button>
    </main>
  );
}
