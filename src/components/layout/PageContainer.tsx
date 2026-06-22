export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full px-4 md:px-6 lg:px-8">
      {children}
    </div>
  );
}
