import { deleteUserAccount } from "../../api-client"; // Adjust the path as needed

const AccountSettings = () => {
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      await deleteUserAccount();
      // Optionally, redirect the user to a different page after deletion
      window.location.href = "/login"; // Adjust as needed
    }
  };

  return (
    <div>
      <h2>Account Settings</h2>
      <button onClick={handleDeleteAccount} className="btn-delete">
        Delete Account
      </button>
    </div>
  );
};

export default AccountSettings;
