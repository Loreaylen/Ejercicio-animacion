const draggables = document.querySelectorAll('.draggable');
const pieceContainer = document.querySelectorAll('.pieceContainer');
const regex = /(piece)/g;

// Lista de contenedores para las piezas
draggables.forEach((draggable) => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging')
  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
  })

})

pieceContainer.forEach((container) => {
  container.addEventListener('dragover', e => {
    e.preventDefault()
    const currDraggable = document.querySelector('.dragging');
    const pieceNumber = Object.values(currDraggable.classList).find((el) => regex.test(el));
    container.appendChild(currDraggable);
  })

})



