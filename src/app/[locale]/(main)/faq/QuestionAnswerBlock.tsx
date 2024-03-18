'use client';

import clsx from 'clsx';
import React from 'react';

interface QuestionAnswerBlockProps {
  question: string;
  answer: React.ReactNode;
}

export default function QuestionAnswerBlock({ question, answer }: QuestionAnswerBlockProps) {
  const [opened, setOpened] = React.useState(false);

  return (
    <div
      className="-mx-2 flex cursor-pointer"
      tabIndex={0}
      onClick={() => setOpened(!opened)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          setOpened(!opened);
        }
      }}
    >
      <div className="px-2">
        <div className="mt-1.5">
          <div
            className={clsx(
              'h-0 w-0 border-[8px] border-l-[12px] border-r-0 border-transparent border-l-primary transition',
              opened && 'rotate-90 border-l-secondary'
            )}
          ></div>
        </div>
      </div>
      <div className="px-2">
        <h3 className="body-1 text-primary">{question}</h3>
        <div className={clsx('h-0 overflow-hidden transition', opened && 'h-auto')}>
          <p className="body-1 mt-2">{answer}</p>
        </div>
      </div>
    </div>
  );
}
