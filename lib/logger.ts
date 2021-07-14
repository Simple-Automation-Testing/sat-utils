/* eslint-disable no-console */
const collors = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',
  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
};

function wrapInGreen(txt: string): string {
  return `\u001b[34m${txt}\u001b[0m`;
}

function wrapInRed(txt: string): string {
  return `\u001b[31m${txt}\u001b[0m`;
}

function wrapInBlue(txt: string): string {
  return `\u001b[34m${txt}\u001b[0m`;
}

function wrapInYellow(txt: string): string {
  return `\u001b[33m${txt}\u001b[0m`;
}

function wrapInMagenta(txt: string): string {
  return `\x1b[35m${txt}\u001b[0m`;
}

const colors = {
  red: (text: string) => wrapInRed(text),
  magenta: (text: string) => wrapInMagenta(text),
  green: (text: string) => wrapInGreen(text),
  yellow: (text: string) => wrapInYellow(text),
  blue: (text: string) => wrapInBlue(text)
};

const logger = {
  // 'ERROR' | 'WARN' | 'INFO' | 'VERBOSE';
  logLevel: 'ERROR',
  log(...args) {
    if (this.logLevel === 'VERBOSE') {
      console.log(colors.green('LOG: '), ...args);
    }
  },
  info(...args) {
    if (this.logLevel === 'VERBOSE' || this.logLevel === 'INFO') {
      console.info(colors.yellow('INFO: '), ...args);
    }
  },
  warn(...args) {
    if (this.logLevel === 'VERBOSE' || this.logLevel === 'INFO' || this.logLevel === 'WARN') {

      console.warn(colors.magenta('WARNING: '), ...args);
    }
  },
  error(...args) {
    if (this.logLevel === 'VERBOSE' || this.logLevel === 'INFO' || this.logLevel === 'WARN' || this.logLevel === 'ERROR') {
      console.error(colors.red('ERROR: '), ...args);
    }
  },
  setLogLevel(level) {
    this.logLevel = level;
  },
  addCustomLevel(loggerDescription, consoleOutput: string, description: string, color = 'FgWhite') {
    logger[loggerDescription] = (...args) => {
      console[consoleOutput](`${colors[color]}${description}${collors.Reset}`, ...args);
    };
  }
};


function setLogLevel(level: 'ERROR' | 'WARN' | 'INFO' | 'VERBOSE' | 'MUTE' | string) {
  logger.setLogLevel(level);
}

export {
  logger,
  colors,
  setLogLevel
};
