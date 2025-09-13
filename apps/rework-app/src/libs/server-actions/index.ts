import { useQuery } from "@tanstack/react-query";
import type { Context } from "hono";

type ServerActionName = "IsValidServer";

type ServerActions = Record<
  ServerActionName,
  {
    type: "get" | "post";
    path: string;
    action: (c: Context, devWorkingDir?: string) => any;
    fetch: () => Promise<any>;
    useData: () => { data: any; isLoading: any };
  }
>;

export const serverActions: ServerActions = {
  IsValidServer: {
    type: "get",
    path: "/actions/is-valid-project",
    action(c: Context, devWorkingDir?: string) {
      return c.json({ ok: devWorkingDir });
    },
    async fetch() {
      const res = await fetch(this.path);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json() as Promise<{ ok: string }>;
    },
    useData() {
      const { data, isLoading } = useQuery({
        queryKey: [this.path],
        queryFn: async () => await this.fetch(),
      });

      return { data, isLoading };
    },
  },
};
