"use client";

import ReduxProvider from "../base/reduxProvider";

type Props = {
  children: React.ReactNode;
};

function MainProvider({ children }: Props) {
  return (
    <ReduxProvider>
        {children}
    </ReduxProvider>
  );
}

export default MainProvider;
