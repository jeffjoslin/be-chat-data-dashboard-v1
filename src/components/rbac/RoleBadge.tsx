import { getRoleLabel, getRoleColor } from '@/lib/permissions';

interface RoleBadgeProps {
  role: string;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = '' }) => {
  const label = getRoleLabel(role);
  const colorClasses = getRoleColor(role);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses} ${className}`}>
      {label}
    </span>
  );
};