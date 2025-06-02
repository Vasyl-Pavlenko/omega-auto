export interface SubmitButtonProps {
  isLoading: boolean;
  isSubmitting?: boolean;
  text: string;
}

const SubmitButton = ({ isLoading, isSubmitting = false, text }: SubmitButtonProps) => {
  const isDisabled = isSubmitting || isLoading;

  return (
    <button
      type="submit"
      aria-label={text}
      disabled={isDisabled}
      className="btn-blue btn-lg w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isDisabled ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Завантаження...
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default SubmitButton;
