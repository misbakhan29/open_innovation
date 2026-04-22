import { useLanguage } from '../LanguageContext';
import { translations } from '../utils/translations';

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <footer className="bg-agro-dark text-white text-center py-6 mt-auto">
      <p>&copy; {new Date().getFullYear()} {t.footer_text}</p>
    </footer>
  );
}
