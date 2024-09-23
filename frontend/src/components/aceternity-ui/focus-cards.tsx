import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utills";

type CardProps = {
  card: {
    _id: string;
    title: string;
    src: string;
  };
  index: number;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
};

export const Card = React.memo(
  ({ card, index, hovered, setHovered }: CardProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate(`/books/${card._id}`);
    };

    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        onClick={handleClick}
        className={cn(
          "rounded-xl relative bg-gray-100 dark:bg-neutral-900 overflow-hidden w-full transition-all duration-300 ease-out cursor-pointer",
          "aspect-[3/4] sm:aspect-[2/3] lg:aspect-[3/4]", // Adjusted aspect ratio for extra large cards
          hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
        )}
      >
        <img
          src={card.src}
          alt={card.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end py-8 px-6 sm:py-10 sm:px-8 transition-opacity duration-300",
            hovered === index ? "opacity-100" : "opacity-75"
          )}
        >
          <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white">
            {card.title}
          </div>
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";

type FocusCardsProps = {
  cards: Array<{
    _id: string;
    title: string;
    src: string;
  }>;
};

export function FocusCards({ cards }: FocusCardsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
        {cards.map((card, index) => (
          <Card
            key={card._id}
            card={card}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
          />
        ))}
      </div>
    </div>
  );
}
