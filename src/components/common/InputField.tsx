import { InputField } from "@/types";

const InputCard = ({
  name,
  title,
  onChange,
  type,
  placeholder,
  value,
  disabled,
  error,
  className,
  rightIcon,
}: InputField & { error?: string; rightIcon?: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-primary text-base tracking-wide">{title}</label>

      <div className="relative w-full">
        <input
          name={name}
          onChange={onChange}
          value={value}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`bg-white w-full text-primary rounded-md py-2 px-3 pr-10 text-sm shadow-xs border transition duration-200 focus:ring-1 focus:ring-blue-300 ${
            error ? "border-red-500" : "border-border"
          } outline-none ${className}`}
        />

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500">
            {rightIcon}
          </span>
        )}
      </div>

      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default InputCard;
