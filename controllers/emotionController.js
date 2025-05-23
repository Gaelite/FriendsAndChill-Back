const { spawn } = require('child_process');

exports.getMovieRecommendation = (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ error: "El campo 'texto' es requerido." });
  }

  const process = spawn('python', ['predict.py', texto]);

  let output = '';
  let error = '';

  process.stdout.on('data', data => output += data.toString());
  process.stderr.on('data', data => error += data.toString());

  process.on('close', code => {
    if (code !== 0) {
      console.error("Error del modelo:", error);
      return res.status(500).json({ error: "Error en la predicción", detalles: error });
    }

    try {
      const resultado = JSON.parse(output);
      res.json(resultado);
    } catch (e) {
      console.error("Error al parsear salida:", output);
      res.status(500).json({ error: "Respuesta del modelo no válida", raw: output });
    }
  });
};
