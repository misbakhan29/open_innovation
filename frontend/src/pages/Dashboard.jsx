import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../utils/translations';
import { Mic, MapPin, UploadCloud, Volume2, Loader2, AlertTriangle, Leaf } from 'lucide-react';

export default function Dashboard() {
  const { lang } = useLanguage();
  const t = translations[lang];

  // Input states
  const [location, setLocation] = useState('');
  const [soilType, setSoilType] = useState('Sandy');
  const [season, setSeason] = useState('Kharif');
  const [cropImage, setCropImage] = useState(null);
  const [soilImage, setSoilImage] = useState(null);
  
  // UI states
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Output states
  const [weather, setWeather] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [irrigation, setIrrigation] = useState(null);
  const [detectedCrop, setDetectedCrop] = useState(null);
  const [detectedSoil, setDetectedSoil] = useState(null);

  // Auto-refresh results when language changes
  useEffect(() => {
    if (weather || recommendations || detectedCrop || detectedSoil) {
      handleAnalyze();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const handleAutoDetect = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state || "Unknown Location";
            setLocation(city);
          } catch (err) {
            setLocation(`Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setError("Geolocation failed: " + error.message);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Web Speech API is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : 'en-US';
    
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setLocation(transcript); // Assuming voice is for location for now
    };
    recognition.onerror = (event) => {
      setError("Speech recognition error: " + event.error);
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    
    recognition.start();
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Mock API calls to Flask backend
      const weatherReq = fetch(`http://localhost:5000/api/weather?location=${encodeURIComponent(location)}&lang=${lang}`);
      const recommendReq = fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soil_type: soilType, season: season, location: location, lang: lang })
      });

      const [weatherRes, recommendRes] = await Promise.all([weatherReq, recommendReq]);
      const weatherData = await weatherRes.json();
      const recommendData = await recommendRes.json();
      
      setWeather(weatherData);
      setRecommendations(recommendData);

      const irrigationRes = await fetch('http://localhost:5000/api/irrigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soil_type: soilType, crop: recommendData.crops[0]?.name, lang: lang })
      });
      const irrigationData = await irrigationRes.json();
      setIrrigation(irrigationData);

      if (cropImage) {
        const cropRes = await fetch(`http://localhost:5000/api/detect-crop?lang=${lang}`, { method: 'POST' });
        setDetectedCrop(await cropRes.json());
      }
      
      if (soilImage) {
        const soilRes = await fetch(`http://localhost:5000/api/detect-soil?lang=${lang}`, { method: 'POST' });
        setDetectedSoil(await soilRes.json());
      }

    } catch (err) {
      setError("Failed to connect to backend. Make sure the Flask server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    let textToSpeak = `${t.results_advice}. `;
    if (weather) {
      if (lang === 'hi') {
        textToSpeak += `${t.weather}: ${weather.temperature} डिग्री, ${weather.description}. `;
      } else if (lang === 'kn') {
        textToSpeak += `${t.weather}: ${weather.temperature} ಡಿಗ್ರಿ, ${weather.description}. `;
      } else {
        textToSpeak += `${t.weather}: ${weather.temperature} degrees, ${weather.description}. `;
      }
    }
    if (recommendations) textToSpeak += `${t.crop_recommendation}: ${recommendations.crops[0]?.name}. `;
    if (irrigation) textToSpeak += `${t.irrigation_advice}: ${irrigation.advice}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const langCode = lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : 'en-US';
    const shortCode = lang === 'hi' ? 'hi' : lang === 'kn' ? 'kn' : 'en';
    utterance.lang = langCode;
    
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang === langCode) || voices.find(v => v.lang.startsWith(shortCode));
    
    if (targetVoice) {
      utterance.voice = targetVoice;
      window.speechSynthesis.speak(utterance);
    } else if (lang === 'kn' || lang === 'hi') {
      // OS Voice missing -> Fallback to cloud TTS via audio element
      try {
        setError(''); // Clear previous errors
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(textToSpeak)}&tl=${lang}&client=tw-ob`;
        const audio = new Audio(url);
        audio.play().catch(e => {
          console.error("Audio fallback failed", e);
          setError(`Failed to play audio. Please install a ${lang === 'kn' ? 'Kannada' : 'Hindi'} language pack on your device.`);
        });
      } catch (err) {
        window.speechSynthesis.speak(utterance);
      }
    } else {
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-agro-dark">{t.dashboard_title}</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
          <AlertTriangle className="mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INPUT PANEL */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2 text-agro-dark">{t.input_data}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.location}</label>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-agro-green focus:border-agro-green"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t.placeholder_location}
                />
                <button 
                  onClick={handleAutoDetect}
                  className="bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition text-gray-700"
                  title={t.auto_detect}
                >
                  <MapPin size={20} />
                </button>
                <button 
                  onClick={handleVoiceInput}
                  className={`${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700'} p-2 rounded-md hover:bg-gray-200 transition`}
                  title={t.voice_input}
                >
                  <Mic size={20} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.soil_type}</label>
              <select 
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-agro-green focus:border-agro-green"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
              >
                <option value="Sandy">{t.sandy}</option>
                <option value="Clay">{t.clay}</option>
                <option value="Loamy">{t.loamy}</option>
                <option value="Red">{t.red}</option>
                <option value="Black">{t.black}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.season}</label>
              <select 
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-agro-green focus:border-agro-green"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
              >
                <option value="Kharif">{t.kharif}</option>
                <option value="Rabi">{t.rabi}</option>
                <option value="Summer">{t.summer}</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.upload_crop}</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageUpload(e, setCropImage)} />
                <UploadCloud className="mx-auto text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">{cropImage ? cropImage.name : t.drag_drop}</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.upload_soil}</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageUpload(e, setSoilImage)} />
                <UploadCloud className="mx-auto text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">{soilImage ? soilImage.name : t.drag_drop}</span>
              </div>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-agro-green text-white font-semibold py-3 rounded-md hover:bg-agro-dark transition flex justify-center items-center mt-6 shadow-sm"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              {loading ? t.loading : t.analyze}
            </button>
          </div>
        </div>

        {/* OUTPUT PANEL */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-xl font-semibold text-agro-dark">{t.results_advice}</h2>
              <button 
                onClick={handleTextToSpeech}
                className="flex items-center text-agro-green hover:text-agro-dark font-medium bg-agro-light/50 px-3 py-1.5 rounded-full transition"
                title={t.listen}
              >
                <Volume2 size={18} className="mr-1" />
                {t.listen}
              </button>
            </div>

            {!weather && !recommendations && !loading && (
              <div className="text-center py-12 text-gray-500">
                <Leaf className="mx-auto text-gray-300 mb-3" size={48} />
                <p>Fill in the input data and click Analyze to see results.</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12 text-agro-green">
                <Loader2 className="animate-spin mx-auto mb-3" size={48} />
                <p className="font-medium text-lg">Analyzing agricultural data...</p>
              </div>
            )}

            {!loading && (weather || recommendations) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Weather Card */}
                {weather && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-3">{t.weather}</h3>
                    <div className="flex items-end space-x-2">
                      <span className="text-3xl font-bold text-blue-900">{weather.temperature}°C</span>
                      <span className="text-blue-700 pb-1">{weather.description}</span>
                    </div>
                    <div className="mt-2 text-sm text-blue-800 flex justify-between">
                      <span>{t.humidity}: {weather.humidity}%</span>
                      <span>{t.rain}: {weather.rainfall}</span>
                    </div>
                  </div>
                )}

                {/* Irrigation Card */}
                {irrigation && (
                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-5 rounded-lg border border-cyan-200">
                    <h3 className="font-semibold text-cyan-800 mb-3">{t.irrigation_advice}</h3>
                    <p className="font-bold text-lg text-cyan-900">{irrigation.advice}</p>
                    <p className="text-sm text-cyan-700 mt-2">{irrigation.reason}</p>
                  </div>
                )}

                {/* Detected Items */}
                {(detectedCrop || detectedSoil) && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border border-purple-200 md:col-span-2">
                    <h3 className="font-semibold text-purple-800 mb-3">{t.image_analysis}</h3>
                    <div className="flex flex-wrap gap-4">
                      {detectedCrop && (
                        <div className="bg-white px-4 py-2 rounded-md shadow-sm border border-purple-100">
                          <span className="text-sm text-purple-600 block">{t.detected_crop}</span>
                          <span className="font-bold text-purple-900">{detectedCrop.detected} ({(detectedCrop.confidence*100).toFixed(0)}%)</span>
                        </div>
                      )}
                      {detectedSoil && (
                        <div className="bg-white px-4 py-2 rounded-md shadow-sm border border-purple-100">
                          <span className="text-sm text-purple-600 block">{t.detected_soil}</span>
                          <span className="font-bold text-purple-900">{detectedSoil.detected} ({(detectedSoil.confidence*100).toFixed(0)}%)</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Crop Recommendations */}
                {recommendations && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200 md:col-span-2">
                    <h3 className="font-semibold text-green-800 mb-3">{t.crop_recommendation}</h3>
                    <div className="space-y-3">
                      {recommendations.crops.map((crop, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-md shadow-sm border border-green-100 flex items-start">
                          <div className="bg-green-100 text-green-800 font-bold w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-green-900">{crop.name}</h4>
                            <p className="text-sm text-green-700">{crop.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
