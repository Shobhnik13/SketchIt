'use client'
import { useDraw } from '@/hooks/useDraw'
import { drawLine } from '@/utils/drawLine'
import {useEffect, useState} from 'react'
import {ChromePicker} from 'react-color'
import { io } from "socket.io-client";
const socket = io("http://localhost:3001");

type drawLineProps={
  prevPoint:Point | null,
  currentPoint:Point,
  color:string,
}

export default function Home() {
  const {canvasRef,onMouseDown,clear}=useDraw(createLine)
  const [color,setColor]=useState<string>('#000')

  //listening events from server that are coming to client except the senders client
  useEffect(()=>{
    const ctx=canvasRef.current?.getContext('2d')
    //and this event is for whenever the page reloads
    //we fire an event that says client ready
    //this is done so that after drawing in client x whenever we open a client y so the same drawing would be propogtaed from x to y
    socket.emit('client-ready')
    socket.on('get-canvas-state',()=>{
      if(!canvasRef.current?.toDataURL())return 
      socket.emit('this-is-canvas-state',canvasRef.current.toDataURL())
    })
    socket.on('canvas-state-from-server',(state:string)=>{
        console.log('client received the canvas state from server!')
        const img=new Image()
        img.src=state
        img.onload=()=>{
          ctx?.drawImage(img,0,0)
        }

    })

    //this sevent is for receving the drawing to client except the senders clent 
    socket.on('draw-line',({prevPoint,currentPoint,color}:drawLineProps)=>{
        if(!ctx)return 
        drawLine({prevPoint,currentPoint,color,ctx})
    })

    //this event is to fire clear
    socket.on('clear',clear)
    return ()=>{
      socket.off('get-canvas-state')
      socket.off('canvas-state-from-server')
      socket.off('draw-line')
      socket.off('clear')
    }
  },[canvasRef])
  
  //now when we will get the event as draw-line from server then we will fire the createLine i.e which contains drawLine function inside to draw the line
  function createLine({prevPoint,currentPoint,ctx}:Draw){
      socket.emit('draw-line',{prevPoint,currentPoint,color})
      drawLine({prevPoint,currentPoint,ctx,color})
  }
  return (
    <div className='h-screen w-screen flex items-center justify-center gap-x-4'>
    <div className='flex flex-col pr-10 gap-10'>
      <ChromePicker color={color}  onChange={(e)=>setColor(e.hex)} />
      <button onClick={()=>socket.emit('clear')} className='p-2 rounded-md border border-black'>Clear canvas</button>
    </div>
      <canvas onMouseDown={onMouseDown} ref={canvasRef} height={650} width={750} className='border border-black rounded-md'/>
    </div>
    )
}
