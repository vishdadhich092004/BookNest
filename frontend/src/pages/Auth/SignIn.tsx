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
      <div className="flex bg-white shadow-md rounded-lg overflow-hidden">
        <div className="md:block md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1529158062015-cad636e205a0?q=80&w=1953&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="SignIn"
            className="object-cover w-full h-full" // Changed w-0 to w-full
          />
        </div>
        <div className="flex-1 p-8 self-center w-25">
          <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>

            <label className="text-gray-700 text-sm font-bold flex-1">
              Email
              <input
                type="email"
                className="border rounded w-full py-1 font-normal mt-1"
                {...register("email", { required: "This field is required" })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm font-normal">
                  {errors.email.message}
                </span>
              )}
            </label>

            <label className="text-gray-700 text-sm font-bold flex-1">
              Password
              <input
                type="password"
                className="border rounded w-full py-1 font-normal mt-1"
                {...register("password", {
                  required: "This field is required",
                  minLength: {
                    value: 6,
                    message: "Password must be greater than 6 characters",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-500 text-sm font-normal">
                  {errors.password.message}
                </span>
              )}
            </label>

            <span className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-600">
                Not Registered?{" "}
                <Link className="underline text-indigo-600" to="/register">
                  Create an account here
                </Link>
              </span>

              <button className="bg-indigo-600 text-white px-4 py-2 rounded-sm font-bold hover:bg-indigo-700 transition-colors duration-300">
                Login
              </button>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
