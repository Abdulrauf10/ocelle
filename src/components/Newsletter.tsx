import Container from './Container';

export default function Newsletter() {
  return (
    <div className="bg-[#dce7ef] px-[15px] py-[30px]">
      <Container>
        <div className="-mx-[10px] flex flex-nowrap items-center justify-center text-[20px] max-md:block">
          <div className="bg-newsletter-icon m-[10px] flex min-h-[38px] items-center bg-[length:60px_auto] bg-[left_center] bg-no-repeat pl-[75px]">
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
              className="m-[10px] w-full rounded-[30px] border-0 bg-white py-[13px] pl-[20px] pr-[55px]"
              placeholder="Enter your email address"
            />
            <button className="bg-newsletter-btn absolute right-[15px] h-[44px] w-[44px] cursor-pointer border-0 bg-[length:100%_auto] bg-[center] bg-no-repeat"></button>
          </form>
        </div>
      </Container>
    </div>
  );
}
