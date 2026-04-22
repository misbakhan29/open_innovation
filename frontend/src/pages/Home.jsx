import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Droplets, CloudSun, Mic, Languages, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../utils/translations';

export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-agro-green to-agro-dark text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">{t.hero_title}</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">{t.hero_sub}</p>
          <Link to="/dashboard" className="inline-flex items-center bg-white text-agro-green font-semibold px-8 py-3 rounded-full hover:bg-agro-light transition">
            {t.get_started} <ArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-agro-dark">{t.key_features}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={<Leaf className="text-agro-green" size={40}/>} title={t.feat_crop} desc={t.feat_crop_d} />
            <FeatureCard icon={<Droplets className="text-blue-500" size={40}/>} title={t.feat_irr} desc={t.feat_irr_d} />
            <FeatureCard icon={<CloudSun className="text-yellow-500" size={40}/>} title={t.feat_wea} desc={t.feat_wea_d} />
            <FeatureCard icon={<Mic className="text-purple-500" size={40}/>} title={t.feat_voice} desc={t.feat_voice_d} />
            <FeatureCard icon={<Languages className="text-orange-500" size={40}/>} title={t.feat_lang} desc={t.feat_lang_d} />
            <FeatureCard icon={<ImageIcon className="text-pink-500" size={40}/>} title={t.feat_img} desc={t.feat_img_d} />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition bg-agro-light/20">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
