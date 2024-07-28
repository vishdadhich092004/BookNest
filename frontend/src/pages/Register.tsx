import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function Register() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<RegisterFormData>();
  const buttonStyles = isSubmitted
    ? "w-full bg-gray-400 text-white py-2 rounded-md"
    : "w-full bg-indigo-600 text-white py-2 rounded-md shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105";

  const mutation = useMutation(apiClient.register, {
    onSuccess: () => {
      showToast({
        message: "Registration Success",
        type: "SUCCESS",
      });
      navigate("/");
    },
    onError: () => {
      showToast({ message: "Registration Failed", type: "ERROR" });
    },
  });
  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <form className="space-y-4" onSubmit={onSubmit}>
          <h2 className="text-3xl font-bold text-center text-indigo-600">
            Register
          </h2>
          <label className="block">
            <span className="text-gray-700">First Name</span>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              {...register("firstName", { required: "This field is required" })}
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm">
                {errors.firstName.message}
              </span>
            )}
          </label>
          <label className="block">
            <span className="text-gray-700">Last Name</span>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              {...register("lastName", { required: "This field is required" })}
            />
            {errors.lastName && (
              <span className="text-red-500 text-sm">
                {errors.lastName.message}
              </span>
            )}
          </label>
          <label className="block">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              {...register("email", { required: "This field is required" })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </label>
          <label className="block">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 6,
                  message: "Password must be greater than 6 characters",
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
            <span className="text-gray-700">Confirm Password</span>
            <input
              type="password"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              {...register("confirmPassword", {
                validate: (val) => {
                  if (!val) return "This field is required";
                  else if (watch("password") !== val)
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

          <button type="submit" disabled={isSubmitted} className={buttonStyles}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
