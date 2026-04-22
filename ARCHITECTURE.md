# AgroVision AI - Architecture Documentation

## System Architecture Diagram
The system follows a modern decoupled full-stack architecture, utilizing React for a dynamic frontend and Python Flask for an ML-ready backend, integrated with external APIs for location mapping and weather data.

```mermaid
graph TD
    %% Frontend Components
    subgraph "Frontend (React + Vite + Tailwind)"
        UI[User Interface Dashboard]
        LC[Language Context / Translation Engine]
        VAPI[Web Speech API Native]
        UI <--> LC
        UI <--> VAPI
    end

    %% External Third Party APIs
    subgraph "External Services"
        OSM[OpenStreetMap Nominatim API]
        OWM[OpenWeatherMap API Placeholder]
    end

    %% Backend Components
    subgraph "Backend (Python Flask)"
        API[Flask REST API]
        
        subgraph "Machine Learning Mocks"
            CropModel[Crop Recommendation Logic]
            IrrModel[Irrigation Advisory Logic]
            ImgCrop[Image Recognition Crop]
            ImgSoil[Image Recognition Soil]
        end
        
        API --> CropModel
        API --> IrrModel
        API --> ImgCrop
        API --> ImgSoil
    end

    %% Flow connections
    UI -- "Reverse Geocoding (Lat/Lon)" --> OSM
    UI -- "JSON Payload (Location, Soil, Lang)" --> API
    API -- "Weather Data Request" --> OWM
    API -- "JSON Response (Translated Advice)" --> UI
```

---

## Data Flow Diagram
This diagram outlines how data travels through the system during a single "Analysis" cycle.

```mermaid
sequenceDiagram
    participant User
    participant Frontend as React Dashboard
    participant Browser as Web Speech API
    participant OSM as OpenStreetMap API
    participant Backend as Flask API
    
    %% Input Phase
    User->>Frontend: Selects Soil, Season, Language
    
    alt Voice Input
        User->>Browser: Speaks Location
        Browser-->>Frontend: Transcribed Text
    else Auto-Detect
        Frontend->>OSM: Request City Name from Lat/Lon
        OSM-->>Frontend: City Name
    end
    
    User->>Frontend: Uploads Images (Crop/Soil)
    
    %% Processing Phase
    User->>Frontend: Clicks "Analyze Data"
    
    par Parallel Requests
        Frontend->>Backend: GET /api/weather?location=&lang=
        Frontend->>Backend: POST /api/recommend
        Frontend->>Backend: POST /api/irrigation
        Frontend->>Backend: POST /api/detect-crop
        Frontend->>Backend: POST /api/detect-soil
    end
    
    %% Backend Processing
    Note over Backend: Processes inputs and applies translations<br/>based on requested language (en, hi, kn)
    
    %% Output Phase
    Backend-->>Frontend: Returns fully translated JSON payloads
    Frontend->>User: Renders Localized Results (Weather, Recommendations, Advice)
    
    %% Text to speech
    User->>Frontend: Clicks "Listen to Results"
    Frontend->>Browser: Sends translated text to SpeechSynthesis
    Browser-->>User: Speaks results in selected language
```
