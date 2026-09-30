import { PackageX } from 'lucide-react';

// Displayed when a list is empty (e.g., no products found)
const EmptyState = ({
  title = 'No items found',
  description = 'There are no items to display.',
  action,
  icon: Icon = PackageX,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
        <Icon size={28} className="text-primary/50" />
      </div>
      <h3 className="text-base font-semibold text-main-text mb-1">{title}</h3>
      <p className="text-sm text-secondary-text max-w-sm leading-relaxed mb-6">{description}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;
