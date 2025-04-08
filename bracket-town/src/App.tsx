import { useState } from 'react';
import './App.css';
import PuzzleContainer, { PuzzleConfig } from './PuzzleContainer';
import ReactConfetti from 'react-confetti';
import * as Constants from './Constants';
import { shareNative } from './ShareUtil';

const PUZZLES = [
  'ברוך ה[בא|___ בימים (מאוד זקן)]!',
  'ו[אהב|יותר מ"חיבב"]ת ל[רע|לא טוב]ך כ[מוך|חומר שמצטבר ב[מסנן|לא עונה להודעה, באינטרנט] של מייבש כביסה]',
  '[דרך|___ א[גב|לתקוע סכין במקום הזה שקול לבגידה]] א[רץ|"יונתן הקטן __ ב[בוקר|שדה ___, מגוריו של הנ[שיא|רשומה בספר גינס] הראשון בערוב ימיו] אל ה[גן|מילה שבאה לפני "חיות" ו"שעשועים"]"] [קד|השת[חוה|אמם של קין ואבל] בפני]מה ל[תור|קשה לקבוע אחד [כזה|ככה וככה ו-___ ו-___ (אושר כהן)] ל[רופא|בעבר הרחוק אחד היה מטפל בך באמצעות הקזת דם]]ה',
  '[טובי|משקה [אלכוהול|כימאי יקרא לחומר זה אתנול]י יש[ראלי|מירוץ מכוניות, במסלול שטח ארוך] פופולרי בצבע כתום]ם ה[שני|היום בו אלוהים ה[בדיל|מתכת כסופה שמשמשת לציפוי] בין מים לשמיים]ים [מן|נפל מהשמיים ביציאת מצריים] ה[אחד|___ ב[פה|איפה שנס גדול היה, כידוע] ו-___ בלב, נאמר על אדם [צבוע|אחד מצבא רשע עזר למופאסה ב"מלך הא[ריו|יעד תיירותי וביתו של "ישו הגואל"]ת"]]',
  // '',
  // '',
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
    if (newIndex > PUZZLES.length)
      newIndex = PUZZLES.length;

    setPageIndex(newIndex);
  }

  const puzzleConfig: PuzzleConfig = {
    puzzleKey: PUZZLES[pageIndex],
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

  if (pageIndex == PUZZLES.length - 1) {
    puzzleConfig.showContinueButton = false;
  }

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
        {(pageIndex < PUZZLES.length) ? <PuzzleContainer
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