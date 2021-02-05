interface IOptions {
  numbers?: boolean;
  lettersAndNumbers?: boolean;
  symbols?: boolean;
  lettersNumbersAndSymbols?: boolean;
}

function getRandomString(length, options: IOptions = {}) {
  const l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const s = '!@#$%^&*(((()))_+~?>"|\\}{[]';
  const n = '01234567890';
  const ln = l + n;
  const lns = l + s + n;

  if (options.numbers) {
    return Array.from({length})
      .map(() => n.charAt(Math.floor(Math.random() * n.length)))
      .join('');
  }
  if (options.lettersAndNumbers) {
    return Array.from({length})
      .map(() => ln.charAt(Math.floor(Math.random() * ln.length)))
      .join('');
  }
  if (options.symbols) {
    return Array.from({length})
      .map(() => s.charAt(Math.floor(Math.random() * s.length)))
      .join('');
  }
  if (options.lettersNumbersAndSymbols) {
    return Array.from({length})
      .map(() => lns.charAt(Math.floor(Math.random() * lns.length)))
      .join('');
  }

  return Array.from({length})
    .map(() => l.charAt(Math.floor(Math.random() * l.length)))
    .join('');
}

export {getRandomString};
