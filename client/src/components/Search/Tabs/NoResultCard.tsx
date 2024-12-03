import { Ghost } from "lucide-react";

const NoResultsComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-lg shadow-md">
      <Ghost className="w-24 h-24 text-gray-400 mb-4" />
      <p className="text-xl text-gray-200 text-center">
        Looks like your search results pulled a Houdini – they've vanished into
        thin air!
      </p>
    </div>
  );
};

export default NoResultsComponent;
