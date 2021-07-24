import React, {useEffect, useState} from 'react'
import './App.css'
import BezierCurve from 'bezier-js'
import {jsBezier} from 'jsbezier'
import {CubicBezierCurve, Vector2} from 'three'

import {Graphics} from 'pixi.js'
import {PixiComponent, Stage, useApp} from '@inlet/react-pixi'
import Viewport from "./components/Viewport"
import { useDebounce, useDebouncedCallback } from 'use-debounce'
import ControlPoints, {ControlRectangle} from "components/ControlPoints";

const App = () => {
  const [controlsState, setControlsState] = useState('')
  const [fromPosition, setFromPosition] = useState({ x: 50, y: 50 })
  const [toPosition, setToPosition] = useState({ x: 500, y: 500 })
  const [cpPosition, setCpPosition] = useState({ x: 100, y: 300 })
  const [cp2Position, setCp2Position] = useState({ x: 200, y: 100 })
  const [steps, setSteps] = useState([])
  const [spacePoints2, setSpacePoints2] = useState([])
  const [hitArea, setHitArea] = useState({ x: 0, y:0 })
  const [viewPort, setViewPort] = useState()

  useEffect(() => {
    let curve = new CubicBezierCurve(
      new Vector2( fromPosition.x, fromPosition.y ),
      new Vector2( cpPosition.x, cpPosition.y ),
      new Vector2( cp2Position.x, cp2Position.y ),
      new Vector2( toPosition.x, toPosition.y )
    )
    const spacePoints = curve.getSpacedPoints ( 10 )

    let bezierJSCurve = new BezierCurve(
      fromPosition.x, fromPosition.y,
      cpPosition.x, cpPosition.y,
      cp2Position.x, cp2Position.y,
      toPosition.x, toPosition.y
    )

    const jsBezierCurve =
      [
        {x:fromPosition.x, y:fromPosition.y},
        {x:cpPosition.x, y:cpPosition.y},
        {x:cp2Position.x, y:cp2Position.y},
        {x:toPosition.x, y:toPosition.y}
      ]

    const nearestPointsOnCurve = spacePoints.map(p => {
      const {point, location} = jsBezier.nearestPointOnCurve(p, jsBezierCurve)
      const nv = bezierJSCurve.normal(location);
      return {pt: point, nv, t: location}
    })

    setSteps(spacePoints)
    setSpacePoints2(nearestPointsOnCurve)

  }, [fromPosition, cpPosition, cp2Position, toPosition, setSteps, setSpacePoints2])


  useEffect(() => {
    console.log({ hitArea })
  }, [hitArea])

  useEffect(() => {
    console.log({ viewPort })
  }, [viewPort])

  const getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect()
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  const handleOnMouseMove = (e) => {
    const {x, y}  = getMousePos(e.target, e)
    // console.log('handleOnMouseMove', { e, controlsState })

    switch (controlsState) {
      case 'fromControl' :
        setFromPosition({ x: x + hitArea.x, y: y + hitArea.y })
        break
      case 'toControl' :
        setToPosition({ x: x + hitArea.x, y: y + hitArea.y })
        break
      case 'cpControl' :
        setCpPosition({ x: x + hitArea.x, y: y + hitArea.y })
        break
      case 'cp2Control' :
        setCp2Position({ x:  x + hitArea.x, y: y + hitArea.y })
        break
      default:
        break
    }
  }

  const Line  = PixiComponent('Line', {
    create: props => new Graphics(),
    applyProps: (instance, _, props) => {
      const {pt, t, nv} = props

      instance.clear();
      instance.lineStyle(1, 0x00ffae, 1)
      instance.moveTo(pt.x,pt.y)
      instance.lineTo(pt.x + 40*nv.x, pt.y + 40*nv.y)
      instance.endFill()
    }
  })

  const Bezier = PixiComponent('Bezier', {
    create: props => new Graphics(),
    applyProps: (instance, _, props) => {
      const { fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY } = props

      instance.clear();
      instance.lineStyle(2, 0x00ffae, 1)
      instance.bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY)
      instance.position.x = fromX
      instance.position.y = fromY
    }
  })

  return (
    <Stage width={1000} height={700} onMouseMove={handleOnMouseMove}>
      <Viewport width={1000} height={700} {...{ setHitArea, setViewPort, controlsState }}>
          {steps.map(({x,y}, index) => (
            <ControlRectangle
              key={index}
              x={x - 5}
              y={y - 5}
              width={10}
              height={10}
              fill={0xfffbb7}
              name={'step'}
            />
          ))}
          <Bezier
            fromX={fromPosition.x}
            fromY={fromPosition.y}
            cpX={cpPosition.x - fromPosition.x}
            cpY={cpPosition.y - fromPosition.y}
            cpX2={cp2Position.x - fromPosition.x}
            cpY2={cp2Position.y - fromPosition.y}
            toX={toPosition.x - fromPosition.x}
            toY={toPosition.y - fromPosition.y}
          />
          {spacePoints2.map(({pt, t, nv}, index) => (
            <Line
              key={index}
              {...{pt, t, nv}}
            />
          ))}
        <ControlPoints {...{ fromPosition, cpPosition, cp2Position, toPosition, viewPort, setControlsState }} />
      </Viewport>
    </Stage>
  )
}

export default App
