import { Metadata } from 'next';
import { ContactClient } from './ContactClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const country = resolvedParams.country || 'cy';
  const isGreece = country.toLowerCase() === 'gr';

  return {
    title: isGreece ? 'Επικοινωνήστε μαζί μας | ToFrontistirio' : 'Επικοινωνήστε μαζί μας | ToFrontistirio',
    description: isGreece
      ? 'Επικοινωνήστε με την ομάδα του ToFrontistirio στην Ελλάδα. Είμαστε εδώ για να απαντήσουμε σε κάθε σας ερώτηση.'
      : 'Επικοινωνήστε με την ομάδα του ToFrontistirio στην Κύπρο. Είμαστε εδώ για να απαντήσουμε σε κάθε σας ερώτηση.',
    alternates: {
      canonical: `https://tofrontistirio.com/${country}/contact`,
    },
  };
}

export default function ContactPage() {
  return <ContactClient />;
}
