import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit } from "lucide-react";
import DeleteButton from "./Buttons/DeleteButton";

interface EllipsisMenuProps {
  onEdit: () => void;
  id: string; // ID of the item to delete
  toBeDeleted: string; // Type of the item to delete, e.g., "discussions"
}

const EllipsisMenu: React.FC<EllipsisMenuProps> = ({
  onEdit,
  id,
  toBeDeleted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="inline-flex items-center justify-center w-8 h-8"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>

          <DeleteButton id={id} toBeDeleted={toBeDeleted} />
        </div>
      )}
    </div>
  );
};

export default EllipsisMenu;
