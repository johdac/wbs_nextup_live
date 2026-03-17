interface AuthShowcaseProps {
  headline: string;
  highlightedText: string;
  description: string;
  leftBadge: string;
  rightBadge: string;
  features: string[];
}

export const AuthShowcase = ({
  headline,
  highlightedText,
  description,
  leftBadge,
  rightBadge,
  features,
}: AuthShowcaseProps) => {
  return (
    <div className="hidden md:flex bg-linear-to-br from-purple-600 via-blue-600 to-purple-700 h-full rounded-lg overflow-hidden items-center justify-center relative p-8">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-6 max-w-md">
        {/* Main Headline */}
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            {headline}
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 via-yellow-400 to-pink-400">
              {highlightedText}
            </span>
          </h2>

          <p className="text-gray-200 text-lg leading-relaxed">{description}</p>
        </div>

        {/* Floating Elements */}
        <div className="relative h-32 flex items-center justify-center">
          {/* Top Left Badge */}
          <div className="absolute top-0 left-0 bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-bold shadow-lg transform -rotate-12">
            {leftBadge}
          </div>

          {/* Bottom Right Badge */}
          <div className="absolute bottom-0 right-0 bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transform rotate-12">
            {rightBadge}
          </div>

          {/* Center Icon */}
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <span className="text-3xl">✦</span>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-3 pt-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 justify-center">
              <div
                className={`w-2 h-2 rounded-full ${
                  index === 0
                    ? "bg-yellow-400"
                    : index === 1
                      ? "bg-pink-400"
                      : "bg-blue-300"
                }`}
              ></div>
              <span className="text-white text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
