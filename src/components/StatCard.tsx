interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  accent?: string;
}

export default function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div
      className="rounded-xl border border-[#ebebeb] bg-white p-4"
      style={{ boxShadow: '0px 1px 1px #00000005, 0px 2px 2px #0000000a' }}
    >
      <p className="text-xs text-[#888888] mb-1">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${accent ?? 'text-[#171717]'}`}>{value}</p>
      {sub && <p className="text-xs text-[#a1a1a1] mt-0.5">{sub}</p>}
    </div>
  );
}
