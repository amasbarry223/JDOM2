/**
 * Logger utility
 * Centralized logging with environment-aware behavior
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug'

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (!this.isDevelopment && level === 'debug') {
      return
    }

    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`

    switch (level) {
      case 'error':
        console.error(prefix, message, ...args)
        break
      case 'warn':
        console.warn(prefix, message, ...args)
        break
      case 'info':
        console.info(prefix, message, ...args)
        break
      case 'debug':
        console.debug(prefix, message, ...args)
        break
      default:
        console.log(prefix, message, ...args)
    }
  }

  log(message: string, ...args: unknown[]): void {
    this.log('log', message, ...args)
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, ...args)
  }

  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, ...args)
  }

  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    if (error instanceof Error) {
      this.log('error', message, {
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
        name: error.name,
      }, ...args)
    } else {
      this.log('error', message, error, ...args)
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, ...args)
  }
}

export const logger = new Logger()

