#!/usr/bin/env node
import { exposeSimpleEvents, exposeDoublingEffect } from './entry'

const displayUsage = () => {
  console.log(`
Usage:
$ npm run start [command]

commands:
- ${Object.keys(commands).join('\n- ')}
`)
}

const isHelpParam = (param) => param === '--help' || param === '-h'

const commands = {
  events: exposeSimpleEvents,
  double: exposeDoublingEffect,
  help: displayUsage,
}

const commandName = process.argv[2]

if (!commandName || process.argv.some(isHelpParam)) {
  displayUsage()
  process.exit(0)
}

if (!commands[commandName]) {
  console.error(`Unknown command "${commandName}"`)
  displayUsage()

  process.exit(1)
}

commands[commandName](process.argv.slice(3))
