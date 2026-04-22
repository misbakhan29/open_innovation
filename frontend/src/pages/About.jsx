export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-8 text-agro-dark">About AgroVision AI</h1>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto text-left">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-8">
          AgroVision AI is designed to empower farmers with cutting-edge artificial intelligence. We aim to bridge the technology gap in agriculture by providing easy-to-use, accessible, and multilingual tools that help farmers optimize crop yields and conserve water resources.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Frontend:</strong> React, Tailwind CSS</li>
          <li><strong>Backend:</strong> Python, Flask</li>
          <li><strong>Machine Learning:</strong> Scikit-learn, TensorFlow/Keras (planned)</li>
          <li><strong>APIs:</strong> OpenWeatherMap (Weather), Web Speech API (Voice & Speech)</li>
        </ul>
      </div>
    </div>
  );
}
