import { InfiniteMovingCards } from "../aceternity-ui/infinite-moving-cards";
function InfiniteMovingCardsComponent() {
  return (
    <>
      <div className="pb-20 rounded-md flex flex-col antialiased bg-black dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
        <InfiniteMovingCards items={bookFacts} direction="right" speed="slow" />
      </div>
    </>
  );
}

const bookFacts = [
  {
    id: 1,
    title: "Longest Novel",
    fact: "The longest novel ever published is 'A la recherche du temps perdu' by Marcel Proust, with 9,609,000 characters (including spaces).",
  },
  {
    id: 2,
    title: "First Printed Book",
    fact: "The first book ever printed using movable type was the Gutenberg Bible in 1455.",
  },
  {
    id: 3,
    title: "Most Expensive Book",
    fact: "The most expensive book ever sold was Leonardo da Vinci's Codex Leicester, purchased by Bill Gates for $30.8 million in 1994.",
  },
  {
    id: 4,
    title: "Smallest Book",
    fact: "The smallest book in the world is 'Teeny Ted from Turnip Town,' measuring just 70 micrometers by 100 micrometers.",
  },
  {
    id: 5,
    title: "Oxford English Dictionary",
    fact: "The Oxford English Dictionary contains over 170,000 words in current use.",
  },
  {
    id: 6,
    title: "First Known Author",
    fact: "The first known author in history was Enheduanna, a Sumerian priestess who lived around 2300 BCE.",
  },
  {
    id: 7,
    title: "Largest Library",
    fact: "The world's largest library is the Library of Congress, with more than 170 million items.",
  },
  {
    id: 8,
    title: "Harry Potter Translations",
    fact: "J.K. Rowling's Harry Potter series has been translated into over 80 languages.",
  },
  {
    id: 9,
    title: "Oldest Known Library",
    fact: "The world's oldest known library was founded circa 300 BCE in Alexandria, Egypt.",
  },
  {
    id: 10,
    title: "Tsundoku",
    fact: "Tsundoku is a Japanese word that means buying books and letting them pile up unread.",
  },
  {
    id: 11,
    title: "Longest Sentence",
    fact: "The longest sentence ever printed in literature is 823 words long, in Victor Hugo's 'Les Misérables'.",
  },
  {
    id: 12,
    title: "First Typewritten Novel",
    fact: "The first novel believed to have been written on a typewriter is Mark Twain's 'The Adventures of Tom Sawyer'.",
  },
  {
    id: 13,
    title: "Etymology of 'Book'",
    fact: "The word 'book' comes from the Old English 'bōc,' which is related to the word 'beech,' as early books were written on beech wood tablets.",
  },
  {
    id: 14,
    title: "E-book Origins",
    fact: "E-books can be traced back to 1971 when Michael S. Hart launched Project Gutenberg, digitizing public domain texts.",
  },
  {
    id: 15,
    title: "Great Book Robbery",
    fact: "The 'Great Book Robbery' occurred in 1948, where approximately 70,000 Palestinian books were taken and many integrated into Israel's National Library.",
  },
];

export default InfiniteMovingCardsComponent;
