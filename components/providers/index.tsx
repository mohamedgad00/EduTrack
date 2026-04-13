"use client";

import ReduxProvider from "../base/reduxProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  children: React.ReactNode;
};

function MainProvider({ children }: Props) {
  return (
    <ReduxProvider>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </ReduxProvider>
  );
}

export default MainProvider;
