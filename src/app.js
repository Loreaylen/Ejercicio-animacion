const draggables = document.querySelectorAll('.draggable'),
      pieceContainer = document.querySelectorAll('.pieceContainer'),
      secondContainer = document.querySelector('.secondContainer'),
      regex = /(piece)/g;


// Lista de divs arrastrables, a cada uno le agrego una clase dragging cuando empiece a arrastrarse
// Cuando lo suelte se eliminará la clase 
draggables.forEach((draggable) => {
  const initial = draggable.getBoundingClientRect();

  draggable.addEventListener('dragstart', e => {
    draggable.classList.add('dragging')
    console.log(e.dataTransfer.effectAllowed)
    setTimeout(() => draggable.classList.add('invisible', 0))
  })

  draggable.addEventListener('dragend', () => {
    const isContainer = Object.values(draggable.parentNode.classList).includes('pieceContainer')
    console.log(isContainer)
    draggable.classList.remove('dragging')
    draggable.classList.remove('invisible')
      
    })
    
  })


// Para cada contenedor de piezas agrego un evento dragover
// La función devuelve el elemento más cercano según la posición del mouse en ese momento
// Guardo el nombre de la clase que coincida con "piece", hago lo mismo con el elemento arrastrado
// Si los nombres de las clases coinciden, meto el arrastrado al contenedor y le saco el draggable


pieceContainer.forEach((container) => {
  container.addEventListener('dragover', e => {
    const x = e.clientX;
    const y = e.clientY;

    const closestDiv = document.elementFromPoint(x,y);
    const closestPiece = Object.values(closestDiv.classList).find((el) => regex.test(el));
   
    const currDraggable = document.querySelector('.dragging');
    const pieceNumber = Object.values(currDraggable.classList).find((el) => regex.test(el));

    if(closestPiece === pieceNumber){
      e.preventDefault();
      container.appendChild(currDraggable);
      currDraggable.draggable = false;
    }
  })

})



