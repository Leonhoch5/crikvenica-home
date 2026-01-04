type FooterProps = {
  copyright: string;
  disclaimer: string;
};

export function Footer({ copyright, disclaimer }: FooterProps) {
  return (
    <footer className="border-t border-foreground/10">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-foreground/70">{copyright}</p>
          <p className="text-sm text-foreground/60">{disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
