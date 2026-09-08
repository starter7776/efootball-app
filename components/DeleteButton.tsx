"use client";

import { deletePlayer } from "@/app/actions";

export default function DeleteButton({ playerId }: { playerId: string }) {
  function handleDelete() {
    if (confirm("この選手を削除します。よろしいですか?")) {
      deletePlayer(playerId);
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-600 underline"
    >
      この選手を削除する
    </button>
  );
}