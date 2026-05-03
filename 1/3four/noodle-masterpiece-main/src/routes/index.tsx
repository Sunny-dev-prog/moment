import { createFileRoute } from "@tanstack/react-router";
import Card4Noodles from "@/components/cards/Card4Noodles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "山西面食互动卡 · 一刀一面一江湖" },
      {
        name: "description",
        content:
          "点一下面团，再选一把刀。6 种山西面、3 种灵魂卤子，做一碗属于你的山西面。",
      },
      { property: "og:title", content: "山西面食互动卡 · 一刀一面一江湖" },
      {
        property: "og:description",
        content: "点一下面团，再选一把刀。一碗山西面，烟火人间。",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-[#14080a]">
      <Card4Noodles />
    </main>
  );
}
