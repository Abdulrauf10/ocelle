import Link from 'next/link';
import Container from './Container';

export default function Notice() {
  return (
    <div className="bg-primary py-[10px] text-center text-[1.25rem] text-white max-xl:text-[1rem]">
      <Container>
        Get 50% off your starter box!{' '}
        <Link href="#" className="font-bold hover:underline" target="_blank">
          Order NOW
        </Link>
        !
      </Container>
    </div>
  );
}
