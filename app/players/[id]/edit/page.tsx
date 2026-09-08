import { updatePlayer } from "@/app/actions";
import prisma from "@/lib/prisma";
import { offenseStats, defenseStats, physicalStats, gkStats } from "@/lib/statGroups";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPlayerPage({ params }: Props) {
  const { id } = await params;
  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      positions: true,
      skills: true,
      stats: true,
    },
  });

  if (!player) {
    return <main className="p-8">選手が見つかりませんでした。</main>;
  }

  const positions = await prisma.position.findMany();
  const skills = await prisma.skill.findMany();
  const managers = await prisma.manager.findMany();

  const highPositionIds = player.positions
    .filter((pp) => pp.adequacy === "濃い")
    .map((pp) => pp.positionId);
  const lowPositionIds = player.positions
    .filter((pp) => pp.adequacy === "薄い")
    .map((pp) => pp.positionId);
  const skillIds = player.skills.map((ps) => ps.skillId);

  const updateWithId = updatePlayer.bind(null, player.id);

  return (
    <main className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{player.name} を編集</h1>
      <form action={updateWithId} className="flex flex-col gap-8">
        <section>
          <h2 className="text-lg font-semibold mb-2">基本情報</h2>
          <div className="grid grid-cols-2 gap-2">
            <input name="name" defaultValue={player.name} placeholder="選手名" required className="border rounded p-2" />
            <input name="team" defaultValue={player.team} placeholder="所属チーム" required className="border rounded p-2" />
            <input name="position" defaultValue={player.position} placeholder="ポジション表記(例: CF)" required className="border rounded p-2" />
            <input name="rating" type="number" defaultValue={player.rating} placeholder="総合値" required className="border rounded p-2" />
            <input name="nationality" defaultValue={player.nationality ?? ""} placeholder="出身地" className="border rounded p-2" />
            <select name="preferredFoot" defaultValue={player.preferredFoot ?? ""} className="border rounded p-2">
              <option value="">利き足</option>
              <option value="右">右</option>
              <option value="左">左</option>
            </select>
            <input name="height" type="number" defaultValue={player.height ?? ""} placeholder="身長(cm)" className="border rounded p-2" />
            <input name="weight" type="number" defaultValue={player.weight ?? ""} placeholder="体重(kg)" className="border rounded p-2" />
            <input name="age" type="number" defaultValue={player.age ?? ""} placeholder="年齢" className="border rounded p-2" />
            <select name="weakFootAccuracy" defaultValue={player.weakFootAccuracy ?? ""} className="border rounded p-2">
              <option value="">逆足精度</option>
              <option value="5">最高</option>
              <option value="4">高い</option>
              <option value="3">普通</option>
              <option value="2">低い</option>
              <option value="1">やや低い</option>
            </select>
            <select name="weakFootFrequency" defaultValue={player.weakFootFrequency ?? ""} className="border rounded p-2">
              <option value="">逆足頻度</option>
              <option value="5">最高</option>
              <option value="4">高い</option>
              <option value="3">普通</option>
              <option value="2">低い</option>
              <option value="1">やや低い</option>
            </select>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">レベル情報</h2>
          <div className="grid grid-cols-3 gap-2">
            <input name="currentLevel" type="number" defaultValue={player.currentLevel ?? ""} placeholder="現在レベル" className="border rounded p-2" />
            <input name="levelCap" type="number" defaultValue={player.levelCap ?? ""} placeholder="レベル上限" className="border rounded p-2" />
            <input name="currentPoints" type="number" defaultValue={player.currentPoints ?? ""} placeholder="保有TP" className="border rounded p-2" />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">監督</h2>
          <select name="managerId" defaultValue={player.managerId ?? ""} className="border rounded p-2 w-full">
            <option value="">監督なし</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}(適性値{m.adequacyValue})
              </option>
            ))}
          </select>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">ポジション適性(濃い)</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {positions.map((p) => (
              <label key={p.id} className="text-sm border rounded px-2 py-1 flex items-center gap-1">
                <input
                  type="checkbox"
                  name="highPositions"
                  value={p.id}
                  defaultChecked={highPositionIds.includes(p.id)}
                />
                {p.name}
              </label>
            ))}
          </div>
          <h2 className="text-lg font-semibold mb-2">ポジション適性(薄い)</h2>
          <div className="flex flex-wrap gap-2">
            {positions.map((p) => (
              <label key={p.id} className="text-sm border rounded px-2 py-1 flex items-center gap-1">
                <input
                  type="checkbox"
                  name="lowPositions"
                  value={p.id}
                  defaultChecked={lowPositionIds.includes(p.id)}
                />
                {p.name}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">所持スキル</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <label key={s.id} className="text-sm border rounded px-2 py-1 flex items-center gap-1">
                <input
                  type="checkbox"
                  name="skills"
                  value={s.id}
                  defaultChecked={skillIds.includes(s.id)}
                />
                {s.name}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">攻撃</h2>
          <div className="grid grid-cols-2 gap-2">
            {offenseStats.map((s) => (
              <input
                key={s.key}
                name={s.key}
                type="number"
                defaultValue={(player.stats as any)?.[s.key] ?? ""}
                placeholder={s.label}
                className="border rounded p-2"
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">ディフェンス</h2>
          <div className="grid grid-cols-2 gap-2">
            {defenseStats.map((s) => (
              <input
                key={s.key}
                name={s.key}
                type="number"
                defaultValue={(player.stats as any)?.[s.key] ?? ""}
                placeholder={s.label}
                className="border rounded p-2"
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">身体能力</h2>
          <div className="grid grid-cols-2 gap-2">
            {physicalStats.map((s) => (
              <input
                key={s.key}
                name={s.key}
                type="number"
                defaultValue={(player.stats as any)?.[s.key] ?? ""}
                placeholder={s.label}
                className="border rounded p-2"
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">GK</h2>
          <div className="grid grid-cols-2 gap-2">
            {gkStats.map((s) => (
              <input
                key={s.key}
                name={s.key}
                type="number"
                defaultValue={(player.stats as any)?.[s.key] ?? ""}
                placeholder={s.label}
                className="border rounded p-2"
              />
            ))}
          </div>
        </section>

        <button type="submit" className="bg-black text-white rounded p-2">
          更新する
        </button>
      </form>
    </main>
  );
}