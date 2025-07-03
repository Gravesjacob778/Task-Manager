import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import RadialMenu from "@/components/radial-menu";
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  console.info(`Locale "${locale}" is being used.`);
  if (!hasLocale(routing.locales, locale)) {
    // If the locale is not supported, redirect to
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          {/* <DraggableWrapper>
            <RadialMenu
              items={[
                { icon: "💬", label: "聊天", route: "/chat", angle: -120 },
                { icon: "📊", label: "報表", route: "/report", angle: -80 },
                {
                  icon: "➕",
                  label: "新增任務",
                  route: "/dashboard",
                  angle: -40,
                },
                { icon: "⚙️", label: "設定", route: "/setting", angle: 0 },
                { icon: "📅", label: "日曆", route: "/calendar", angle: 40 },
                { icon: "🏠", label: "主畫面", route: "/", angle: 80 },
              ]}
            />
          </DraggableWrapper> */}
          <RadialMenu
            items={[
              { icon: "💬", label: "聊天", route: "/chat", angle: -120 },
              { icon: "📊", label: "報表", route: "/report", angle: -80 },
              {
                icon: "➕",
                label: "新增任務",
                route: "/dashboard",
                angle: -40,
              },
              { icon: "⚙️", label: "設定", route: "/setting", angle: 0 },
              { icon: "📅", label: "日曆", route: "/calendar", angle: 40 },
              { icon: "🏠", label: "主畫面", route: "/", angle: 80 },
            ]}
          />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
