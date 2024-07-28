import { Input } from "../../../common/components/ui/form/input";
import "./sign-in.scss";

export default () => {
  return (
    <div class="background flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-dark-900 dark:text-white">
      <div class="w-500 rounded-xl bg-dark-900 bg-opacity-100 p-5 shadow">
        <h1 class="mb-3 text-center text-4xl">Food swipe</h1>

        <h2 class="mb-10 text-center text-2xl">Sign in to your account</h2>
        <div class="mb-4">
          <Input type="email" placeholder="example@gmail.com">
            Email
          </Input>
        </div>
        <div class="mb-4">
          <Input type="password" placeholder="Password">
            Password
          </Input>
        </div>

        <div class="mt-3 flex justify-end">
          <a href="/auth/forgot-password">Forgot password?</a>
        </div>
      </div>
      <div class="mt-10 text-center">
        <span class="mr-1 text-gray-500">Don't have an account?</span>

        <a href="/auth/sign-up">Sign up</a>
      </div>
    </div>
  );
};
