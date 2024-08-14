"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="6px"
        color="rgb(var(--colors-primary))"
        options={{ showSpinner: true }}
        shallowRouting
      />
    </>
  );
};

export default Providers;
