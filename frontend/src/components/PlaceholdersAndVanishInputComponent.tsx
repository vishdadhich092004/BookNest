import { PlaceholdersAndVanishInput } from "./aceternity-ui/placeholders-and-vanish-input";

function PlaceholdersAndVanishInputComponent() {
  const placeholders = [
    "What's the best mystery novel of the decade?",
    "Who wrote 'The Catcher in the Rye'?",
    "What are the top must-read fantasy books?",
    "Write a review for 'To Kill a Mockingbird'",
    "How do I organize my bookshelf?",
    "What are the best book-to-movie adaptations?",
    "Where can I find rare first edition books?",
    "Which book should I read next?",
    "What is the longest book ever written?",
    "How do I start a book club?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="flex flex-col items-center mt-8 px-4">
      <h1 className="font-bold text-white text-3xl mb-6 text-center">
        Search Any Sh*t About Books.
      </h1>
      <PlaceholdersAndVanishInput
        className="w-full max-w-md"
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default PlaceholdersAndVanishInputComponent;
