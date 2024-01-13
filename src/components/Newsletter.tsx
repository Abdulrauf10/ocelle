import Container from './Container';

export default function Newsletter() {
  return (
    <div className="bg-[#dce7ef] py-8">
      <Container>
        <div className="-m-3 flex flex-nowrap items-center justify-center text-xl max-md:block">
          <div className="w-full p-3">
            <div className="flex min-h-[38px] items-center bg-newsletter-icon bg-[length:60px_auto] bg-[left_center] bg-no-repeat pl-20">
              <span>
                Exclusive insights, special offers, and helpful nutrition information from the
                Ocelle Dog Pack.{' '}
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
              <button className="absolute right-2 h-11 w-11 cursor-pointer border-0 bg-newsletter-btn bg-[length:100%_auto] bg-center bg-no-repeat"></button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
