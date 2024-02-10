type drawLineProps=Draw & {
  color:string,
}

export const drawLine=({prevPoint,currentPoint,ctx,color}:drawLineProps)=>{
const { x:currX , y:currY }=currentPoint
    const strokeStyle=color
    const lineWidth=5
    
    let startPoint=prevPoint ?? currentPoint
    ctx.beginPath() 
    
    ctx.lineWidth=lineWidth
    ctx.strokeStyle=strokeStyle
    ctx.moveTo(startPoint.x,startPoint.y)
    ctx.lineTo(currX,currY)
    ctx.stroke()

    ctx.fillStyle=strokeStyle
    ctx.beginPath()
    ctx.arc(startPoint.x,startPoint.y,2,0,2*Math.PI)
    ctx.fill()
}