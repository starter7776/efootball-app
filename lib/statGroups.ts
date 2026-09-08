export const offenseStats = [
  { key: "offensiveAwareness", label: "オフェンスセンス" },
  { key: "ballControl", label: "ボールコントロール" },
  { key: "dribbling", label: "ドリブル" },
  { key: "tightPossession", label: "ボールキープ" },
  { key: "lowPass", label: "グラウンダーパス" },
  { key: "loftedPass", label: "フライパス" },
  { key: "finishing", label: "決定力" },
  { key: "heading", label: "ヘディング" },
  { key: "setPieceTaking", label: "プレースキック" },
  { key: "curl", label: "カーブ" },
] as const;

export const defenseStats = [
  { key: "defensiveAwareness", label: "ディフェンスセンス" },
  { key: "defensiveEngagement", label: "守備意識" },
  { key: "ballWinning", label: "ボール奪取" },
  { key: "aggressiveness", label: "アグレッシブネス" },
] as const;

export const physicalStats = [
  { key: "speed", label: "スピード" },
  { key: "acceleration", label: "瞬発力" },
  { key: "kickingPower", label: "キック力" },
  { key: "jump", label: "ジャンプ" },
  { key: "physicalContact", label: "フィジカルコンタクト" },
  { key: "bodyControl", label: "ボディバランス" },
  { key: "stamina", label: "スタミナ" },
] as const;

export const gkStats = [
  { key: "goalkeeping", label: "GKセンス" },
  { key: "catching", label: "キャッチング" },
  { key: "clearing", label: "クリアリング" },
  { key: "collapsing", label: "コラプシング" },
  { key: "deflecting", label: "ディフレクティング" },
] as const;