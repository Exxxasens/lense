import React from 'react';
import Button from './Button';
import PageContext from './PageContext';
import { DIFFUSING, COLLECTING, MAIN_PAGE, LENSE_PAGE } from '../constants'; 
import Lense from './Lense';

const App = () => {
    const [lense, setLense] = React.useState();
    const [page, setPage] = React.useState(MAIN_PAGE);

    const setCollecting = () => {
        setLense(COLLECTING);
        setLensePage();
    }

    const setDiffusing = () => {
        setLense(DIFFUSING);
        setLensePage();
    }

    const setLensePage = () => {
        setPage(LENSE_PAGE);
    }

    let content = null;

    if (page === LENSE_PAGE) {
        content = (
            <Lense type={lense}/>
        )
    }

    if (page === MAIN_PAGE) {
        content = (
            <>
                <div className='header'>
                    <h1>
                        Построение изображений 
                    </h1>
                </div>
                <div className='content'>
                    <div>
                        Пожалуйста, выберите тип линзы
                    </div>
                    <div>
                        <Button onClick={setCollecting}>
                            Собирающая
                        </Button>
                        <Button onClick={setDiffusing}>
                            Рассеивающая
                        </Button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className='app'>
            <PageContext.Provider value={{ page, setPage }}>
                { content }
            </PageContext.Provider>
        </div>

    )
}

export default App;