// app/dashboard/admin/add-product/_components/Toggle.tsx

type Props = {
  checked: boolean;
  onChange: () => void;
  label: string;
  sub?: string;
};

const Toggle = ({ checked, onChange, label, sub }: Props) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div
      onClick={onChange}
      className={`w-10 h-5 rounded-full transition-colors duration-200 relative shrink-0
                  ${checked ? "bg-teal-500" : "bg-gray-200 dark:bg-gray-700"}`}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow
                    transition-transform duration-200
                    ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </p>
      {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
    </div>
  </label>
);

export default Toggle;
