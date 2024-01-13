import Container from './Container';

export default function Newsletter() {
  return (
    <div className="bg-[#dce7ef] px-4 py-6">
      <Container>
        <div className="-mx-3 flex flex-nowrap items-center justify-center text-xl max-md:block">
          <div className="m-3 flex min-h-[38px] items-center bg-newsletter-icon bg-[length:60px_auto] bg-[left_center] bg-no-repeat pl-20">
            <span>
              Exclusive insights, special offers, and helpful nutrition information from the Ocelle
              Dog Pack.{' '}
              <strong className="text-primary">
                Join Now! <i>Woof!</i>
              </strong>
            </span>
          </div>
          <form className="relative flex w-[340px] min-w-[340px] items-center max-md:w-full">
            <input
              type="email"
              className="m-3 w-full rounded-[30px] border-0 bg-white py-4 pl-5 pr-[55px]"
              placeholder="Enter your email address"
            />
            <button className="absolute right-[20px] h-[44px] w-[44px] cursor-pointer border-0 bg-newsletter-btn bg-[length:100%_auto] bg-center bg-no-repeat"></button>
          </form>
        </div>
      </Container>
    </div>
  );
}
