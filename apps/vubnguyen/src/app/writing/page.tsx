export default function WritingPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-[var(--site-bg)] px-6 pt-24 text-[var(--site-text)]">
      <div className="mx-auto w-full max-w-5xl">
        <p className="font-code mb-8 text-xs uppercase tracking-[0.3em] text-[var(--site-accent)]">Writing</p>
        <h1
          className="font-display font-bold italic leading-none tracking-tight text-[var(--site-text)]"
          style={{ fontSize: "clamp(56px, 10vw, 120px)" }}
        >
          Coming
          <br />
          Soon.
        </h1>
      </div>
    </div>
  );
}
