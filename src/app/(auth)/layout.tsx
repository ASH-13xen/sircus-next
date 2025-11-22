export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // This container takes the full screen height and centers children
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      {children}
    </div>
  );
}
