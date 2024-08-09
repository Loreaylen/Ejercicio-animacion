import './PieceContainer.css'
import { useRef } from 'react'
import  Moveable  from "react-moveable"

export default function PieceContainer() {
  const targetRef = useRef(null)

  return(
    <section className='pieceContainer'>
    <h2>Contenedor de piezas</h2>
    <div className='moveable' ref={targetRef}></div>
    <Moveable
    target={document.querySelector(".moveable")}
    container={null}
    draggable={true}
    throttleDrag={0}
    onDragStart={({ target, clientX, clientY }) => {
        console.log("onDragStart", target);
    }}
    onDrag={e => {
        e.target.style.transform = e.transform;
    }}
    onDragEnd={({ target, moveable, isDrag, clientX, clientY }) => {
        console.log("onDragEnd", target, isDrag);
        targetRef.current = null
    }}
    />
    </section>
  );
}