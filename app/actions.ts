"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createPlayer(formData: FormData) {
  const name = formData.get("name") as string;
  const team = formData.get("team") as string;
  const position = formData.get("position") as string;
  const rating = Number(formData.get("rating"));

  const nationality = (formData.get("nationality") as string) || null;
  const preferredFoot = (formData.get("preferredFoot") as string) || null;
  const height = toNumberOrNull(formData.get("height"));
  const weight = toNumberOrNull(formData.get("weight"));
  const age = toNumberOrNull(formData.get("age"));
  const weakFootAccuracy = toNumberOrNull(formData.get("weakFootAccuracy"));
  const weakFootFrequency = toNumberOrNull(formData.get("weakFootFrequency"));
  const currentLevel = toNumberOrNull(formData.get("currentLevel"));
  const levelCap = toNumberOrNull(formData.get("levelCap"));
  const currentPoints = toNumberOrNull(formData.get("currentPoints"));

  const player = await prisma.player.create({
    data: {
      name,
      team,
      position,
      rating,
      nationality,
      preferredFoot,
      height,
      weight,
      age,
      weakFootAccuracy,
      weakFootFrequency,
      currentLevel,
      levelCap,
      currentPoints,
    },
  });

  const highPositions = formData.getAll("highPositions") as string[];
  for (const positionId of highPositions) {
    await prisma.playerPosition.create({
      data: { playerId: player.id, positionId, adequacy: "濃い" },
    });
  }

  const lowPositions = formData.getAll("lowPositions") as string[];
  for (const positionId of lowPositions) {
    await prisma.playerPosition.create({
      data: { playerId: player.id, positionId, adequacy: "薄い" },
    });
  }

  const skillIds = formData.getAll("skills") as string[];
  for (const skillId of skillIds) {
    await prisma.playerSkill.create({
      data: { playerId: player.id, skillId },
    });
  }

  const statKeys = [
    "offensiveAwareness", "ballControl", "dribbling", "tightPossession",
    "lowPass", "loftedPass", "finishing", "heading", "setPieceTaking", "curl",
    "defensiveAwareness", "defensiveEngagement", "ballWinning", "aggressiveness",
    "speed", "acceleration", "kickingPower", "jump", "physicalContact",
    "bodyControl", "stamina",
    "goalkeeping", "catching", "clearing", "collapsing", "deflecting",
  ];
  const statsData: Record<string, number> = {};
  statKeys.forEach((key) => {
    const value = toNumberOrNull(formData.get(key));
    if (value !== null) statsData[key] = value;
  });
  if (Object.keys(statsData).length > 0) {
    await prisma.playerStats.create({
      data: { playerId: player.id, ...statsData },
    });
  }

  redirect("/");
}

function toNumberOrNull(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}
import { trainingCategories } from "@/lib/trainingCategories";
import { tpCostForPoints } from "@/lib/trainingCost";

export async function saveTraining(
  playerId: string,
  points: Record<string, number>
) {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: { stats: true },
  });
  if (!player) throw new Error("選手が見つかりません");

  const totalUsed = trainingCategories.reduce(
    (sum, c) => sum + tpCostForPoints(points[c.id] ?? 0),
    0
  );

  const statIncrements: Record<string, number> = {};
  trainingCategories.forEach((c) => {
    c.stats.forEach((statKey) => {
      statIncrements[statKey] =
        (statIncrements[statKey] ?? 0) + (points[c.id] ?? 0);
    });
  });

  const currentStats = (player.stats ?? {}) as Record<string, number | null>;
  const resultingStats: Record<string, number> = {};
  const statsData: Record<string, number> = {};

  Object.entries(statIncrements).forEach(([statKey, added]) => {
    if (added <= 0) return;
    const before = Number(currentStats[statKey] ?? 0);
    const after = Math.min(before + added, 99);
    resultingStats[statKey] = after;
    statsData[statKey] = after;
  });

  await prisma.playerStats.upsert({
    where: { playerId },
    update: statsData,
    create: { playerId, ...statsData },
  });

  const baselinePoints = player.currentPoints ?? 60;
  await prisma.player.update({
    where: { id: playerId },
    data: { currentPoints: baselinePoints - totalUsed },
  });

  await prisma.trainingLog.create({
    data: {
      playerId,
      simulationName: `育成シミュレーション ${new Date().toLocaleString("ja-JP")}`,
      allocatedPoints: points,
      resultingStats,
    },
  });

  redirect(`/players/${playerId}`);
}

export async function deletePlayer(playerId: string) {
  await prisma.playerPosition.deleteMany({ where: { playerId } });
  await prisma.playerSkill.deleteMany({ where: { playerId } });
  await prisma.playerBooster.deleteMany({ where: { playerId } });
  await prisma.trainingLog.deleteMany({ where: { playerId } });
  await prisma.playerStats.deleteMany({ where: { playerId } });
  await prisma.player.delete({ where: { id: playerId } });

  redirect("/");
}

export async function updatePlayer(playerId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const team = formData.get("team") as string;
  const position = formData.get("position") as string;
  const rating = Number(formData.get("rating"));

  const nationality = (formData.get("nationality") as string) || null;
  const preferredFoot = (formData.get("preferredFoot") as string) || null;
  const height = toNumberOrNull(formData.get("height"));
  const weight = toNumberOrNull(formData.get("weight"));
  const age = toNumberOrNull(formData.get("age"));
  const weakFootAccuracy = toNumberOrNull(formData.get("weakFootAccuracy"));
  const weakFootFrequency = toNumberOrNull(formData.get("weakFootFrequency"));
  const currentLevel = toNumberOrNull(formData.get("currentLevel"));
  const levelCap = toNumberOrNull(formData.get("levelCap"));
  const currentPoints = toNumberOrNull(formData.get("currentPoints"));
  const managerId = (formData.get("managerId") as string) || null;

  await prisma.player.update({
    where: { id: playerId },
    data: {
      name,
      team,
      position,
      rating,
      nationality,
      preferredFoot,
      height,
      weight,
      age,
      weakFootAccuracy,
      weakFootFrequency,
      currentLevel,
      levelCap,
      currentPoints,
      managerId,
    },
  });

  await prisma.playerPosition.deleteMany({ where: { playerId } });
  const highPositions = formData.getAll("highPositions") as string[];
  for (const positionId of highPositions) {
    await prisma.playerPosition.create({
      data: { playerId, positionId, adequacy: "濃い" },
    });
  }
  const lowPositions = formData.getAll("lowPositions") as string[];
  for (const positionId of lowPositions) {
    await prisma.playerPosition.create({
      data: { playerId, positionId, adequacy: "薄い" },
    });
  }

  await prisma.playerSkill.deleteMany({ where: { playerId } });
  const skillIds = formData.getAll("skills") as string[];
  for (const skillId of skillIds) {
    await prisma.playerSkill.create({ data: { playerId, skillId } });
  }

  const statKeys = [
    "offensiveAwareness", "ballControl", "dribbling", "tightPossession",
    "lowPass", "loftedPass", "finishing", "heading", "setPieceTaking", "curl",
    "defensiveAwareness", "defensiveEngagement", "ballWinning", "aggressiveness",
    "speed", "acceleration", "kickingPower", "jump", "physicalContact",
    "bodyControl", "stamina",
    "goalkeeping", "catching", "clearing", "collapsing", "deflecting",
  ];
  const statsData: Record<string, number> = {};
  statKeys.forEach((key) => {
    const value = toNumberOrNull(formData.get(key));
    if (value !== null) statsData[key] = value;
  });
  if (Object.keys(statsData).length > 0) {
    await prisma.playerStats.upsert({
      where: { playerId },
      update: statsData,
      create: { playerId, ...statsData },
    });
  }

  redirect(`/players/${playerId}`);
}