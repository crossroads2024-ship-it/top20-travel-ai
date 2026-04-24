import Link from 'next/link';
import { Globe } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Globe className="w-8 h-8 text-brand-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 text-lg mb-6">This destination doesn't exist on our map.</p>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}
