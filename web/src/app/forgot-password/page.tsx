import { Metadata } from 'next';
import { ForgotPasswordClient } from './ForgotPasswordClient';

export const metadata: Metadata = {
  title: 'Επαναφορά Κωδικού | ToFrontistirio',
  description: 'Ανακτήστε ή επαναφέρετε τον κωδικό πρόσβασης του λογαριασμού σας στο ToFrontistirio.',
  alternates: {
    canonical: 'https://tofrontistirio.com/forgot-password',
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
