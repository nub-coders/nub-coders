interface ScrollRevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
}

export default function ScrollRevealText({ 
  text, 
  className = "", 
  delay = 0,
  staggerDelay = 0.05,
  once = true 
}: ScrollRevealTextProps) {
  void delay;
  void staggerDelay;
  void once;

  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, wordIndex) => {
        return (
          <span
            key={wordIndex}
            className="inline-block whitespace-nowrap mr-[0.25em]"
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}
