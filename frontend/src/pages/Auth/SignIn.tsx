import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

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

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1529158062015-cad636e205a0?q=80&w=1953&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="SignIn"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 p-8">
          <form className="space-y-6" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>

            <label className="block">
              <span className="text-slate-600 text-sm">Email</span>
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
              <span className="text-slate-600 text-sm">Password</span>
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

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Not Registered?{" "}
                <Link className="underline text-teal-600" to="/register">
                  Create an account here
                </Link>
              </span>

              <button
                type="submit"
                className="bg-teal-600 text-white px-4 py-2 rounded-md font-bold hover:bg-teal-700 transition-colors duration-300"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
