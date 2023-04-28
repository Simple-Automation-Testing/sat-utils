function millisecondsToMinutes(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60_000) as number;
  const seconds = ((milliseconds % 60_000) / 1000).toFixed(0);

  return seconds === '60' ? minutes + 1 + ':00' : minutes + ':' + (+seconds < 10 ? '0' : '') + seconds;
}

export { millisecondsToMinutes };
