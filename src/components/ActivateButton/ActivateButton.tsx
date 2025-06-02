import { ArrowUpRight } from "lucide-react";

export const ActivateButton = ({
  onActivate,
  disabled,
}: {
  onActivate: () => void;
  disabled: boolean;
}) => (
  <button
    onClick={onActivate}
    className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl transition flex justify-center items-center gap-2 disabled:opacity-60"
    disabled={disabled}
    aria-label="Активувати"
  >
    <ArrowUpRight className="w-4 h-4" />
    
    Активувати
  </button>
);
