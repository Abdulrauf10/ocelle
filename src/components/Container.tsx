import React from 'react';

export default function Container({ children }: React.PropsWithChildren<{}>) {
  return <div className="max-w-8xl mx-auto px-[15px]">{children}</div>;
}
