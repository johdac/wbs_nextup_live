const Footer = () => {
  return (
    <footer className="relative border-t-2 border-primary/30 text-white py-12">
      <div className="absolute inset-0 retro-scanlines" />
      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold tracking-wider text-purple">
              NextUp Live<span className="not-italic ml-1">✦</span>
            </span>
          </div>
          <p className="max-w-md font-body text-sm text-muted-foreground">
            Discover the sound of your city. Find events, preview music, and
            never miss a beat.
          </p>
          <div className="mx-auto h-0.5 w-32 neon-gradient-bg rounded-full opacity-40" />

          <p className="font-body text-xs text-muted-foreground/50">
            © 2026 NextUp Live. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
