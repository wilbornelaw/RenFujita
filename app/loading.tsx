export default function RootLoading() {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/5"
        />
      ))}
    </div>
  );
}
