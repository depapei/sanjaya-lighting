const Loading = () => {
  return (
    <div className="flex items-center justify-center gap-3 p-12 h-[80vh]">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 animate-pulse">Loading Data...</p>
    </div>
  );
};

export default Loading;
