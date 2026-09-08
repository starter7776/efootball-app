"use client";

import { useState, useTransition } from "react";
import { trainingCategories, statLabels } from "@/lib/trainingCategories";
import { tpCostForPoints } from "@/lib/trainingCost";
import { saveTraining } from "@/app/actions";

type Props = {
  playerId: string;
  currentPoints: number;
  baseStats: Record<string, any> | null;
};

export default function TrainingSimulator({
  playerId,
  currentPoints,
  baseStats,
}: Props) {
  const [points, setPoints] = useState<Record<string, number>>(
    Object.fromEntries(trainingCategories.map((c) => [c.id, 0]))
  );
  const [isPending, startTransition] = useTransition();

  const totalUsed = trainingCategories.reduce(
    (sum, c) => sum + tpCostForPoints(points[c.id]),
    0
  );
  const remaining = currentPoints - totalUsed;

  function changePoint(categoryId: string, delta: number) {
    const next = points[categoryId] + delta;
    if (next < 0) return;
    const nextPoints = { ...points, [categoryId]: next };
    const nextUsed = trainingCategories.reduce(
      (sum, c) => sum + tpCostForPoints(nextPoints[c.id]),
      0
    );
    if (nextUsed > currentPoints) return;
    setPoints(nextPoints);
  }

  function resetAll() {
    setPoints(Object.fromEntries(trainingCategories.map((c) => [c.id, 0])));
  }

  function handleSave() {
    startTransition(async () => {
      await saveTraining(playerId, points);
    });
  }

  const statTotals: Record<string, number> = {};
  trainingCategories.forEach((c) => {
    c.stats.forEach((statKey) => {
      statTotals[statKey] = (statTotals[statKey] ?? 0) + points[c.id];
    });
  });

  const changedStats = Object.entries(statTotals)
    .filter(([, added]) => added > 0)
    .map(([statKey, added]) => {
      const before = Number(baseStats?.[statKey] ?? 0);
      const after = Math.min(before + added, 99);
      return { key: statKey, before, after };
    });

  return (
    <div>
      <div className="flex justify-between items-center mb-6 bg-gray-100 rounded p-4">
        <span className="text-sm text-gray-500">残りTP</span>
        <span className="text-2xl font-bold">{remaining}</span>
      </div>

      <div className="mb-6">
        {trainingCategories.map((c) => (
          <div key={c.id} className="flex items-center justify-between py-3 border-t">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-xs text-gray-500">
                {c.stats.map((s) => statLabels[s]).join("・")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => changePoint(c.id, -1)} className="w-8 h-8 border rounded">
                −
              </button>
              <span className="w-6 text-center font-semibold">{points[c.id]}</span>
              <button onClick={() => changePoint(c.id, 1)} className="w-8 h-8 border rounded">
                ＋
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button onClick={resetAll} className="text-sm underline">
          リセット
        </button>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="ml-auto bg-black text-white rounded px-4 py-2 text-sm"
        >
          {isPending ? "保存中..." : "結果を保存"}
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-2">変化するステータス</h2>
      {changedStats.length === 0 ? (
        <p className="text-sm text-gray-400">まだポイントを振っていません。</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {changedStats.map((s) => (
            <span key={s.key} className="text-sm bg-gray-100 rounded px-3 py-1">
              {statLabels[s.key]}: {s.before} → {s.after}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}