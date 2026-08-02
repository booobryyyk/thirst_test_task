type Props = {
  title?: string;
  description?: string;
};

export function SectionHeader({ title, description }: Props) {
  return (
    <>
      {(title || description) && (
        <div className="border-b px-4 py-5 sm:px-6">
          {title && (
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          )}

          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
    </>
  );
}
