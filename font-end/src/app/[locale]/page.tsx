import {getTranslations} from 'next-intl/server';
import Link from "next/link";

export default async function Home() {
  const t = await getTranslations('home');

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-24 flex items-center justify-center">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight leading-tight">
          {t('title')}
        </h1>
        <p className="text-zinc-400 text-lg">
          {/* 精簡、直覺、高效率。用更少的操作完成更多任務。 */}
          {t('description')}
        </p>

          <Link
            href="/dashboard"
            className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-zinc-200 transition"
          >
            {t('start')}
          </Link>
          <Link
            href="/report"
            className="border border-white/20 px-6 py-3 rounded-lg text-white hover:bg-white/10 transition"
          >
            {t('report')}
          </Link>
        </div>
    </main>
  );
}