import { useChromeStorageLocal } from 'use-chrome-storage';
import { useLocalChromeStore, useHostStats } from '../helpers/store';
import './Action.css';

export default function Action() {
  // const [count, setCount] = useChromeStorageLocal('count', 2);
  // const [
  //   stats,
  //   setstats,
  //   countIsPersistent,
  //   countError,
  //   countIsInitialStateResolved,
  // ] = useLocalChromeStore();

  const [hostStats, setHostStats] = useHostStats();

  return (
    <div className="App">
      <header className="App-header">
        <p>Content</p>
        <p>
          <button type="button"></button>
          {JSON.stringify(hostStats, null, 2)}
        </p>
        <p>
          <a
            className="App-link"
            href="options.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Options
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}
