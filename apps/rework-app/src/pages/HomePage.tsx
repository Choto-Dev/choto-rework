import { useHead } from "@unhead/react";
import { ToggleTheme } from "@workspace/shadcn-ui/components/toggle-theme";
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
      <main className="flex h-screen items-center justify-center">
        <h1 className="text-4xl text-muted-foreground">Loading</h1>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-medium text-3xl">Hello, ReWork App</h1>
      <p>CWR: {data.ok}</p>

      <ToggleTheme />
    </main>
  );
}
