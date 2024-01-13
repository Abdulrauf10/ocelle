import Link from 'next/link';
import Container from './Container';

export default function Notice() {
  return (
    <div className="bg-primary py-2 text-center text-xl text-white max-xl:text-base">
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
