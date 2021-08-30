import { useState } from "react";
import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import toast, { Toaster } from "react-hot-toast";

import PFLoader from "./../components/PFLoader";

const toastStyles = {
  fontSize: "2rem",
  fontWeight: "600",
  backgroundColor: "#212529",
  color: "#fff",
};

function Account() {
  const [open, setOpen] = useState(false);

  const { user, isLoading } = useUser();

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const deleteAccount = async () => {
    toast.loading("Deleting...", {
      id: "delete",
      style: toastStyles,
    });
    try {
      const urls = ["/api/deleteData", "/api/deleteAccount"];
      const res = await Promise.all(urls.map((url) => fetch(url)));
      const status = res.every((r) => r.ok === true);
      console.log(status);
      if (!status) {
        toast.remove("delete");
        toast.error("Something went wrong", { style: toastStyles });
        onCloseModal();
        return;
      }

      toast.remove("delete");
      toast.success("Account Deleted", { style: toastStyles });
      onCloseModal();

      if (typeof window !== "undefined") {
        window.location.href = "/api/auth/logout";
      }
    } catch (err) {
      toast.remove("delete");
      toast.error(err.message, { style: toastStyles });
    }
  };

  if (isLoading) {
    return <PFLoader />;
  }

  console.log(user);
  return (
    <div className="account">
      <h1 className="account__heading">Hello, {user?.nickname}</h1>
      <div className="account__details">
        <img
          src={user?.picture}
          alt="Profile Pic"
          className="account__details-avatar"
          width="60"
          height="60"
        />
        <p className="account__details-username u-ml1-5">{user?.nickname}</p>
      </div>
      <div className="account__delete">
        <button className="account__delete-btn" onClick={onOpenModal}>
          Delete Account
        </button>
      </div>

      <Modal
        open={open}
        onClose={onCloseModal}
        center
        styles={{
          overlay: {
            background: "rgba(0,0,0,0.7)",
          },
          modal: {
            backgroundColor: "#212529",
            color: "#fff",
            maxWidth: "500px",
            borderRadius: "5px",
            padding: "4rem",
          },
          closeIcon: {
            display: "none",
          },
        }}
      >
        <div className="confirm__modal">
          <h1 className="confirm__modal-heading">Delete Account</h1>
          <p className="confirm__modal-text">
            All your data will be deleted. This action cannot be undone. Are you
            sure ?
          </p>
          <button className="confirm__modal-btn" onClick={onCloseModal}>
            Cancel
          </button>
          <button className="confirm__modal-btn" onClick={deleteAccount}>
            Delete
          </button>
        </div>
      </Modal>

      <Toaster position="bottom-center" />
    </div>
  );
}

export default Account;

export const getServerSideProps = withPageAuthRequired();
