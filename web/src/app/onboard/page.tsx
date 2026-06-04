import { Metadata } from 'next';
import { OnboardClient } from './OnboardClient';

export const metadata: Metadata = {
  title: 'Προσθήκη & Εγγραφή Φροντιστηρίου | ToFrontistirio',
  description: 'Καταχωρίστε το φροντιστήριό σας στο ToFrontistirio για να προβληθείτε σε χιλιάδες μαθητές και γονείς.',
  alternates: {
    canonical: 'https://tofrontistirio.com/onboard',
  },
};

export default function OnboardPage() {
  return <OnboardClient />;
}
