'use client';

import { useTranslations } from 'next-intl';

import { useReferralDialogContext } from '../ReferralDialog';

import Button from '@/components/buttons/Button';

export default function ReferAFriendButton() {
  const b = useTranslations('Button');
  const dialog = useReferralDialogContext();

  return (
    <Button className="mt-6" onClick={() => dialog.openDialog()}>
      {b('refer-a-friend')}
    </Button>
  );
}
