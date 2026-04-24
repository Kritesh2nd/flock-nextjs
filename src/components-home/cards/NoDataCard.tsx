const NoDataCard = ({
  message,
  className,
}: {
  message: string;
  className: string;
}) => {
  return (
    <div className={`${className}`}>
      <p className="text-sm text-gray-400 justify-center flex items-center h-full">
        {message}
      </p>
    </div>
  );
};

export default NoDataCard;
