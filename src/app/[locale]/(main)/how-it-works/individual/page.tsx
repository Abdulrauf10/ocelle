import Container from '@/components/Container';
import H2 from '@/components/headings/H2';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface SectionProps {
  picture: string;
  title: string;
  description: string;
  price: number;
  color: string;
  reverse?: boolean;
}

function Section({ picture, title, description, price, reverse }: SectionProps) {
  return (
    <div className="bg-opacity-10 py-12">
      <Container>
        <div className="flex">
          <div className="w-5/12">
            <div className="relative pt-[100%]">
              <Image src={picture} alt={title} />
            </div>
          </div>
          <div className="w-7/12"></div>
        </div>
      </Container>
    </div>
  );
}

export default function HowItWorksIndividual() {
  const t = useTranslations('general');

  return (
    <main>
      <div className="bg-primary bg-opacity-10 py-20 text-center">
        <H2 className="text-primary">Feeding Fresh Is Easy With OCELLE</H2>
        <p className="mt-4 text-secondary">
          If you’re not ready for a subscription, our individual packs come in set weights and can
          be ordered anytime.
        </p>
      </div>
    </main>
  );
}
