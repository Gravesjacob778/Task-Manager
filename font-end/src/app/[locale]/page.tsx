import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations('home');

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">{t('title')}</h1>
        <p className="text-zinc-400">{t('description')}</p>
      </div>
    </main>
  );
}