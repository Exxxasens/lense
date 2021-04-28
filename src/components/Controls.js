import React from 'react';
import Button from './Button';
import PageContext from './PageContext';
import { MAIN_PAGE } from '../constants';

const Controls = ({ step, scale, onInc, onDec, reset, imageDescription }) => {
    const { setPage } = React.useContext(PageContext);
    let title = null;

    if (step === 'set-focus') {
        title = 'Пожалуйста, установите точку фокуса линзы'
    }

    if (step === 'set-item') {
        title = 'Пожалуйста, установите предмет';
    }

    return (
        <div className='controls'>

            <div className='title'>
                { title }
            </div>

            <div className='inline'>
                <Button onClick={reset}>
                    Построить заново
                </Button>

                <Button onClick={() => setPage(MAIN_PAGE)}>
                        На главную страницу
                </Button>
            </div>

            <div className='title'>
                { imageDescription }
            </div>


            <div className='inline'>
                <Button onClick={onInc} className='inc-btn'>
                    +
                </Button>
                <Button onClick={onDec} className='dec-btn'>
                    -
                </Button>
                <div>
                    Масштаб: { scale.toFixed(3) }x
                </div>
            </div>
        </div>
    )
    
}

export default Controls;