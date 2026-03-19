"use client";

const ErrorPage = ({ error }) => {
  return (
    <div className="mx-auto">
      <h1>Error</h1>
      <p>{error.toString()}</p>
    </div>
  );
};

export default ErrorPage;
