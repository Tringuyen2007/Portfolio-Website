/** Pixelify section title used by every homepage section. */
export function SectionHeading({
  title,
  children,
  as: Heading = "h2",
}: {
  title: string;
  children?: React.ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="space-y-5">
      <Heading className="max-w-3xl font-heading text-4xl font-bold leading-[1.05] text-text-primary sm:text-5xl">
        {title}
      </Heading>
      {children}
    </div>
  );
}
