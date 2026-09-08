import prisma from "@/lib/prisma";
import TrainingSimulator from "@/components/TrainingSimulator";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TrainPage({ params }: Props) {
  const { id } = await params;
  const player = await prisma.player.findUnique({
    where: { id },
    include: { stats: true },
  });

  if (!player) {
    return <main className="p-8">選手が見つかりませんでした。</main>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">{player.name} の育成シミュレーション</h1>
      <TrainingSimulator
        playerId={player.id}
        currentPoints={player.currentPoints ?? 60}
        baseStats={player.stats}
      />
    </main>
  );
}