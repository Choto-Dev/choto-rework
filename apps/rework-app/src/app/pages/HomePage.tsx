import { Button } from "@workspace/shadcn-ui/ui/button";

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4 bg-black text-white">
      <h1 className="font-medium text-3xl">Hello, ReWork App</h1>

      <Button
        className="hover:cursor-pointer"
        onClick={() => {
          fetch("http://localhost:3000/api");
        }}
        type="button"
        variant={"secondary"}
      >
        Click To Check API
      </Button>
    </main>
  );
}
