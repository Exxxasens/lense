import React from 'react';
import { COLLECTING, DIFFUSING } from '../constants';
import Controls from './Controls.js';

const Lense = ({ type }) => {
    const canvasRef = React.useRef(null);
    // eslint-disable-next-line
    const [height, setHeight] = React.useState(window.innerHeight);
    // eslint-disable-next-line
    const [width, setWidth] = React.useState(window.innerWidth);
    const [focus, setFocus] = React.useState(null);
    const [scale, setScale] = React.useState(0.5);
    const [itemPosition, setItemPosition] = React.useState(null);
    const [translatePos, setTranslatePos] = React.useState({ x: width / 2, y: height / 2 });
    const [dragOffset, setDragOffset] = React.useState({});
    const [mouseDown, setMouseDown] = React.useState(false);
    const [step, setStep] = React.useState('set-focus');
    const [imageDescription, setImageDescription] = React.useState(null);

    const drawAxis = (ctx) => {
        ctx.beginPath();
        ctx.moveTo(0, -height);
        ctx.lineTo(0, height);
        ctx.moveTo(-width - translatePos.x / scale, 0);
        ctx.lineTo((width - translatePos.x) / scale, 0);
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.closePath();

        if (type === COLLECTING) { // lense is collecting
            drawArrow(ctx, 0, height, 0);
            drawArrow(ctx, 0, -height, 180);
        }

        if (type === DIFFUSING) { // lense is diffusing
            drawArrow(ctx, 0, height, -180);
            drawArrow(ctx, 0, -height, 0);
        }

        // drawArrow(ctx, width / 2, height, 0);
        // drawArrow(ctx, width / 2, -height, 180);

        // drawArrow(ctx, width, height / 2, -90);
        // drawArrow(ctx, -width, height / 2, 90);

        /*
        ctx.font = "300 48px Helvetica";
      
        ctx.arc(256, 0, 5, 0, 2 * Math.PI);
        ctx.fillText("F", 256 - 12, 48);
      
        ctx.arc(512, 0, 5, 0, 2 * Math.PI);
        ctx.fillText("2F", 512 - 24, 48);
      
        ctx.arc(-256, 0, 5, 0, 2 * Math.PI);
        ctx.fillText("F", -256 - 12, 48);
      
        ctx.arc(-512, 0, 5, 0, 2 * Math.PI);
        ctx.fillText("2F", -512 - 24, 48);
        */

    }

    function drawArrow(ctx, x, y, degree) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((degree * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-5, -12);
        ctx.lineTo(5, -12);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    const drawFocus = (ctx) => {
        ctx.font = "300 36px Helvetica";
        ctx.beginPath();
        ctx.arc(focus, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText("F", focus - 10, -10, 42);

        ctx.beginPath();
        ctx.arc(2 * focus, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText("2F", 2 * focus - 20, -10, 42);

        ctx.beginPath();
        ctx.arc(-focus, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText("F", -focus - 10, -10, 42);

        ctx.beginPath();
        ctx.arc(-2 * focus, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText("2F", -2 * focus - 20, -10, 42);
    }

    const drawItem = (ctx, { x, y }) => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();

        if (y > 0) {
            drawArrow(ctx, x, y, 0);
        } else {
            drawArrow(ctx, x, y, 180);
        }

    }

    const drawInfiniteLine = (ctx, point1, point2) => {
        const slope = (point2.y - point1.y) / (point2.x - point1.x)
        const intercept = point2.y - (slope * point2.x)

        function getY(x) { 
            return (slope * x) + intercept; 
        }

        function getX(y) { 
            return (y - intercept) / slope; 
        }
        ctx.beginPath();
        ctx.moveTo(getX(0), 0);
        ctx.lineTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);

        const offsetY = (translatePos.y) / scale;
        const offsetX = (translatePos.x) / scale;

        if (itemPosition.x > 0 && itemPosition.y > 0) {
            ctx.lineTo(-width - offsetX, getY(-width - offsetX));
        }

        if (itemPosition.x > 0 && itemPosition.y < 0) {
            ctx.lineTo(-width - offsetX, getY(-width - offsetX));
        }

        if (itemPosition.x < 0 && itemPosition.y < 0) {
            ctx.lineTo(getX(height + offsetY), height + offsetY);
        }

        if (itemPosition.x < 0 && itemPosition.y > 0) {
            console.log('4')
            ctx.lineTo(getX(-height - offsetY), -height - offsetY);
        }

        ctx.closePath();
        ctx.stroke();

        return {
            slope, intercept
        }
    }

    const getInterception = (eq1, eq2) => {
        const x = (eq2.intercept - eq1.intercept) / (eq1.slope - eq2.slope);
        const y = (eq1.slope * x) + eq1.intercept;
        return {
            x, y
        }
    }

    const handleCanvasClick = (e) => {
        if (step === 'set-focus') {
            const { left } = e.target.getBoundingClientRect();
            setFocus((dragOffset.x - left) / scale);
            return setStep('set-item');
        }
        
        if (step === 'set-item') {
            const { left, top } = e.target.getBoundingClientRect();
            let x = (dragOffset.x - left) / scale;
            let y = (dragOffset.y - top) / scale;

            if (Math.abs(x - focus) < 5) {
                x = Math.abs(focus) * Math.sign(x);
            }

            if (Math.abs(x - 2 * focus) < 5) {
                x = 2 * Math.abs(focus) * Math.sign(x);
            }

            if (Math.abs(y) > Math.abs(height)) {
                y = (y > 0) ? height : -height;
            }

            setItemPosition({ x, y });
            return setStep('draw-image');
        }
    }

    const handleMouseDown = (e) => {
        const x = e.clientX - translatePos.x;
        const y = e.clientY - translatePos.y
        setDragOffset({ x, y });
        setMouseDown(true);
    }

    const handleMouseUp = () => {
        if (mouseDown) setMouseDown(false);
    }

    const handleMouseOut = () => {
        if (mouseDown) setMouseDown(false);
    }

    const handleMouseOver = () => {
        if (mouseDown) setMouseDown(false);
    }

    const handleMouseMove = (e) => {
        if (mouseDown) {
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;
            setTranslatePos({ x, y })
        }
    }

    const increaseScale = (index = 0.8) => {
        return setScale(s => {
            return (2 < (s / index)) ? 2 : s / index;
        });
    }
    const decreaseScale = (index = 0.8) => {
        return setScale(s => {
            return (0.1 > s * index) ? 0.1 : s * index;
        });
    }

    const handleScroll = (e) => {
        console.log(e.wheelDelta);
        if (e.wheelDelta > 0) {
            return setScale(s => s / 0.8);
        }
        return setScale(s => s * 0.8);
    }

    const generateImageDescription = () => {
        if (!focus || !itemPosition) setImageDescription(null);

        const focusAbs = Math.abs(focus);
        const itemPos = Math.abs(itemPosition.x);

        if (itemPos === focusAbs) {
            return setImageDescription('Изображение отсутствует');
        }

        if (itemPos === 2 * focusAbs) {
            return setImageDescription('Изображение действительное, перевернутое, равное');
        }

        if (itemPos > focusAbs && itemPos < 2 * focusAbs) {
            return setImageDescription('Изображение действительное, перевернутое, увеличенное');
        }

        if (itemPos > 2 * focusAbs) {
            return setImageDescription('Изображение действительное, перевёрнутое, уменьшенное');
        }

        if (itemPos < focusAbs) {
            return setImageDescription('Изображение мнимое, прямое, увеличенное')
        } 
 
    }

    const render = (ctx) => {
        drawAxis(ctx);

        if (focus) {
            drawFocus(ctx);
        }

        if (itemPosition && type === COLLECTING) {
            // рисуем предмет
            ctx.lineWidth = 2;
            drawItem(ctx, itemPosition);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(itemPosition.x, itemPosition.y);
            ctx.lineTo(0, itemPosition.y);
            ctx.stroke();
            ctx.closePath();

            ctx.strokeStyle = '#FF5F3C';

            const eq1 = drawInfiniteLine(ctx, { x: 0, y: 0 }, itemPosition);
            const eq2 = drawInfiniteLine(ctx, { x: 0, y: itemPosition.y }, { y: 0, x: -focus });
            const { x, y } = getInterception(eq1, eq2);

            if (Math.abs(focus) > Math.abs(itemPosition.x)) {
                ctx.beginPath();
                ctx.setLineDash([Math.round(5 * scale), Math.round(5 * scale)]);
                ctx.moveTo(0, itemPosition.y);
                ctx.lineTo(x, y);
                ctx.moveTo(itemPosition.x, itemPosition.y);
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            ctx.closePath();

            ctx.lineWidth = 2;
            ctx.strokeStyle = '#3C63FF';
            ctx.fillStyle = '#3C63FF';
            drawItem(ctx, { x, y });
            ctx.lineWidth = 1;
            generateImageDescription();
        }

        if (itemPosition && type === DIFFUSING) {



        }

    }

    const handleReset = () => {
        setItemPosition(null);
        setFocus(null);
        setTranslatePos({ x: width / 2, y: height / 2 });
        setDragOffset({});
        setMouseDown(false);
        setStep('set-focus');
        setImageDescription(null);
    }

    React.useEffect(() => {
        const canvas = canvasRef.current;
        canvas.height = height;
        canvas.width = width;
        const { x, y } = translatePos;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        render(ctx);
        ctx.restore();

        // eslint-disable-next-line
    }, [translatePos, height, width, focus, step, dragOffset, scale]);

    return (
        <div className='lense'>

            <canvas 
                id='canvas' 
                ref={canvasRef} 
                onClick={handleCanvasClick} 
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                onMouseMove={handleMouseMove}
                onScroll={handleScroll}
            />

            <Controls 
                scale={scale}
                step={step}
                reset={handleReset}
                onInc={() => increaseScale()} 
                onDec={() => decreaseScale()} 
                imageDescription={imageDescription}
            />

        </div>
    )
}

export default Lense;