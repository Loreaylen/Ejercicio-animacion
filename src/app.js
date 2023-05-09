const secondContainer = document.querySelector(".secondContainer"),
  crackGlass = document.querySelector("#crackGlass"),
  tappingGlass = document.querySelector("#tappingGlass"),
  chimes = document.querySelector("#chimes"),
  fluteSong = document.querySelector("#fluteSong"),
  womanVideo = document.querySelector("#womanVideo"),
  piece = /(piece)/g,
  inside = /(inside)/g;

let mousePosition = { x: null, y: null },
  mouseDown = false, // para que el elemento deje de cambiar de posición si se suelta el mouse
  selectedDraggable = null, // Para la función de mousemove
  diff = { x: null, y: null }, // para que el mouse pueda arrastrar al draggable al lugar correcto
  startX = 0,
  startY = 0,
  startedAnimation = false;

// Función para buscar la clase con el número de la pieza
const getPieceClass = (element, regex) => {
  return (
    Object.values(element?.classList).find((el) => regex.test(el)) || false
  );
};
// Aylen
const getClosestContainer = (childOfDrag) => {
  const listOfPieceContainers = [...$('.pContainer')];
  // const childRect = childOfDrag.getBoundingClientRect();
  // ---- Testeando offset para reemplazar getBoundingClientRect, devuelve error si el objeto no fue seleccionado con jquery, devuelve undefined
   const childOffset = childOfDrag.offset()
  
  // console.log('childRect x', childRect.x, 'childRect y', childRect.y)
  const closestmap = listOfPieceContainers.map((container) => {
    const containerRect = $(container).offset()
    const distanceX = childOffset.left - containerRect.left;
    const distanceY = childOffset.top - containerRect.top;
    const distance = Math.hypot(distanceX ** 2 + distanceY ** 2);
    return { distance: distance, container: $(container) };
  });

  const filtered = closestmap.filter((container) => {
    if (container.distance <= 450) {
      return container;
    } else return false;
  });
  return filtered.length === 0 ? false : filtered[0].container;
};

// Aylen
const matchClass = (draggable, child, resultclass) => {
  const pieceNumber = getPieceClass(child, piece);
  const matchTo = getPieceClass(resultclass, piece);
  const parentNode = resultclass.parentNode; // El contenedor padre del nodo para encajar la pieza (rectángulos)
  if (pieceNumber === matchTo) {
    parentNode.appendChild(draggable);
    draggable.classList.remove("draggable");
    draggable.removeAttribute("style");
    draggable.classList.add("inside");
    setTimeout(() => {
      chimes.play();
    }, 0);
  } else {
    tappingGlass.play();
    draggable.style.opacity = "0.3";
  }
};
// comprobar cuántas piezas hay en su lugar
const checkInsidePieces = () => {
  const insidePieces = [...document.querySelectorAll(".inside")];
  if (insidePieces.length === 28) {
    startedAnimation = true;
    initAnimation(insidePieces);
  } else return;
};

// Iniciar animación final
// Arreglar el detalle de la animación
const initAnimation = (insidePieces) => {
  for (let piece of insidePieces) {
    piece.classList.add("toOpacity0");
  }
  womanVideo.classList.add("toOpacity1");
  setTimeout(() => {
    womanVideo.classList.remove("invisible");
    crackGlass.currentTime = 8;
    crackGlass.play();
  }, 0);

  setTimeout(() => {
    for (let piece of pieceContainer) {
      piece.classList.add("invisible");
    }
  }, 3000);

  setTimeout(() => {
    womanVideo.play();
    womanVideo.loop = true;
    fluteSong.play();
  }, 3100);

  setTimeout(() => {
    womanVideo.loop = false;
  }, 30900);
};

const mouseUpFunction = (draggable) => {
  mouseDown = false;
  const child = $(draggable).children();
  const match = getClosestContainer(child);
  if (match) {
    // matchClass($(draggable), child, match);
  } else {
    draggable.style.opacity = "0.3";
    tappingGlass.play();
  }

  draggable.classList.remove("dragging");
  if (!startedAnimation) {
    checkInsidePieces();
  }
};

const mouseDownFunction = (e, draggable) => {
  startX = e.clientX;
  startY = e.clientY;
  if (!mousePosition || getPieceClass(draggable, inside)) return;

  mouseDown = true;
  selectedDraggable = draggable; // Seleccionar el draggable
  diff.y = mousePosition.y - draggable.offsetTop; // Calcula la diferencia entre la posición del mouse y la posición del draggable para que quede debajo del mouse
  diff.x = mousePosition.x - draggable.offsetLeft; 
  
  $(draggable).css({
    zIndex: "1000",
    opacity: '1'
  })
  .addClass('dragging')
};

// Aylen
window.addEventListener("mousemove", (e) => {
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY;
  if (!mouseDown) return; // No se va a activar si el mouseDown es false

  let offsetY = mousePosition.y - diff.y; // Calcula la posición en la que va a quedar el draggable
  let offsetX = mousePosition.x - diff.x;

  $(selectedDraggable).css({
    top: `${offsetY}px`,
    left: `${offsetX}px`
  }) // Asigno la posición en la que va a quedar el draggable cuando lo suelte
  
});

$('.draggable').each( function(i, el){
  
  $(el).on("mousedown", (e) => {
    mouseDownFunction(e, el);
  });

  $(el).on("mouseup", (e) => {
    mouseUpFunction(el);
  });
});

/*
IMPLEMENTAR  DESPUÉS

// const ids = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twentyOne', 'twentyTwo', 'twentyThree', 'twentyFour', 'twentyFive', 'twentySix', 'twentySeven', 'twentyEight']

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
*/

/*
BUGS
- Hacer scroll mientras arrastro una pieza hace que se corra el mouse de encima de la pieza y no te deje soltarla
- Bug en el comienzo de la animación, la última pieza desaparece y vuelve a aparecer cuando comienza

*/
