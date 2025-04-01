import { useRef, useState } from 'react'
import './App.css'
import Puzzle from './Puzzle';

function App() {
  const [state, setState] = useState({value: ""});
  const puzzleRef = useRef<any>(null);

  const onInputChange = (event: React.ChangeEvent) => {
    setState({value: (event.target as HTMLTextAreaElement).value})
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const result = puzzleRef.current.submitAnswer(state.value);
    console.log(result);
    setState({value: ''});
    event.preventDefault();
  }

  return (
    <>
      <div className="card">
        <h1>[עיר הסוגרים]</h1>
        {/* <p>{state.value}</p> */}
        <Puzzle ref={puzzleRef} puzzleKey='[דרך|___ א[גב|לתקוע סכין שם משמעותו לבגוד]] א[רץ|"יונתן הקטן __ ב[בוקר|שדה ___, מגוריו של הנ[שיא|רשומה בספר גינס, לדוגמה] הראשון בערוב ימיו] אל ה[גן|מילה שבאה לפני "חיות" ו"שעשועים"]"] [קד|השת[חווה|אמם של קין ואבל] בפני]מה ל[תור|קשה לקבוע אחד [כזה|ככה וככה ו-___ ו-___ (אושר כהן)] ל[רופא|בעבר הרחוק היה מטפל בך באמצעות הקזת דם]]ה'></Puzzle>
        <form onSubmit={onSubmit}>
          <input type='text' name='answer' value={state.value} onChange={onInputChange} />
          <input type="submit" value="הגש" />
        </form>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
