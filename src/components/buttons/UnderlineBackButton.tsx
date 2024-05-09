'use client';

import UnderlineButton from '@/components/buttons/UnderlineButton';
import { useRouter } from '@/navigation';

export default function UnderlineBackButton({ label }: { label: string }) {
  const router = useRouter();

  return <UnderlineButton type="button" label={label} onClick={() => router.back()} />;
}
