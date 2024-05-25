import { useTranslations } from 'next-intl';

import Container from './Container';
import ArrowRight from './icons/ArrowRight';
import EmailStroke from './icons/EmailStroke';

export default function Newsletter() {
  const n = useTranslations('Newsletter');
  return (
    <div className="bg-primary bg-opacity-20 py-8">
      <Container>
        <div className="-m-3 flex flex-nowrap items-center justify-center max-md:block">
          <div className="w-full p-3">
            <div className="flex min-h-[38px] items-center">
              <EmailStroke className="w-[60px] min-w-[60px] text-primary" />
              <div className="ml-5">
                <span className="body-1">
                  {n('content-1')}
                  {n('content-3')}
                  <strong className="inline-block font-jost font-bold text-primary">
                    {n.rich('content-2')}
                  </strong>
                </span>
              </div>
            </div>
          </div>
          <div className="p-3">
            <form className="relative flex w-full items-center md:w-[340px] md:min-w-[340px]">
              <input
                type="email"
                className="body-1 body-inline w-full rounded-[30px] border-0 bg-white py-4 pl-6 pr-16"
                placeholder="Enter your email address"
              />
              <button className="absolute right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-primary text-white">
                <ArrowRight className="w-6" />
              </button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
