/* eslint-disable no-console */
const listOfColors = {
  '': '',
  Reset: '\u001B[0m',
  Bright: '\u001B[1m',
  Dim: '\u001B[2m',
  Underscore: '\u001B[4m',
  Blink: '\u001B[5m',
  Reverse: '\u001B[7m',
  Hidden: '\u001B[8m',
  FgBlack: '\u001B[30m',
  FgRed: '\u001B[31m',
  FgGreen: '\u001B[32m',
  FgYellow: '\u001B[33m',
  FgBlue: '\u001B[34m',
  FgMagenta: '\u001B[35m',
  FgCyan: '\u001B[36m',
  FgWhite: '\u001B[37m',
  BgBlack: '\u001B[40m',
  BgRed: '\u001B[41m',
  BgGreen: '\u001B[42m',
  BgYellow: '\u001B[43m',
  BgBlue: '\u001B[44m',
  BgMagenta: '\u001B[45m',
  BgCyan: '\u001B[46m',
  BgWhite: '\u001B[47m',
};

function wrapInGreen(txt: string): string {
  return `\u001B[34m${txt}\u001B[0m`;
}

function wrapInRed(txt: string): string {
  return `\u001B[31m${txt}\u001B[0m`;
}

function wrapInBlue(txt: string): string {
  return `\u001B[34m${txt}\u001B[0m`;
}

function wrapInYellow(txt: string): string {
  return `\u001B[33m${txt}\u001B[0m`;
}

function wrapInMagenta(txt: string): string {
  return `\u001B[35m${txt}\u001B[0m`;
}

const colors = {
  red: (text: string) => wrapInRed(text),
  magenta: (text: string) => wrapInMagenta(text),
  green: (text: string) => wrapInGreen(text),
  yellow: (text: string) => wrapInYellow(text),
  blue: (text: string) => wrapInBlue(text),
};

function createLogger() {
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
      if (
        this.logLevel === 'VERBOSE' ||
        this.logLevel === 'INFO' ||
        this.logLevel === 'WARN' ||
        this.logLevel === 'ERROR'
      ) {
        console.error(colors.red('ERROR: '), ...args);
      }
    },
    setLogLevel(level: 'ERROR' | 'WARN' | 'INFO' | 'VERBOSE' | 'MUTE' | string) {
      this.logLevel = level;
    },
    /**
     * @param {string} loggerDescription description of the new log level
     * @param {string} logLevel log level id
     * @param {string} description description that will be used for output
     * @param {string} consoleOutput outputl method/level
     * @param {string} descriptionColor description section color
     * @param {string} messageColor message section color
     * @returns {!object} logger
     */
    addCustomLevel<T extends PropertyKey = string>(
      loggerDescription: T,
      logLevel: string,
      description: string,
      consoleOutput: 'log' | 'info' | 'error' | 'warn' = 'log',
      descriptionColor:
        | 'Reset'
        | 'Bright'
        | 'Dim'
        | 'Underscore'
        | 'Blink'
        | 'Reverse'
        | 'Hidden'
        | 'FgBlack'
        | 'FgRed'
        | 'FgGreen'
        | 'FgYellow'
        | 'FgBlue'
        | 'FgMagenta'
        | 'FgCyan'
        | 'FgWhite'
        | 'BgBlack'
        | 'BgRed'
        | 'BgGreen'
        | 'BgYellow'
        | 'BgBlue'
        | 'BgMagenta'
        | 'BgCyan'
        | 'BgWhite' = 'FgWhite',
      messageColor:
        | 'Reset'
        | 'Bright'
        | 'Dim'
        | 'Underscore'
        | 'Blink'
        | 'Reverse'
        | 'Hidden'
        | 'FgBlack'
        | 'FgRed'
        | 'FgGreen'
        | 'FgYellow'
        | 'FgBlue'
        | 'FgMagenta'
        | 'FgCyan'
        | 'FgWhite'
        | 'BgBlack'
        | 'BgRed'
        | 'BgGreen'
        | 'BgYellow'
        | 'BgBlue'
        | 'BgMagenta'
        | 'BgCyan'
        | 'BgWhite'
        | '' = '',
    ) {
      logger[loggerDescription as string] = (message, ...args) => {
        if (logger.logLevel === logLevel) {
          const descriptionPart = `${listOfColors[descriptionColor]}${description}${listOfColors.Reset}`;
          const messagePart = messageColor ? `${listOfColors[messageColor]}${message}${listOfColors.Reset}` : message;

          console[consoleOutput](`${descriptionPart}`, messagePart, ...args);
        }
      };

      return logger as typeof logger & { [K in T]: (...args: any[]) => void };
    },
  };

  return logger;
}

export { createLogger, colors };
