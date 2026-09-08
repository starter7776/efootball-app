import prisma from "@/lib/prisma";
import { offenseStats, defenseStats, physicalStats, gkStats } from "@/lib/statGroups";

type Props = {
  searchParams: Promise<{ a?: string; b?: string }>;
};

const allStatGroups = [
  { title: "攻撃", stats: offenseStats },
  { title: "ディフェンス", stats: defenseStats },
  { title: "身体能力", stats: physicalStats },
  { title: "GK", stats: gkStats },
];

function tierColor(v: number) {
  if (v < 50) return "#D85A30";
  if (v < 70) return "#EF9F27";
  if (v < 90) return "#639922";
  return "#378ADD";
}

export default async function ComparePage({ searchParams }: Props) {
  const { a, b } = await searchParams;
  const players = await prisma.player.findMany();

  const playerA = a
    ? await prisma.player.findUnique({ where: { id: a }, include: { stats: true } })
    : null;
  const playerB = b
    ? await prisma.player.findUnique({ where: { id: b }, include: { stats: true } })
    : null;

  return (
    <main className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">選手比較</h1>

      <form className="flex gap-4 mb-8" method="get">
        <select name="a" defaultValue={a ?? ""} className="border rounded p-2 flex-1">
          <option value="">選手Aを選択</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select name="b" defaultValue={b ?? ""} className="border rounded p-2 flex-1">
          <option value="">選手Bを選択</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-black text-white rounded px-4">
          比較する
        </button>
      </form>

      {playerA && playerB ? (
        <>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 text-center">
              <p className="font-semibold">{playerA.name}</p>
              <p className="text-sm text-gray-500">
                {playerA.position}・総合値{playerA.rating}
              </p>
            </div>
            <div className="flex-1 text-center">
              <p className="font-semibold">{playerB.name}</p>
              <p className="text-sm text-gray-500">
                {playerB.position}・総合値{playerB.rating}
              </p>
            </div>
          </div>

          {allStatGroups.map((group) => (
            <div key={group.title} className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{group.title}</h2>
              {group.stats.map((stat) => {
                const va = Number((playerA.stats as any)?.[stat.key] ?? 0);
                const vb = Number((playerB.stats as any)?.[stat.key] ?? 0);
                const diff = vb - va;
                const diffColor = diff > 0 ? "#639922" : diff < 0 ? "#D85A30" : "#9c9a92";
                const diffText = diff === 0 ? "" : diff > 0 ? `+${diff}` : `${diff}`;
                return (
                  <div key={stat.key} className="flex items-center gap-2 py-1 border-t">
                    <span
                      className="w-10 h-6 rounded text-white text-sm flex items-center justify-center font-semibold"
                      style={{ backgroundColor: tierColor(va) }}
                    >
                      {va}
                    </span>
                    <span className="flex-1 text-center text-sm">{stat.label}</span>
                    <span
                      className="w-10 h-6 rounded text-white text-sm flex items-center justify-center font-semibold"
                      style={{ backgroundColor: tierColor(vb) }}
                    >
                      {vb}
                    </span>
                    <span className="w-10 text-xs font-semibold" style={{ color: diffColor }}>
                      {diffText}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </>
      ) : (
        <p className="text-sm text-gray-400">
          2人の選手を選んで「比較する」を押してください。
        </p>
      )}
    </main>
  );
}