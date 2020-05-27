import React, {useState} from 'react'
import './App.css'
/*import Bezier from 'bezier-js'*/
import {Graphics} from 'pixi.js'
import {PixiComponent, Stage} from '@inlet/react-pixi'

const App = () => {

  const [controlsState, setControlsState] = useState('')
  const [fromPosition, setFromPosition] = useState({x:50, y:50})
  const [toPosition, setToPosition] = useState({x:500, y:500})
  const [cpPosition, setCpPosition] = useState({x:100, y:200})
  const [cp2Position, setCp2Position] = useState({x:200, y:300})

  const getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect()
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  const handleOnMouseMove = (e) => {
    const {x, y}  = getMousePos(e.target, e)
    switch (controlsState) {
      case 'fromControl' :
        setFromPosition({x, y})
        break
      case 'toControl' :
        setToPosition({x, y})
        break
      case 'cpControl' :
        setCpPosition({x,y})
        break
      case 'cp2Control' :
        setCp2Position({x, y})
        break
      default:
        break
    }
  }

  const Bezier = PixiComponent('Bezier', {
    create: props => new Graphics(),
    applyProps: (instance, _, props) => {
      const { fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY } = props;
      instance.clear();
      instance.lineStyle(2, 0x00ffae, 1)
      instance.bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY)
      instance.position.x = fromX
      instance.position.y = fromY
    }
  })

  const ControlRectangle = PixiComponent('Rectangle', {
    create: props => new Graphics(),
    applyProps: (instance, _, props) => {
      const { x, y, width, height, fill, name } = props
      instance.clear()
      instance.beginFill(fill)
      instance.drawRect(x, y, width, height)
      instance.endFill()
      instance.interactive = true
      instance.buttonMode = true
      instance.name = name

      instance.mousedown = () => {
        setControlsState(instance.name)
      }

      instance.mouseup = () => {
        setControlsState('')
      }
    }
  })

  return (
    <Stage width={1000} height={700} onMouseMove={handleOnMouseMove}>
      <Bezier
        fromX={fromPosition.x}
        fromY={fromPosition.y}
        cpX={cpPosition.x-fromPosition.x}
        cpY={cpPosition.y-fromPosition.y}
        cpX2={cp2Position.x-fromPosition.x}
        cpY2={cp2Position.y-fromPosition.y}
        toX={toPosition.x-fromPosition.x}
        toY={toPosition.y-fromPosition.y}
      />
      <ControlRectangle
        x={fromPosition.x-5}
        y={fromPosition.y-5}
        width={10}
        height={10}
        fill={0x2fff00}
        name={'fromControl'}
      />
      <ControlRectangle
        x={cpPosition.x-5}
        y={cpPosition.y-5}
        width={10}
        height={10}
        fill={0xa7ff95}
        name={'cpControl'}
      />
      <ControlRectangle
        x={cp2Position.x-5}
        y={cp2Position.y-5}
        width={10}
        height={10}
        fill={0xff00e4}
        name={'cp2Control'}
      />
      <ControlRectangle
        x={toPosition.x - 5}
        y={toPosition.y - 5}
        width={10}
        height={10}
        fill={0xff00e4}
        name={'toControl'}
      />
    </Stage>
  )
}

export default App
