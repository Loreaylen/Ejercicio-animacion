const draggables = document.querySelectorAll('.draggable'),
  pieceContainer = document.querySelectorAll('.pContainer'),
  secondContainer = document.querySelector('.secondContainer'),
  piece = /(piece)/g,
  nodeContainer = /(nodeContainer)/g;

let mousePosition = { x: null, y: null },
   // ver si esto es util o no
  mouseDown = false, // para que el elemento deje de cambiar de posición si se suelta el mouse
  selectedDraggable = null, // Para la función de mousemove
  diff = { x: null, y: null }, // para que el mouse pueda arrastrar al draggable al lugar correcto
  startX = 0,
  startY = 0;

  
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
  setTimeout(() =>{
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

// Lista de divs arrastrables, a cada uno le agrego una clase dragging cuando empiece a arrastrarse
// Cuando lo suelte se eliminará la clase 
draggables.forEach((draggable) => {

  draggable.addEventListener('mousedown', e => {
    const initial = draggable.getBoundingClientRect()
    console.log(initial)
    startX = e.clientX;
    startY = e.clientY;
    console.log(getPieceClass(draggable.parentNode, nodeContainer), 'ACA')
    if (!mousePosition || getPieceClass(draggable.parentNode, nodeContainer)) return;

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
    console.log(selectedDraggable, selectedDraggable.parentNode)
  })

  draggable.addEventListener('mouseup', e => {
    mouseDown = false
    const child = draggable.children[0]
    const match = getClosestContainer(child)
    match ? matchClass(draggable, child, match) : resetTransition(draggable)
    draggable.classList.remove('dragging');
  });

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