# predict_sklearn.py
import joblib
import sys
import json

# Cargar modelo y etiquetas
model = joblib.load("modelo_emociones_sklearn.pkl")
classes = joblib.load("label_classes.pkl")

def predecir_emociones(texto):
    pred_proba = model.predict_proba([texto])[0]
    top_indices = pred_proba.argsort()[-2:][::-1]
    top_emociones = [classes[i] for i in top_indices]
    top_probs = [round(pred_proba[i], 3) for i in top_indices]

    return {
        "emociones": [
            {"nombre": top_emociones[0], "confianza": top_probs[0]},
            {"nombre": top_emociones[1], "confianza": top_probs[1]}
        ]
    }

# Ejecutar desde terminal
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: ingresa un texto.")
        sys.exit(1)
    
    resultado = predecir_emociones(sys.argv[1])
    print(json.dumps(resultado, ensure_ascii=False, indent=2))
