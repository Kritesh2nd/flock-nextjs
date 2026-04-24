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
}: InputField & { error?: string }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-primary text-base tracking-wide">{title}</label>
      <input
        name={name}
        onChange={onChange}
        value={value}
        type={type}
        placeholder={placeholder}
        className={`bg-white text-primary rounded-md py-2 px-3 text-sm shadow-xs border focus:none focus:ring-1 transition duration-200 focus:ring-blue-300 ${className} ${
          error ? "border-red-500" : "border-border"
        } outline-none`}
        disabled={disabled}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default InputCard;
