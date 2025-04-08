import { useEffect, useState } from 'react';
import './App.css';
import PuzzleContainer, { PuzzleConfig } from './PuzzleContainer';
import ReactConfetti from 'react-confetti';
import * as Constants from './Constants';
import { shareNative } from './ShareUtil';
import { getPuzzleCount, getPuzzleKeyFromOrder } from './CookieUtils';
import ReactGA from 'react-ga4';

const TRACKING_ID = 'G-MDN6H7712Z';

const CONFETTI_PROPS = {
  // initialVelocityX: 3000,
  // initialVelocityY: 300000,
  friction: 0.995,
  gravity: 0.5,
  recycle: false,
  numberOfPieces: 100,
  tweenDuration: 500,
  // confettiSource: {x: window.innerWidth / 2, y: 0, w: window., h: 0}
}

function App() {
  const [pageIndex, setPageIndex] = useState(0);
  const [runConfetti, setRunConfetti] = useState(false);

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    ReactGA.send({ hitType: "pageview", page: "/", title: "Sababushka Page"})
  })

  const handleFinish = (_score: number) => {
    // setFinalScore(score);
    // setIsComplete(true);

    setRunConfetti(true);
    setTimeout(() => {
      setRunConfetti(false);
    }, 5000);
  };

  const movePage = (newIndex: number) => {
    if (newIndex < 0)
      newIndex = 0;
    if (newIndex > getPuzzleCount())
      newIndex = getPuzzleCount();

    setPageIndex(newIndex);
  }

  const puzzleConfig: PuzzleConfig = {
    puzzleKey: getPuzzleKeyFromOrder(pageIndex),
    puzzleDisplayName: `שלב ${pageIndex + 1}`,
    startText: null,
    endText: null,
    showContinueButton: true,
    showScore: true,
  }

  if (pageIndex == 0) {
    puzzleConfig.startText = Constants.INFO_LEVEL_1_START;
    puzzleConfig.endText = Constants.INFO_LEVEL_1_END;
    puzzleConfig.showScore = false;
  }

  if (pageIndex == 1) {
    puzzleConfig.startText = Constants.INFO_LEVEL_2_START;
    // puzzleConfig.endText = Constants.INFO_LEVEL_2_END;
    // puzzleConfig.showScore = false;
  }

  // if (pageIndex == PUZZLES.length - 1) {
  //   puzzleConfig.showContinueButton = false;
  // }

  // TODO fix this weenie ass switch

  return (
    <>
      <div className='puzzle-container'>
        <div className='puzzle-header'>
          <h1>[סבבושקה]</h1>
          <div className='pagination'>
            <button className='pagination-arrow' onClick={_ => movePage(pageIndex - 1)}>{'<'}</button>
            {/* {PUZZLES.map((_puzzleKey, i) => {
            return (<span className={'pagination-dot' + (i === pageIndex ? ' active' : '')}>•</span>);
          })} */}
            <button className='pagination-arrow' onClick={_ => movePage(pageIndex + 1)}>{'>'}</button>
          </div>
        </div>
        {(pageIndex < getPuzzleCount()) ? <PuzzleContainer
          key={pageIndex}
          config={puzzleConfig}
          onFinish={handleFinish}
          onContinue={() => movePage(pageIndex + 1)}
        /> : <div className='end-screen'>
          <h3>אלו כל השלבים לעת עתה!</h3>

          <p>שלבים חדשים יתווספו ממש לפה בקרוב (:</p>
          <div className='flex-expand'/>
          <div className='button-group'>
          <p>אהבת את המשחק? שתף עם חברים:</p>
            <button className='bbutton puzzle-share' onClick={() => shareNative(Constants.SHARE_MESSAGE_END)}>
              שתף עם חברים 📢
            </button>
          </div>

          <div className='button-group'>
            <p>רוצה להתחיל מחדש?</p>
            <button className='bbutton puzzle-reset' onClick={() => alert('notimp')}>
              אפס את כל השלבים
            </button>
          </div>

        </div>}
        {runConfetti && <ReactConfetti width={window.innerWidth} height={window.innerHeight} {...CONFETTI_PROPS} />}
      </div>
    </>
  );
}

export default App;