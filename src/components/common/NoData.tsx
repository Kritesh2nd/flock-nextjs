const NoDataCard = ({ message }: { message: string }) => {
  return (
    <div className="h-96 2xl:h-140">
      <p className="text-xs 2xl:text-xl text-gray-400 justify-center flex items-center h-full">
        {message}
      </p>
    </div>
  );
};

export default NoDataCard;
