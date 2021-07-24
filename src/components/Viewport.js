import React, {useEffect} from "react";
import * as PIXI from "pixi.js";
import { PixiComponent, useApp } from "@inlet/react-pixi";
import { Viewport as PixiViewport } from "pixi-viewport";

const PixiComponentViewport = PixiComponent("Viewport", {
  applyProps: (instance, _props, props) => {
    console.log({controlsState: props.controlsState})

    instance.mousedown = () => {
      // instance.setZoom(1.0, true);
    }
    instance.mouseup = () => {
      props.setHitArea(instance.hitArea)
    }
  },
  create: (props) => {
    const viewport = new PixiViewport({
      screenWidth: props.width,
      screenHeight: props.height,
      worldWidth: props.width * 2,
      worldHeight: props.height * 2,
      ticker: props.app.ticker,
      interaction: props.app.renderer.plugins.interaction
    });
    viewport.drag().pinch().wheel().clampZoom()
    props.setViewPort(viewport)

    return viewport
  }
});

const Viewport = (props) => {
  const app = useApp()

  return <PixiComponentViewport app={app} {...props} />
};

export default Viewport