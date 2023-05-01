const 
  draggables = document.querySelectorAll('.draggable'),
  pieceContainer = document.querySelectorAll('.pContainer'),
  secondContainer = document.querySelector('.secondContainer'),
  crackGlass = document.querySelector('#crackGlass'),
  womanVideo = document.querySelector('#womanVideo'),
  piece = /(piece)/g,
  inside = /(inside)/g;


let mousePosition = { x: null, y: null },
  // ver si esto es util o no
  mouseDown = false, // para que el elemento deje de cambiar de posición si se suelta el mouse
  selectedDraggable = null, // Para la función de mousemove
  diff = { x: null, y: null }, // para que el mouse pueda arrastrar al draggable al lugar correcto
  startX = 0,
  startY = 0;

const createDiv = (num, idNum) => {
  const newDiv = document.createElement('div')
  const newNode = document.createElement('div')
  let section = '';

  if (num <= 7) {
    section = 'first'
  }
  if (num >= 8 && num <= 14) {
    section = 'second'
  }
  if (num >= 15 && num <= 21) {
    section = 'third'
  }
  if (num >= 22) {
    section = 'fourth'
  }
  newDiv.id = idNum
  newDiv.className = `draggable ${section}`
  newNode.className = `node piece${num}`

  newDiv.appendChild(newNode)
  secondContainer.appendChild(newDiv)
  return;
}

// Crea cada una de las piezas en el DOM aleatoriamente
const generateRandomDivs = (ids) => {
  const max = ids.length - 1

  while (!ids.every(el => el === 'done')) {
    const randomNum = Math.floor(Math.random() * (max - 0 + 1) + 0)
    if (ids[randomNum] === 'done') {
      continue
    }
    else {
      createDiv(randomNum + 1, ids[randomNum])
      ids.splice(randomNum, 1, 'done')
    }
  }
}

// Función para buscar la clase con el número de la pieza
const getPieceClass = (element, regex) => {
  return Object.values(element.classList).find(el => regex.test(el)) || false
}



// el offset debería calcular la distancia entre el draggable que estoy arrastrando y la pieza más cercana
// para calcular la cercanía debería usar la posición en la que está el draggable y ver cuál es el container más cercano
// y - top de la caja - height de la caja / 2

const getClosestContainer = (childOfDrag) => {
  const listOfPieceContainers = [...pieceContainer];
  const childRect = childOfDrag.getBoundingClientRect();

  const closestmap = listOfPieceContainers.map((container) => {
    const containerRect = container.getBoundingClientRect();
    const distanceX = childRect.x - containerRect.x;
    const distanceY = childRect.y - containerRect.y;
    const distance = Math.hypot((distanceX ** 2) + (distanceY ** 2));
    return { distance: distance, container: container }
  })
  const filtered = closestmap.filter(container => {
    if (container.distance <= 450) {
      return container
    }
    else return false
  })
  return filtered.length === 0 ? false : filtered[0].container
}

const matchClass = (draggable, child, resultclass) => {
  const pieceNumber = getPieceClass(child, piece)
  const matchTo = getPieceClass(resultclass, piece)
  const parentNode = resultclass.parentNode // El contenedor padre del nodo para encajar la pieza (rectángulos)
  if (pieceNumber === matchTo) {
    parentNode.appendChild(draggable)
    draggable.classList.remove('draggable')
    draggable.removeAttribute('style')
    draggable.classList.add('inside')
    // triggerear transición
  }
  else {
    return;
  }
}
const resetTransition = (draggable) => {
  draggable.style.transition = 'transform 0.3s';
  draggable.style.transform = `translate(${startX}px, ${startY}px)`
  setTimeout(() => {
    draggable.removeAttribute('transition')
    draggable.removeAttribute('transform')
    secondContainer.appendChild(draggable)
  }, 300)
}
window.addEventListener('mousemove', e => {
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY
  if (!mouseDown) return; // No se va a activar si el mouseDown es false

  let offsetY = mousePosition.y - diff.y;
  let offsetX = mousePosition.x - diff.x;
  selectedDraggable.style.top = offsetY + 'px';  // Con esto le asigno la posición en la que va a quedar el draggable cuando lo suelte
  selectedDraggable.style.left = offsetX + 'px';
})

const mouseUpFunction = (draggable) => {
  mouseDown = false
  const child = draggable.children[0]
  const match = getClosestContainer(child)
  match ? matchClass(draggable, child, match) : resetTransition(draggable)
  draggable.classList.remove('dragging');
  checkInsidePieces()
}

// comprobar cuántas piezas hay en su lugar
const checkInsidePieces = () => {
const insidePieces = [...document.querySelectorAll('.inside')]
if(insidePieces.length === 28) {
  initAnimation(insidePieces)
}
else return;
}

// Iniciar animación final
// Arreglar el detalle de la animación
const initAnimation = (insidePieces) =>{
  for(let piece of insidePieces){
    piece.classList.add('toOpacity0')
  }
  womanVideo.classList.add('toOpacity1')
  setTimeout(() => {
    womanVideo.classList.remove('invisible')
    crackGlass.currentTime = 8;
    crackGlass.play()
  }, 0)
  
  setTimeout(() => {
  for(let piece of pieceContainer){
    piece.classList.add('invisible')
  }
  
  }, 3000)
}
// Lista de divs arrastrables, a cada uno le agrego una clase dragging cuando empiece a arrastrarse
// Cuando lo suelte se eliminará la clase 


// const ids = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven',      'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twentyOne', 'twentyTwo', 'twentyThree', 'twentyFour', 'twentyFive', 'twentySix', 'twentySeven', 'twentyEight']

// generateRandomDivs(ids)
const mouseDownFunction = (e, draggable) => {
  const initial = draggable.getBoundingClientRect()
  startX = e.clientX;
  startY = e.clientY;
  if (!mousePosition || getPieceClass(draggable, inside)) return;

  mouseDown = true;
  selectedDraggable = draggable;  // Seleccionar el draggable
  diff.y = mousePosition.y - draggable.offsetTop
  diff.x = mousePosition.x - draggable.offsetLeft // Ver si esto está bien para calcular el offset del elemento
  let offsetY = mousePosition.y - diff.y;
  let offsetX = mousePosition.x - diff.x;
  draggable.style.top = offsetY + 'px';
  draggable.style.left = offsetX + 'px';
  draggable.style.zIndex = '1000';
  draggable.classList.add('dragging');
}

draggables.forEach((draggable) => {

  draggable.addEventListener('mousedown', e => {
    mouseDownFunction(e, draggable)
  })

  draggable.addEventListener('mouseup', e => {
    mouseUpFunction(draggable);
})
})
// TODO:
/*
- Transiciones:
      -Volver a posición original
      - Insertarse en el rompecabezas (sonido)
      - Pasar de rompecabezas armado a video (sonido, video + audio)
Luego de resolver la funcionalidad del rompecabezas:
- Reemplazar por imágenes las piezas
- Desarrollar una función que cuente cuántos nodos están completos, si llega al total entonces se activa la animación final
 */