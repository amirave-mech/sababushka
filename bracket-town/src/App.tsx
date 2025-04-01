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
    // alert('submit ' + state.value);
    const result = puzzleRef.current?.submitAnswer(state.value) ?? false;
    alert(result);
    event.preventDefault();
  }

  return (
    <>
      <h1>[עיר הסוגרים]</h1>
      <div className="card">
        <p>{state.value}</p>
        <Puzzle ref={puzzleRef} puzzleKey='A<first>[testy t<second>[THIS IS TEST] blauwg] sdfsdf<third>[blin<fourth>[sdf]]sdf'></Puzzle>
        <form onSubmit={onSubmit}>
          <input type='text' name='answer' onChange={onInputChange} />
          <input type="submit" value="Submit" />
        </form>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
