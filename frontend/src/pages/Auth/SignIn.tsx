import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa"; // Import Google icon from react-icons

export type SignInFormData = {
  email: string;
  password: string;
};

function SignIn() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({
        message: "Sign in Successful",
        type: "SUCCESS",
      });
      await queryClient.invalidateQueries("validate-token");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({
        message: error.message,
        type: "ERROR",
      });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  const handleGoogleAuth = () => {
    apiClient.initiateGoogleAuth();
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
        {/* Left side image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1529158062015-cad636e205a0?q=80&w=1953&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Sign In"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right side form */}
        <div className="flex-1 p-8 md:p-12 bg-gray-100">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Sign In</h2>
          <form className="space-y-6" onSubmit={onSubmit}>
            <label className="block">
              <span className="text-gray-700 text-sm font-semibold">Email</span>
              <input
                type="email"
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500"
                {...register("email", { required: "This field is required" })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </label>

            <label className="block">
              <span className="text-gray-700 text-sm font-semibold">
                Password
              </span>
              <input
                type="password"
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500"
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

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Not Registered?{" "}
                <Link className="underline text-teal-600" to="/register">
                  Create an account
                </Link>
              </span>

              <button
                type="submit"
                className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-300"
              >
                Login
              </button>
            </div>
          </form>

          {/* Google Sign In Button */}
          <div className="mt-8">
            <button
              onClick={handleGoogleAuth}
              className="flex items-center justify-center w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
              <FaGoogle className="mr-2" />
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
