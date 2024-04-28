'use client';

import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export default function Toast({ promotion }: { promotion?: boolean }) {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar
      transition={Slide}
      toastClassName="!py-0 !min-h-0 text-center max-w-[520px] mx-auto"
      bodyClassName="!py-1 body-3"
      className={promotion ? '!top-[98px]' : '!top-[56px]'}
      closeButton={false}
      theme="colored"
      icon={false}
    />
  );
}
