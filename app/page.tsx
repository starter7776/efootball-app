import Link from "next/link";
import PlayerCard from "@/components/PlayerCard";
import prisma from "@/lib/prisma";

type Props = {
  searchParams: Promise<{ q?: string; position?: string; sort?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { q, position, sort } = await searchParams;

  const players = await prisma.player.findMany({
    where: {
      name: q ? { contains: q, mode: "insensitive" } : undefined,
      position: position ? position : undefined,
    },
    orderBy: sort === "rating_asc" ? { rating: "asc" } : { rating: "desc" },
  });

  const allPlayers = await prisma.player.findMany({ select: { position: true } });
  const positionOptions = Array.from(new Set(allPlayers.map((p) => p.position)));

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">選手一覧</h1>
        <Link href="/register" className="text-sm underline">
          ＋ 新規登録
        </Link>
        <Link href="/compare" className="text-sm underline">
          選手を比較する
        </Link>
      </div>

      <form className="flex gap-2 mb-6" method="get">
        <input
          type="text"
          name="q"
          placeholder="選手名で検索"
          defaultValue={q}
          className="border rounded p-2 flex-1"
        />
        <select name="position" defaultValue={position ?? ""} className="border rounded p-2">
          <option value="">ポジション</option>
          {positionOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={sort ?? ""} className="border rounded p-2">
          <option value="">総合値: 高い順</option>
          <option value="rating_asc">総合値: 低い順</option>
        </select>
        <button type="submit" className="bg-black text-white rounded px-4">
          検索
        </button>
      </form>

      <div className="grid grid-cols-3 gap-4">
        {players.map((player) => (
          <div key={player.id} className="flex flex-col">
            <Link href={`/players/${player.id}`}>
              <PlayerCard {...player} />
            </Link>
            <Link
              href={`/players/${player.id}/train`}
              className="mt-2 text-center text-sm bg-gray-800 text-white rounded py-1"
            >
              育成する
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}