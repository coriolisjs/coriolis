#!/usr/bin/env node
import { exposeSimpleEvents, exposeDoublingEffect } from './entry'

const commands = {
  events: exposeSimpleEvents,
  double: exposeDoublingEffect
}

const commandName = process.argv[2]

if (!commandName || !commands[commandName]) {
  throw new Error(`unknown command "${commandName}"`)
}

commands[commandName](process.argv.slice(3));
