type PlayerCardProps = {
  name: string;
  team: string;
  position: string;
  rating: number;
};

export default function PlayerCard({ name, team, position, rating }: PlayerCardProps) {
  return (
    <div className="rounded-xl bg-gray-100 p-4 text-center">
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-500">
        {position}・{team}
      </p>
      <p className="text-xl font-bold mt-2">{rating}</p>
    </div>
  );
}