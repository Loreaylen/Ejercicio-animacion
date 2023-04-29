const draggables = document.querySelectorAll('.draggable'),
  pieceContainer = document.querySelectorAll('.pieceContainer'),
  secondContainer = document.querySelector('.secondContainer'),
  regex = /(piece)/g;
let mousePosition = { x: null, y: null },
  mouseDown = false,
  selectedDraggable = null,
  diff = { x: null, y: null },
  resetTransition = false,
  transitionTime = 400;


window.addEventListener('mousemove', e => {
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY
  console.log(mousePosition)
  if (!mouseDown) return;

  let offsetY = mousePosition.y - diff.y;
  let offsetX = mousePosition.x - diff.x;
  selectedDraggable.style.top = offsetY + 'px';
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
  })

  draggable.addEventListener('mouseup', e => mouseDown = false);


})

// en la función mousemove comprobar la clase del elemento que seleccioné con el del contenedor en el que se encuentra (piece)
// Si los nombres de las clases coinciden,  impido mover el elemento con un booleano

//para el mousedown hago la misma comprobación de las clases (capaz sea mejor separarla en una función aparte)
// Si coinciden, meto el draggable en su contenedor, sino, disparo la animación para volver a su posición original




