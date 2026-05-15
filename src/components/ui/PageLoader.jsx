const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-surface border-t-brand rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-brand uppercase tracking-[0.2em] animate-pulse">
          Loading Ziggy...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
