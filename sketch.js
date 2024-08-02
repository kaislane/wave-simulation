let cols, rows;
let cellSize = 10;

let zoff = 0; // Desplazamiento en el eje z para animar el ruido en el tiempo;
let previousY = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = (windowWidth * 0.6) / cellSize;
  rows = (windowHeight * 0.8) / cellSize;
  frameRate(60);

  // Inicializo la matriz de posiciones anteriores (para el lerp);
  for (let y = 0; y < rows; y++) {
    previousY[y] = [];
    for (let x = 0; x < cols; x++) {
      previousY[y][x] = (y * cellSize) + (windowHeight * 0.1); // Ajusto el margen vertical superior;
    }
  }
}

function draw() {
  background(0, 40); // El fondo tiene cierta transparencia para que haya un efecto de "motion blur";
  stroke(255, 80);

  // background(255, 60); // El fondo tiene cierta transparencia para que haya un efecto de "motion blur";
  // stroke(0);

  noFill();

  // Itero sobre cada fila y columna para generar los vértices de las líneas;
  let yoff = 0;
  for (let y = 0; y < rows; y++) {

    beginShape();
    let xoff = 0;

    for (let x = 0; x < cols; x++) {
      let noiseValue = noise(xoff, yoff, zoff); // Valores positivos entre 0 y 1;
      let noiseAmpValue = noiseValue * 10; // Valor amplificado del ruido para el seno;

      // Calculo la distancia al centro del canvas solo en el eje X;
      let centerX = (windowWidth * 0.6) / 2;
      let distanceCenter = abs(x * cellSize - centerX); // Solo tengo en cuenta la distancia en X;

      // Defino el intervalo central en el que las líneas se dibujarán con mayor amplitud;
      let centralWidth = windowWidth * 0.25;

      // Calculo scaleFactor dependiendo de la distancia al centro en X;
      let scaleFactor;
      if (distanceCenter < centralWidth / 2) {
        // Dentro del intervalo central, aumento la intensidad;
        scaleFactor = 10;
      } else {
        // Fuera del intervalo central, uso un mapeo logarítmico en vez de lineal;
        let maxDistance = centerX;
        let logDistance = Math.log(distanceCenter + 1);
        let logMaxDistance = Math.log(maxDistance + 1);
        scaleFactor = map(logDistance, 0, logMaxDistance, 20, 0);
      }

      // Calculo la nueva posición en y con la amplitud escalada;
      let noiseMap = map(noiseValue, 0, 1, 0, 10) * scaleFactor;
      let xpos = (windowWidth * 0.2) + (x * cellSize); // La posición de X de los vértices se mantiene constante // Ajusto el margen horizontal;
      let newY = (windowHeight * 0.1) + (y * cellSize) - (noiseMap * abs(sin(noiseAmpValue))); // La posición de Y cambia en el tiempo // Ajusto el margen vertical;


      let ypos = lerp(previousY[y][x], newY, 0.05); // Suavizo el movimiento de los vértices;

      curveVertex(xpos, ypos); // Dibujo líneas con vértices curvos;

      // Guardo la nueva posición en y;
      previousY[y][x] = ypos;

      xoff += 0.1;
    }

    endShape();
    yoff += 0.2;
  }

  zoff += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = (windowWidth * 0.6) / cellSize;
  rows = (windowHeight * 0.8) / cellSize;

  // Reajusto posiciones iniciales en previousY después de redimensionar;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      previousY[y][x] = (y * cellSize) + (windowHeight * 0.1);
    }
  }
}
