import Link from "next/link";
import prisma from "@/lib/prisma";
import DeleteButton from "@/components/DeleteButton";
import { offenseStats, defenseStats, physicalStats, gkStats } from "@/lib/statGroups";

type Props = {
  params: Promise<{ id: string }>;
};

function StatGrid({
  title,
  stats,
  values,
  manager,
  threshold,
}: {
  title: string;
  stats: readonly { key: string; label: string }[];
  values: Record<string, any> | null | undefined;
  manager: { name: string; effects: { statName: string }[] } | null | undefined;
  threshold: { lowMax: number; midMax: number } | null;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat) => {
          const base = Number(values?.[stat.key] ?? 0);
          let boosted = base;

          if (base > 0 && threshold) {
            if (base <= threshold.lowMax) boosted += 1;
            else if (base <= threshold.midMax) boosted += 2;
            else boosted += 3;
          }

          const hasIndividualBonus = manager?.effects.some(
            (e) => e.statName === stat.label
          );
          if (hasIndividualBonus) boosted += 1;

          const isBoosted = boosted !== base && base > 0;

          return (
            <div
              key={stat.key}
              className="flex justify-between text-sm bg-gray-100 rounded px-3 py-2"
            >
              <span className="text-gray-500">{stat.label}</span>
              <span className="font-semibold">
                {values?.[stat.key] == null ? (
                  "-"
                ) : isBoosted ? (
                  <>
                    {base} <span className="text-green-600">→ {boosted}</span>
                  </>
                ) : (
                  base
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function PlayerDetail({ params }: Props) {
  const { id } = await params;
  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      positions: {
        include: {
          position: true,
        },
      },
      skills: {
        include: {
          skill: true,
        },
      },
      boosters: {
        include: {
          booster: {
            include: {
              effects: true,
            },
          },
        },
      },
      manager: {
        include: {
          effects: true,
        },
      },
      stats: true,
    },
  });

  if (!player) {
    return <main className="p-8">選手が見つかりませんでした。</main>;
  }

  const threshold = player.manager
    ? await prisma.managerThreshold.findUnique({
        where: { adequacyValue: player.manager.adequacyValue },
      })
    : null;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-2">{player.name}</h1>
      <p className="text-gray-500 mb-4">
        {player.position}・{player.team}
      </p>
      <p className="text-4xl font-bold mb-6">{player.rating}</p>

      <Link href={`/players/${player.id}/train`} className="text-sm underline mb-6 inline-block">
        育成をシミュレートする
      </Link>
      <Link href={`/compare?a=${player.id}`} className="text-sm underline mb-6 inline-block ml-4">
        この選手を比較する
      </Link>

      <Link href={`/players/${player.id}/edit`} className="text-sm underline mb-6 inline-block ml-4">
        この選手を編集する
      </Link>

      <h2 className="text-lg font-semibold mb-2">ポジション適性</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {player.positions.length === 0 && (
          <p className="text-sm text-gray-400">未登録</p>
        )}
        {player.positions.map((pp) => (
          <span key={pp.id} className="text-sm bg-gray-100 rounded px-3 py-1">
            {pp.position.name}({pp.adequacy})
          </span>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-2">所持スキル</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {player.skills.length === 0 && (
          <p className="text-sm text-gray-400">未登録</p>
        )}
        {player.skills.map((ps) => (
          <span key={ps.id} className="text-sm bg-gray-100 rounded px-3 py-1">
            {ps.skill.name}
          </span>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-2">ブースター</h2>
      <div className="flex flex-col gap-2 mb-6">
        {player.boosters.length === 0 && (
          <p className="text-sm text-gray-400">未装備</p>
        )}
        {player.boosters.map((pb) => (
          <div key={pb.id} className="text-sm bg-gray-100 rounded px-3 py-2">
            <p className="font-semibold mb-1">
              {pb.booster.name}(スロット{pb.slotNumber}
              {pb.booster.isConditional ? "・条件あり" : ""})
            </p>
            <div className="flex flex-wrap gap-2">
              {pb.booster.effects.map((effect) => (
                <span
                  key={effect.id}
                  className="text-xs bg-white rounded px-2 py-1"
                >
                  {effect.statName}+{effect.boostAmount}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {player.manager && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">監督</h2>
          <p className="text-sm bg-gray-100 rounded px-3 py-2">
            {player.manager.name}(適性値{player.manager.adequacyValue})
            {player.manager.effects.length > 0 && (
              <span className="ml-2 text-gray-500">
                個別ボーナス: {player.manager.effects.map((e) => e.statName).join("・")}
              </span>
            )}
          </p>
        </div>
      )}

      {player.stats ? (
        <>
          <StatGrid title="攻撃" stats={offenseStats} values={player.stats} manager={player.manager} threshold={threshold} />
          <StatGrid title="ディフェンス" stats={defenseStats} values={player.stats} manager={player.manager} threshold={threshold} />
          <StatGrid title="身体能力" stats={physicalStats} values={player.stats} manager={player.manager} threshold={threshold} />
          <StatGrid title="GK" stats={gkStats} values={player.stats} manager={player.manager} threshold={threshold} />
        </>
      ) : (
        <p className="text-sm text-gray-400">能力値は未登録です。</p>
      )}

      <div className="mt-8">
        <DeleteButton playerId={player.id} />
      </div>
    </main>
  );
}