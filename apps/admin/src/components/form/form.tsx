import { PropsWithChildren, SubmitEventHandler, Suspense } from "react";
import { Spinner } from "../ui/spinner";

type Props = PropsWithChildren<{
  onSubmit: SubmitEventHandler<HTMLFormElement>;
}>;

export function Form({ onSubmit, children }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        }
      >
        {children}
      </Suspense>
    </form>
  );
}
