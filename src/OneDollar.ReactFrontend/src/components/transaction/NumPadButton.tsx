// Implementation of a single NumPad key
interface NumPadButtonProps {
  value: string | React.ReactNode;
  onPress?: () => void;
  ariaLabel?: string;
}

export function NumPadButton({ value, onPress, ariaLabel }: NumPadButtonProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={ariaLabel}
      className="bg-neutral-200 rounded-3xl h-12 grid place-items-center hover:bg-neutral-300 active:scale-[0.95] transition-transform focus:outline-none focus:ring-2 focus:ring-neutral-400">
      {value}
    </button>
  );
} 