// Displays a stat card for the dashboard
const StatCard = ({ title, value, icon: Icon, color = 'primary', description }) => {
  const COLOR_MAP = {
    primary: { bg: 'bg-indigo-50', icon: 'text-primary', value: 'text-primary' },
    success: { bg: 'bg-green-50', icon: 'text-success', value: 'text-success' },
    warning: { bg: 'bg-amber-50', icon: 'text-warning', value: 'text-warning' },
    danger: { bg: 'bg-red-50', icon: 'text-danger', value: 'text-danger' },
  };

  const colors = COLOR_MAP[color] || COLOR_MAP.primary;

  return (
    <div className="card p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-text mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colors.value}`}>{value}</p>
          {description && (
            <p className="text-xs text-secondary-text mt-1">{description}</p>
          )}
        </div>
        <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon size={22} className={colors.icon} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
