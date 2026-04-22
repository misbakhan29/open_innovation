import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../utils/translations';

export default function Navbar() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  return (
    <nav className="bg-agro-green text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <Sprout size={28} />
          <span>AgroVision AI</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-agro-light transition">{t.home}</Link>
          <Link to="/dashboard" className="hover:text-agro-light transition">{t.dashboard}</Link>
          <Link to="/how-it-works" className="hover:text-agro-light transition">{t.how_it_works}</Link>
          <Link to="/about" className="hover:text-agro-light transition">{t.about}</Link>
          
          <select 
            className="bg-agro-dark text-white border-none rounded-md px-2 py-1 text-sm cursor-pointer focus:ring-2 focus:ring-white outline-none"
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </div>
      </div>
    </nav>
  );
}
