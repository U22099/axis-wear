import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center space-y-6">
      <span className="text-zinc-700 font-mono text-8xl leading-none">//</span>
      <h2 className="text-3xl font-display font-extrabold tracking-tight uppercase text-white">
        SECTOR NOT FOUND
      </h2>
      <p className="text-xs font-mono text-zinc-400 max-w-sm">
        The requested coordinate is invalid or the data segment has been moved.
      </p>
      <div className="pt-4">
        <Link href="/">
          <Button variant="primary">RETURN TO GRID</Button>
        </Link>
      </div>
    </div>
  );
}
