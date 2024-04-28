'use client';

import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export default function Toast() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar
      transition={Slide}
      toastClassName="!py-0 !min-h-0 !bg-[#269D9E] !text-white !font-jost !text-center"
      bodyClassName="!py-1"
      closeButton={false}
    />
  );
}
