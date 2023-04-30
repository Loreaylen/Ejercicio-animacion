const draggables = document.querySelectorAll('.draggable'),
  pieceContainer = document.querySelectorAll('.pieceNode'),
  secondContainer = document.querySelector('.secondContainer'),
  regex = /(piece)/g;
let mousePosition = { x: null, y: null },
  mouseDown = false,
  selectedDraggable = null,
  pieceNumberOfDraggable = null,
  diff = { x: null, y: null }, // para que el mouse pueda arrastrar al draggable al lugar correcto
  resetTransition = false,
  transitionTime = 400;

  console.log([...pieceContainer])
// Función para buscar la clase con el número de la pieza
const getPieceClass = (element) => {
  return Object.values(element.classList).find(el => regex.test(el))
}

 // el offset debería calcular la distancia entre el draggable que estoy arrastrando y la pieza más cercana
// para calcular la cercanía debería usar la posición en la que está el draggable y ver cuál es el container más cercano
// se usa y porque necesito ver qué tan lejos está en relación al número negativo
// y - top de la caja - height de la caja / 2

const getClosestContainer = (draggable) => {
  const listOfPieceContainers = [...pieceContainer];
  return listOfPieceContainers.reduce((closest, curr) => {
    const draggableRect = draggable.getBoundingClientRect();
    const containerRect = curr.getBoundingClientRect();
    console.log('draggableRect', draggableRect)
  console.log('containerRect', containerRect)
  const containerCenterX = containerRect.left + containerRect.width / 2;
  const containerCenterY = containerRect.top + containerRect.height / 2;
  const distance = (draggableRect.left - containerCenterX) ** 2 + (draggableRect.top - containerCenterY) ** 2;

if (distance < closest.distance) {
  return {distance: distance, element: curr}
}
else return closest
  }, {distance: Infinity }).element
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
  // const initial = draggable.getBoundingClientRect();

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
    pieceNumberOfDraggable = getPieceClass(draggable)
    
  })

  draggable.addEventListener('mouseup', e => {
    mouseDown = false
    console.log(getClosestContainer(draggable))
  });

})

// en la función mousemove comprobar la clase del elemento que seleccioné con el del contenedor en el que se encuentra (piece)
// Si los nombres de las clases coinciden,  impido mover el elemento con un booleano

//para el mousedown hago la misma comprobación de las clases (capaz sea mejor separarla en una función aparte)
// Si coinciden, meto el draggable en su contenedor, sino, disparo la animación para volver a su posición original


// const draggableOne = document.querySelector('#draggableOne')
// const dragRect = draggableOne.getBoundingClientRect()
// console.log(dragRect.top, dragRect.left)
// console.log(draggableOne.offsetX, draggableOne.offsetY)


// TODO:
/*
-Agregar todos los 'nodos' para las piezas y acomodarlos
-Cambiar los nombres de las clases -> los cuadraditos tienen que tener la clase 'pieceNode' y tanto el nodo como la pieza tienen que tener el número en una clase,
la pieza va a tener un id con el número (para el clip-path) --> buscar sugerencias para nombrar las clases
- Ajustar la función que calcula el offset para que sólo devuelva la pieza más cercana si tiene un offset de 15x15 respecto al contenedor
(de lo contrario se desencadena la animación para volver a la posición original)
- Si el número de la pieza coincide con el del nodo, entonces appendChild a la sección (tal vez conviene meter los nodos dentro de una sección)

Luego de resolver la funcionalidad del rompecabezas:
- Reemplazar por imágenes las piezas
- Desarrollar una función que cuente cuántos nodos están completos, si llega al total entonces se activa la animación final
 */