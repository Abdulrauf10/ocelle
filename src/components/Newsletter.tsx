import Container from './Container';
import ArrowRight from './icons/ArrowRight';
import EmailStroke from './icons/EmailStroke';

export default function Newsletter() {
  return (
    <div className="bg-primary bg-opacity-20 py-8">
      <Container>
        <div className="-m-3 flex flex-nowrap items-center justify-center text-xl max-md:block">
          <div className="w-full p-3">
            <div className="flex min-h-[38px] items-center">
              <EmailStroke className="w-[60px] min-w-[60px] text-primary" />
              <span className="ml-5">
                Exclusive insights, special offers, and helpful nutrition information from the
                Ocelle Dog Pack.&nbsp;
                <strong className="text-primary">
                  Join Now! <i>Woof!</i>
                </strong>
              </span>
            </div>
          </div>
          <div className="p-3">
            <form className="relative flex w-[340px] min-w-[340px] items-center max-md:w-full">
              <input
                type="email"
                className="w-full rounded-[30px] border-0 bg-white py-4 pl-6 pr-16"
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
