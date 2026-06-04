import { Metadata } from 'next';
import { LoginClient } from './LoginClient';

export const metadata: Metadata = {
  title: 'Σύνδεση Ιδιοκτήτη | ToFrontistirio',
  description: 'Συνδεθείτε στον λογαριασμό διαχείρισης του φροντιστηρίου σας στο ToFrontistirio.',
  alternates: {
    canonical: 'https://tofrontistirio.com/login',
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
