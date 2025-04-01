import { useRef, useState } from 'react'
import './App.css'
import Puzzle from './Puzzle';
import Toast from './Toast';
import PuzzleInput from './PuzzleInput';

function App() {
  const [score, setScore] = useState(100);

  const puzzleRef = useRef<any>(null);
  const toastRef = useRef<any>(null);

  const onSubmit = (text: string) => {
    const result = puzzleRef.current.submitAnswer(text);
    // console.log(result);
    if (result === false) {
      setScore((score) => score - 2);
      toastRef.current.showError('טעות! הניחוש לא תואם אף אחד מהסוגרים.')
    }
  }

  const onRequestHint = () => {
    setScore((score) => score - 15);
    return true;
  }

  return (
    <>
      <div className='puzzle-container'>
        <div className='puzzle-header'>
          <h1>[סבבושקה]</h1>
          {/* <p>מאת אמיר רווה</p> */}
        </div>
        {/* <p>{state.value}</p> */}
        <div className='puzzle-content'>
          <div className='puzzle-score'>
            <label>ניקוד: {score}/100</label>
            <progress value={score} max='100'>{score}%</progress>
          </div>
          <Puzzle ref={puzzleRef} requestHint={onRequestHint} puzzleKey='[דרך|___ א[גב|לתקוע סכין במקום זה משמעותו לבגוד]] א[רץ|"יונתן הקטן __ ב[בוקר|שדה ___, מגוריו של הנ[שיא|רשומה בספר גינס, לדוגמה] הראשון בערוב ימיו] אל ה[גן|מילה שבאה לפני "חיות" ו"שעשועים"]"] [קד|השת[חווה|אמם של קין ואבל] בפני]מה ל[תור|קשה לקבוע אחד [כזה|ככה וככה ו-___ ו-___ (אושר כהן)] ל[רופא|בעבר הרחוק אחד היה מטפל בך באמצעות הקזת דם]]ה'></Puzzle>
          <Toast ref={toastRef}></Toast>
          <div className='mobile-keyboard'>
            <PuzzleInput onSubmit={onSubmit}></PuzzleInput>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
