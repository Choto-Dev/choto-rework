import { useHead } from "@unhead/react";
import { Button } from "@workspace/shadcn-ui/ui/button";
import { serverActions } from "../libs/server-actions";

export default function HomePage() {
  const { data, isLoading } = serverActions.IsValidServer.useData();

  useHead({
    title: isLoading ? "Loading..." : "Home",
    titleTemplate(title) {
      return title ? `${title} - ReWork App` : "ReWork App";
    },
    meta: [{ name: "description", content: "Home page of ReWork App" }],
  });

  if (isLoading) {
    return (
      <main className="flex h-screen items-center justify-center bg-black text-white">
        <h1 className="text-4xl text-muted-foreground">Loading</h1>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4 bg-black text-white">
      <h1 className="font-medium text-3xl">Hello, ReWork App</h1>
      <p>{data?.ok}</p>

      <Button
        className="hover:cursor-pointer"
        onClick={() => {
          fetch("http://localhost:3000/actions/is-valid-project");
        }}
        type="button"
        variant={"secondary"}
      >
        Click To Check API
      </Button>
    </main>
  );
}
