import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function Register() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Success", type: "SUCCESS" });
      await queryClient.invalidateQueries("validate-token");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  const buttonStyles = `w-full py-2 rounded-md ${
    isSubmitting
      ? "bg-gray-400 text-white"
      : "bg-teal-600 text-white shadow-md hover:bg-teal-700 transition-transform transform hover:scale-105"
  }`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <form className="space-y-4" onSubmit={onSubmit}>
          <h2 className="text-3xl font-bold text-center text-teal-600">
            Register
          </h2>

          <label className="block">
            <span className="text-slate-600">First Name</span>
            <input
              type="text"
              className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              {...register("firstName", { required: "This field is required" })}
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm">
                {errors.firstName.message}
              </span>
            )}
          </label>

          <label className="block">
            <span className="text-slate-600">Last Name</span>
            <input
              type="text"
              className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              {...register("lastName", { required: "This field is required" })}
            />
            {errors.lastName && (
              <span className="text-red-500 text-sm">
                {errors.lastName.message}
              </span>
            )}
          </label>

          <label className="block">
            <span className="text-slate-600">Email</span>
            <input
              type="email"
              className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              {...register("email", { required: "This field is required" })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </label>

          <label className="block">
            <span className="text-slate-600">Password</span>
            <input
              type="password"
              className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </label>

          <label className="block">
            <span className="text-slate-600">Confirm Password</span>
            <input
              type="password"
              className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              {...register("confirmPassword", {
                validate: (value) => {
                  if (!value) return "This field is required";
                  if (watch("password") !== value)
                    return "Passwords do not match";
                },
              })}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className={buttonStyles}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
