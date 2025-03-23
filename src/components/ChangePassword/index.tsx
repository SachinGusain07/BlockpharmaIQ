// ChangePassword.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Watch the newPassword field for validation
  const newPassword = watch("newPassword");

  const onSubmit = async (data: ChangePasswordForm) => {
    setSuccessMessage("");
    setServerError("");
    setIsSubmitting(true);

    try {
      console.log(data);
      setSuccessMessage("Password changed successfully");
      reset();
    } catch (error: unknown) {
      console.error(error);
      setServerError("Failed to change password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>

      {successMessage && (
        <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {serverError && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label htmlFor="oldPassword" className="sr-only">
            Old Password
          </label>
          <input
            id="oldPassword"
            type="password"
            placeholder="Old Password"
            className={`w-full border-b placeholder:text-sm placeholder:font-medium ${
              errors.oldPassword ? "border-red-500" : "border-gray-300"
            } py-2 outline-none focus:border-gray-500`}
            {...register("oldPassword", {
              required: "Current password is required",
            })}
          />
          {errors.oldPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.oldPassword.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="newPassword" className="sr-only">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="New Password"
            className={`w-full border-b placeholder:text-sm placeholder:font-medium ${
              errors.newPassword ? "border-red-500" : "border-gray-300"
            } py-2 outline-none focus:border-gray-500`}
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="mb-8">
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            className={`w-full border-b placeholder:text-sm placeholder:font-medium ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } py-2 outline-none focus:border-gray-500`}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 text-xs font-medium rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
