import { Suspense } from 'react';
import InputsClient from './InputsClient';

export default function InputsPage() {
  return (
    <Suspense>
      <InputsClient />
    </Suspense>
  );
}
