import React from "react";
import { cn } from "../../lib/utills";
import * as apiClient from "../../api-client";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Label } from "../../components/aceternity-ui/label";
import { Input } from "../../components/aceternity-ui/input";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type SignInFormData = {
  email: string;
  password: string;
};

function SignIn() {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "DOne!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validate-token");
      navigate("/");
    },
    onError: () => {
      showToast({ message: "Error", type: "ERROR" });
    },
  });

  const handleGoogleAuth = () => {
    apiClient.initiateGoogleAuth();
  };
  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
    // console.log(data);
  });

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black md:mt-10 ">
      <h2 className="font-bold text-2xl text-white">Welcome Back</h2>

      <form className="my-8" onSubmit={onSubmit}>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGoogleAuth}
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="amitverma@gmail.com"
            type="email"
            {...register("email", { required: "This field is required" })}
          />
          {errors.email?.message && (
            <span className="text-white font-bold">{errors.email.message}</span>
          )}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
          />
          {errors.password?.message && (
            <span className="text-white font-bold">
              {errors.password.message}
            </span>
          )}
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign In &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default SignIn;
