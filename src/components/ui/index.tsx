import { cn } from '@/lib/utils';
import { SessionStatus, Role } from '@/types';
import { statusColors, roleColors, getInitials } from '@/lib/utils';

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-ink-800/60 border border-ink-700/60 rounded-2xl backdrop-blur-sm',
        hover && 'cursor-pointer hover:border-ink-600 hover:bg-ink-700/60 transition-all duration-200 hover:shadow-card-hover',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'status' | 'role';
  status?: SessionStatus;
  role?: Role;
  className?: string;
}

export function Badge({ children, status, role, className }: BadgeProps) {
  const colors = status
    ? statusColors[status]
    : role
    ? roleColors[role]
    : { bg: 'bg-ink-700', text: 'text-ink-300', dot: 'bg-ink-400' };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium',
        colors.bg,
        colors.text,
        className,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
      {children}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name);
  // Generate a consistent color from name
  const colors = [
    'from-accent-500 to-accent-700',
    'from-sage-500 to-sage-700',
    'from-rose-500 to-rose-700',
    'from-amber-500 to-amber-600',
    'from-sky-500 to-sky-700',
    'from-purple-500 to-purple-700',
  ];
  const colorIdx = name.charCodeAt(0) % colors.length;
  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br flex items-center justify-center font-display font-bold text-white shrink-0',
        avatarSizes[size],
        `bg-gradient-to-br ${colors[colorIdx]}`,
        className,
      )}
    >
      {initials}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-ink-700 via-ink-600 to-ink-700 bg-[length:1000px_100%] rounded-lg',
        className,
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-ink-800/60 border border-ink-700/60 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      {icon && (
        <div className="w-16 h-16 bg-ink-800 rounded-2xl flex items-center justify-center text-ink-500">
          {icon}
        </div>
      )}
      <div>
        <p className="text-ink-200 font-semibold font-display text-lg">{title}</p>
        {description && <p className="text-ink-500 text-sm mt-1 max-w-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-300">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-2.5 text-sm text-ink-100',
          'placeholder:text-ink-500 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30',
          'transition-all duration-200 resize-none',
          error && 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-300">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          'w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-2.5 text-sm text-ink-100',
          'focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30',
          'transition-all duration-200',
          error && 'border-rose-500/60',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-ink-800">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full bg-ink-800 border border-ink-700 rounded-3xl shadow-2xl z-10 animate-fade-up',
          modalSizes[size],
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-ink-700">
            <h3 className="font-display font-bold text-lg text-ink-100">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-ink-700 flex items-center justify-center text-ink-400 hover:text-ink-200 transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  color?: 'accent' | 'sage' | 'amber' | 'rose';
  className?: string;
}

const statColors = {
  accent: { icon: 'text-accent-400 bg-accent-500/10', border: 'border-accent-500/20' },
  sage: { icon: 'text-sage-400 bg-sage-500/10', border: 'border-sage-500/20' },
  amber: { icon: 'text-amber-400 bg-amber-500/10', border: 'border-amber-500/20' },
  rose: { icon: 'text-rose-400 bg-rose-500/10', border: 'border-rose-500/20' },
};

export function StatCard({ label, value, icon, change, color = 'accent', className }: StatCardProps) {
  const c = statColors[color];
  return (
    <Card className={cn('p-5', c.border, className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-ink-500 font-medium uppercase tracking-wider mb-1">{label}</p>
          <p className="font-display font-bold text-3xl text-ink-100">{value}</p>
          {change && <p className="text-xs text-ink-500 mt-1">{change}</p>}
        </div>
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', c.icon)}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
