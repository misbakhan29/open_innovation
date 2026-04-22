from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

@app.route('/api/recommend', methods=['POST', 'OPTIONS'])
def recommend():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json() or {}
    lang = data.get('lang', 'en')
    
    if lang == 'hi':
        crops = [
            {"name": "गेहूँ", "reason": "वर्तमान तापमान और मिट्टी के प्रकार के लिए इष्टतम।"},
            {"name": "जौ", "reason": "कम पानी की आवश्यकता है, अनुमानित वर्षा के लिए अच्छा है।"},
            {"name": "सरसों", "reason": "रबी मौसम और दोमट मिट्टी के लिए उपयुक्त।"}
        ]
    elif lang == 'kn':
        crops = [
            {"name": "ಗೋಧಿ", "reason": "ಪ್ರಸ್ತುತ ತಾಪಮಾನ ಮತ್ತು ಮಣ್ಣಿನ ಪ್ರಕಾರಕ್ಕೆ ಸೂಕ್ತವಾಗಿದೆ."},
            {"name": "ಬಾರ್ಲಿ", "reason": "ಕಡಿಮೆ ನೀರು ಬೇಕಾಗುತ್ತದೆ, ನಿರೀಕ್ಷಿತ ಮಳೆಗೆ ಒಳ್ಳೆಯದು."},
            {"name": "ಸಾಸಿವೆ", "reason": "ರಬಿ ಋತು ಮತ್ತು ಗೋಡು ಮಣ್ಣಿಗೆ ಸೂಕ್ತವಾಗಿದೆ."}
        ]
    else:
        crops = [
            {"name": "Wheat", "reason": "Optimal for current temperature and soil type."},
            {"name": "Barley", "reason": "Requires less water, good for predicted rainfall."},
            {"name": "Mustard", "reason": "Suitable for Rabi season and loamy soil."}
        ]
        
    return jsonify({"crops": crops})

@app.route('/api/irrigation', methods=['POST', 'OPTIONS'])
def irrigation():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json() or {}
    lang = data.get('lang', 'en')
    
    advice = "Light watering recommended"
    reason = "Soil moisture is adequate, but slight temperature increase expected."
    
    if lang == 'hi':
        advice = "हल्की सिंचाई की सलाह दी जाती है"
        reason = "मिट्टी की नमी पर्याप्त है, लेकिन तापमान में मामूली वृद्धि की उम्मीद है।"
    elif lang == 'kn':
        advice = "ಹಗುರವಾದ ನೀರಾವರಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ"
        reason = "ಮಣ್ಣಿನ ತೇವಾಂಶವು ಸಮರ್ಪಕವಾಗಿದೆ, ಆದರೆ ತಾಪಮಾನದಲ್ಲಿ ಸ್ವಲ್ಪ ಹೆಚ್ಚಳವನ್ನು ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ."
        
    return jsonify({
        "advice": advice,
        "reason": reason
    })

@app.route('/api/detect-crop', methods=['POST', 'OPTIONS'])
def detect_crop():
    if request.method == 'OPTIONS':
        return '', 200
    lang = request.args.get('lang', 'en')
    
    detected = "Healthy Wheat"
    if lang == 'hi': detected = "स्वस्थ गेहूँ"
    elif lang == 'kn': detected = "ಆರೋಗ್ಯಕರ ಗೋಧಿ"
    
    return jsonify({
        "detected": detected,
        "confidence": 0.94
    })

@app.route('/api/detect-soil', methods=['POST', 'OPTIONS'])
def detect_soil():
    if request.method == 'OPTIONS':
        return '', 200
    lang = request.args.get('lang', 'en')
    
    detected = "Loamy Soil"
    if lang == 'hi': detected = "दोमट मिट्टी"
    elif lang == 'kn': detected = "ಗೋಡು ಮಣ್ಣು"
    
    return jsonify({
        "detected": detected,
        "confidence": 0.88
    })

@app.route('/api/weather', methods=['GET', 'OPTIONS'])
def get_weather():
    if request.method == 'OPTIONS':
        return '', 200
    location = request.args.get('location', 'Unknown')
    lang = request.args.get('lang', 'en')
    
    desc = "Partly Cloudy"
    if lang == 'hi': desc = "आंशिक रूप से बादल छाए रहेंगे"
    elif lang == 'kn': desc = "ಭಾಗಶಃ ಮೋಡ"
    
    return jsonify({
        "temperature": 28.5,
        "humidity": 65,
        "rainfall": "10mm" if lang != 'hi' and lang != 'kn' else "१० मिमी" if lang == 'hi' else "10 ಮಿಮೀ",
        "description": desc,
        "location": location
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000, threaded=True)
