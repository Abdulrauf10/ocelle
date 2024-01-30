import H2 from '@/components/headings/H2';
import { useTranslations } from 'next-intl';

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
