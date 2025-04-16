import ReactGA from 'react-ga4';

const TRACKING_ID = 'G-MDN6H7712Z';

export function GAInit() {
    ReactGA.initialize(TRACKING_ID);
    ReactGA.send({ hitType: "pageview", page: "/", title: "Sababushka"})
}

export function GAReportPuzzleComplete(puzzleKey: string, score: number) {
    ReactGA.event('puzzle_completed', {
        level: puzzleKey,
        score: score,
    });
}

export function GAReportPuzzleReset(puzzleKey: string) {
    ReactGA.event('puzzle_reset', {
        level: puzzleKey,
    });
}

export function GAReportShare(isEnd: boolean, success: boolean) {
    ReactGA.event('share', {
        is_end: isEnd,
        success: success,
    });
}