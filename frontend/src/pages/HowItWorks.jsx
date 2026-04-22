export default function HowItWorks() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-8 text-agro-dark">How It Works</h1>
      <p className="text-gray-600 max-w-2xl mx-auto">Learn how AgroVision AI processes your data to provide accurate farming advice.</p>
      <div className="mt-12 text-left bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
        <ol className="list-decimal pl-6 space-y-4 text-lg text-gray-700">
          <li><strong>User provides input:</strong> Via manual form, voice command, or image upload.</li>
          <li><strong>Image models detect:</strong> Crop and soil type from uploaded images.</li>
          <li><strong>Weather data fetched:</strong> Real-time conditions from your location.</li>
          <li><strong>ML model recommends:</strong> The best crops suited for your environment.</li>
          <li><strong>Irrigation advisor:</strong> Generates watering advice based on forecast and soil.</li>
          <li><strong>Results delivered:</strong> View in text, translate to your language, or listen via voice.</li>
        </ol>
      </div>
    </div>
  );
}
