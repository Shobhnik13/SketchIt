
import { useEffect,useState, useRef } from "react"

export const useDraw=(onDraw:({ctx,currentPoint,prevPoint}: Draw)=>void)=>{
    //first we need a ref whenever mouse comes on canvas area in html
    const canvasRef=useRef<HTMLCanvasElement>(null)
    const prevPoint=useRef<null | Point>(null)
    //now wheenver the pointer will be at canvas then a current object will be passed on the canvas ref from useref
    //and now we have ref so we need to proceed further
    //so whenever this hook is called we need to run the use effect
    //this use effect will now add an event listener on the ref
    const [mouseDown,setMouseDown]=useState(false)
    const onMouseDown=()=>setMouseDown(true)
    
    const clear=()=>{
        const canvas=canvasRef.current
        // andar hi nhi h canvas ke 
        if(!canvas)return
        // kuch drwa hi nhi kia canvas ke andar
        const ctx=canvas.getContext('2d')
        if(!ctx)return

        ctx.clearRect(0,0,canvas.width,canvas.height)
    }

    useEffect(()=>{
        const handler=(e:MouseEvent)=>{
            if(!mouseDown)return;
            const currentPoint=computePoints(e)
            const ctx=canvasRef.current?.getContext('2d')
            //as we are using the useref of a HTMLCanvasElement so when we will get the current obj on canvasRef 
            //then it means we are in the canvas ele so we can access the context of a canvas ele by HTMLCanvasElement.getcontext()
            //but here our HTMLCanvasElemnt is a ref which will be there when canvasRef.current exist
            //so thats why canvasRef.current.getcontext will mean the same as HTMLCanvasElement.getcontext due to using a ref
            if(!ctx || !currentPoint)return 

            //now we need the prev point 
            //so we will create a ref to prev point 
            // whenever we draw the new line the prev point for that line will be the current point of the prev line
            onDraw({ctx,currentPoint,prevPoint:prevPoint.current})
            prevPoint.current=currentPoint

        }
        //as these x and y coordinates are wrt to page
        //and we need x and y coords wrt to that canvas ele
        const computePoints=(e:MouseEvent)=>{
            //first we need to check that the pointer is in that area or not
            //so we will check if canvasref has a current object or not
            const canvas=canvasRef.current
            if(!canvas) return 
            //if there is ref
            //then gather coordinates from the canvasref.current i.e. canvas
            const rect=canvas.getBoundingClientRect()
            // this getboundingclientref will tell the left and top padding and margin i.e applied to the HTMLelement
            //so that we can subtract that value from the overall coords and get the coords wrt to ele not wrt page
            //pagex page y we have
            //so x-rect.left will give the x coord wrt to ele
            const x=e.clientX-rect.left 
            const y=e.clientY-rect.top
            return {x,y}
        }
        const mouseUpHandler=()=>{
            setMouseDown(false);
            prevPoint.current=null
        }
        canvasRef.current?.addEventListener('mousemove',handler)
        window.addEventListener('mouseup',mouseUpHandler)
        return ()=>{
            canvasRef.current?.removeEventListener('mousemove',handler)
            window.removeEventListener('mouseup',mouseUpHandler)
        }
    },[onDraw])

    return { canvasRef,onMouseDown,clear } 
}