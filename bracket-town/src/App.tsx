import { useState } from 'react';
import './App.css';
import PuzzleContainer from './PuzzleContainer';
import ReactConfetti from 'react-confetti';

const PUZZLES = [
  'ברוך ה[בא|___ בימים (מאוד זקן)]!',
  '[דרך|___ א[גב|לתקוע סכין במקום הזה שקול לבגידה]] א[רץ|"יונתן הקטן __ ב[בוקר|שדה ___, מגוריו של הנ[שיא|רשומה בספר גינס] הראשון בערוב ימיו] אל ה[גן|מילה שבאה לפני "חיות" ו"שעשועים"]"] [קד|השת[חוה|אמם של קין ואבל] בפני]מה ל[תור|קשה לקבוע אחד [כזה|ככה וככה ו-___ ו-___ (אושר כהן)] ל[רופא|בעבר הרחוק אחד היה מטפל בך באמצעות הקזת דם]]ה',
  '',
  '',
  '',
]

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

  const handleFinish = (score: number) => {
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
    if (newIndex >= PUZZLES.length)
      newIndex = PUZZLES.length;

    setPageIndex(newIndex);
  }

  return (
    <div className='puzzle-container'>
      <div className='puzzle-header'>
        <h1>[סבבושקה]</h1>
        <div className='pagination'>
          <button className='pagination-arrow' onClick={_ => movePage(pageIndex - 1)}>{'<'}</button>
          {PUZZLES.map((_puzzleKey, i) => {
            return (<span className={'pagination-dot' + (i === pageIndex ? ' active' : '')}>•</span>);
          })}
          <button className='pagination-arrow' onClick={_ => movePage(pageIndex + 1)}>{'>'}</button>
        </div>
      </div>
      <PuzzleContainer
        key={pageIndex}
        puzzleKey={PUZZLES[pageIndex]}
        isTutorial={pageIndex === 0}
        onFinish={handleFinish}
      />
      {runConfetti && <ReactConfetti width={window.innerWidth} height={window.innerHeight} {...CONFETTI_PROPS}/>}
    </div>
  );
}

export default App;