import { ReactNode } from 'react';

export const seasonIcons: Record<string, string> = {
  Літо: '☀️',
  Зима: '❄️',
  Всесезон: '♻️',
};

export const conditionIcons: Record<string, string> = {
  Нова: '✅',
  'Б/у': '🔁',
};

export const badgeColors: Record<string, string> = {
  Нова: 'bg-green-100 text-green-800',
  'Б/у': 'bg-yellow-100 text-yellow-800',
  Літо: 'bg-orange-100 text-orange-800',
  Зима: 'bg-blue-100 text-blue-800',
  Всесезон: 'bg-purple-100 text-purple-800',
  expired: 'bg-red-200 text-red-800',
};

interface BadgeProps {
  label: string;
  icon?: string;
  children?: ReactNode;
}

export const Badge = ({ label, icon, children }: BadgeProps) => (
  <span
    className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 select-none ${
      badgeColors[label] || 'bg-gray-100 text-gray-800'
      }`}
  >
    {icon && <span aria-hidden="true">{icon}</span>}

    {children}
    
    {label}
  </span>
);
