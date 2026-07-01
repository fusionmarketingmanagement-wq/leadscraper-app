type BadgeVariant = 'active' | 'paused' | 'draft' | 'success' | 'warning' | 'error' | 'neutral' | 'cyan';

const styles: Record<BadgeVariant, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paused: 'bg-amber-50 text-amber-700 border-amber-200',
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  neutral: 'bg-gray-100 text-gray-600 border-gray-200',
  cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

interface Props {
  label: string;
  variant?: BadgeVariant;
}

export default function StatusBadge({ label, variant = 'neutral' }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}
    >
      {label}
    </span>
  );
}
