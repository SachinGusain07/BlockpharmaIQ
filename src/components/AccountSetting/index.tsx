// AccountManagement.jsx
import { useState } from "react";
import ActionCard from "../ActionCard";
import ConfirmationModal from "../ConfirmationModal";

const AccountSettings = () => {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeactivateAccount = () => {
    console.log("Account deactivated");
    setShowDeactivateModal(false);
  };

  const handleDeleteAccount = () => {
    console.log("Account deleted");
    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <ActionCard
        title="Deactivate Account"
        description="You can deactivate your account at any time. If you change your mind, you are able to re-activate it anytime."
        buttonText="Deactivate account"
        buttonAction={() => setShowDeactivateModal(true)}
        destructive={true}
      />

      <ActionCard
        title="Delete Account"
        description="You can delete your account at any time. If you change your mind, you might not be able to recover it after a certain amount of time."
        buttonText="Delete account"
        buttonAction={() => setShowDeleteModal(true)}
        destructive={true}
      />

      <ConfirmationModal
        isOpen={showDeactivateModal}
        title="Deactivate Account"
        message="Are you sure you want to deactivate your account? You can reactivate it later if you change your mind."
        confirmText="Deactivate"
        onConfirm={handleDeactivateAccount}
        onCancel={() => setShowDeactivateModal(false)}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone after a certain period of time."
        confirmText="Delete"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default AccountSettings;
