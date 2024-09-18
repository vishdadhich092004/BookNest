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
    <PlaceholdersAndVanishInput
      className="lg:mt-0 mt-10"
      placeholders={placeholders}
      onChange={handleChange}
      onSubmit={onSubmit}
    />
  );
}
export default PlaceholdersAndVanishInputComponent;
