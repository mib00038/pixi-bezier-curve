import React from "react";
import {PixiComponent} from "@inlet/react-pixi";
import {Graphics} from "pixi.js";

export const ControlRectangle = PixiComponent('Rectangle', {
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

    instance.mousedown = (e) => {
      e.stopPropagation()

      if (props.viewPort) {
        console.log({viewPort: props.viewPort})

        if (props.viewPort.lastViewport.scaleX !== 1.0) {
          console.log('Ajust!!')
          props.viewPort.setZoom(1.0, true)
        } else {
          props.setControlsState(instance.name)
        }
      }
    }

    instance.mouseup = () => {
      if (name !== "step") {
        props.setControlsState('')
      }
    }
  }
})

const ControlPoints = ({ fromPosition, cpPosition, cp2Position, toPosition, viewPort, setControlsState }) => {
  return (
    <>
      <ControlRectangle
        x={fromPosition.x - 5}
        y={fromPosition.y - 5 }
        width={10}
        height={10}
        fill={0x2fff00}
        name={'fromControl'}
        viewPort={viewPort}
        setControlsState={setControlsState}
      />
      <ControlRectangle
        x={cpPosition.x - 5}
        y={cpPosition.y - 5}
        width={10}
        height={10}
        fill={0xa7ff95}
        name={'cpControl'}
        viewPort={viewPort}
        setControlsState={setControlsState}
      />
      <ControlRectangle
        x={cp2Position.x - 5}
        y={cp2Position.y - 5}
        width={10}
        height={10}
        fill={0xff00e4}
        name={'cp2Control'}
        viewPort={viewPort}
        setControlsState={setControlsState}
      />
      <ControlRectangle
        x={toPosition.x - 5}
        y={toPosition.y - 5}
        width={10}
        height={10}
        fill={0xff00e4}
        name={'toControl'}
        viewPort={viewPort}
        setControlsState={setControlsState}
      />
    </>
  )
}

export default ControlPoints