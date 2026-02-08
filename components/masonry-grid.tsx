type Props = {
  children: React.ReactNode;
};

export function MasonryGrid({ children }: Props) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
      {children}
    </div>
  );
}
