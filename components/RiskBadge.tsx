import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '' }) => {
  const getStyles = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.CRITICAL:
        return 'bg-red-500/10 text-red-500 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
      case RiskLevel.HIGH:
        return 'bg-orange-500/10 text-orange-500 border-orange-500/50';
      case RiskLevel.MEDIUM:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50';
      case RiskLevel.LOW:
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50';
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/50';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${getStyles(level)} ${className}`}>
      {level}
    </span>
  );
};

export default RiskBadge;