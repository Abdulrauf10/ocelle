'use client';

import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export default function Toast({ promotion }: { promotion?: boolean }) {
  return (
    <ToastContainer
      role="alert"
      position="top-center"
      autoClose={3000}
      hideProgressBar
      transition={Flip}
      toastClassName="!py-0 !min-h-0 text-center max-w-[520px] mx-auto !bg-dark-green !text-white"
      bodyClassName="!py-1 body-3"
      className="!top-1/2 -translate-x-1/2 translate-y-1/2"
      closeButton={false}
      theme="colored"
      icon={false}
    />
  );
}
