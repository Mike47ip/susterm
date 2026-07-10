// FILE LOCATION: src/components/landing/HeroPhoto.tsx (replaces existing file)

export default function HeroPhoto() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      {/* scrim: only strong over the text (left), stays light over the rest of the photo,
          and softly blends into the page background at the very top/bottom edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--background) 82%, transparent) 0%, color-mix(in srgb, var(--background) 48%, transparent) 38%, color-mix(in srgb, var(--background) 10%, transparent) 66%, transparent 100%), linear-gradient(180deg, color-mix(in srgb, var(--background) 20%, transparent) 0%, transparent 20%, transparent 80%, color-mix(in srgb, var(--background) 35%, transparent) 100%)",
        }}
      />
    </div>
  );
}