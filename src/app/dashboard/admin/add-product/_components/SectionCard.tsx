// app/dashboard/admin/add-product/_components/SectionCard.tsx

type Props = {
  icon: React.ElementType;
  title: string;
  color: string;
  children: React.ReactNode;
};

const SectionCard = ({ icon: Icon, title, color, children }: Props) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}
      >
        <Icon size={14} />
      </div>
      <h2 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">
        {title}
      </h2>
    </div>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

export default SectionCard;
