const draggables = document.querySelectorAll('.draggable'),
  pieceContainer = document.querySelectorAll('.pContainer'),
  secondContainer = document.querySelector('.secondContainer'),
  regex = /(piece)/g;

let mousePosition = { x: null, y: null },
  mouseDown = false,
  selectedDraggable = null,
  pieceNumberOfDraggable = null,
  diff = { x: null, y: null }, // para que el mouse pueda arrastrar al draggable al lugar correcto
  resetTransition = false,
  transitionTime = 400;

// Función para buscar la clase con el número de la pieza
const getPieceClass = (element) => {
  return Object.values(element.classList).find(el => regex.test(el))
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

const matchClass = (currdrag, resultclass) => {

const matchTo = getPieceClass(resultclass)


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
    if (!mousePosition || resetTransition) return;

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
  })

  draggable.addEventListener('mouseup', e => {
    mouseDown = false
    const child = draggable.children[0]
    const match = getClosestContainer(child)
    match ? matchClass(draggable, match) : false
    draggable.classList.remove('dragging');
  });

})

// en la función mousemove comprobar la clase del elemento que seleccioné con el del contenedor en el que se encuentra (piece)
// Si los nombres de las clases coinciden,  impido mover el elemento con un booleano

//para el mousedown hago la misma comprobación de las clases (capaz sea mejor separarla en una función aparte)
// Si coinciden, meto el draggable en su contenedor, sino, disparo la animación para volver a su posición original





// TODO:
/*
-Agregar todos los 'nodos' para las piezas y acomodarlos X
-Cambiar los nombres de las clases -> los cuadraditos tienen que tener la clase 'pieceNode' y tanto el nodo como la pieza tienen que tener el número en una clase,
la pieza va a tener un id con el número (para el clip-path) --> buscar sugerencias para nombrar las clases
- Ajustar la función que calcula el offset para que sólo devuelva la pieza más cercana si tiene un offset de 15x15 respecto al contenedor
(de lo contrario se desencadena la animación para volver a la posición original)
- Si el número de la pieza coincide con el del nodo, entonces appendChild a la sección (tal vez conviene meter los nodos dentro de una sección)

Luego de resolver la funcionalidad del rompecabezas:
- Reemplazar por imágenes las piezas
- Desarrollar una función que cuente cuántos nodos están completos, si llega al total entonces se activa la animación final
 */