import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {

    return (
      
      <div id="error-page" className="h-screen w-full flex justify-center items-center">
        <div>
          <h1 className="text-2xl font-bold">Oops! {error.status}</h1>
          <p className="text-lg text-center">{error.statusText}</p>
          {error.data?.message && (
            <p>
              <i>{error.data.message}</i>
            </p>
          )}
        </div>
      </div>
      
    );
  } else if (error instanceof Error) {
    return (
      <div id="error-page" className="h-screen justify-center items-center">
        <h1>Oops! Unexpected Error</h1>
        <p>Something went wrong.</p>
        <p>
          <i>{error.message}</i>
        </p>
      </div>
    );
  } else {
    return <></>;
  }
}