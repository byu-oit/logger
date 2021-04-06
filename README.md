# BYU Logger

Creates a [`pino` logger](https://github.com/pinojs/pino) with default settings to match the [BYU Application Development logging standards](https://github.com/byu-oit/app-dev-best-practices/blob/main/adr/application/0006-basic-logging-standards.md).

It will pretty-print logs when run locally, but it will write logs in JSON when deployed (when `NODE_ENV=production`).

## Install

```
npm i @byu-oit/logger 
```

## Usage
```typescript
import DefaultLogger from '@byu-oit/logger'

const logger = DefaultLogger()

logger.info('Hello World')
logger.warn('Something weird happened')
logger.error(new Error('Something went wrong!'))
```

<details>
<summary>CommonJS Equivalent</summary>
<p>

```javascript
const { default: DefaultLogger } = require('@byu-oit/logger')

const logger = DefaultLogger()

logger.info('Hello World')
logger.warn('Something weird happened')
logger.error(new Error('Something went wrong!'))
```

</p>
</details>

---

The semantics are slightly different than functions like `console.log()` and `console.error()`.

Namely,
```typescript
console.error('Something went wrong in X:', new Error('the error'))
```
would be roughly equivalent to
```typescript
logger.error(new Error('the error'), 'Something went wrong in X')
```

For more details, see the `pino` documentation [here](https://github.com/pinojs/pino/blob/master/docs/api.md#logger-instance).

## Options

Any [`pino` options](https://github.com/pinojs/pino/blob/master/docs/api.md#options) can be overridden, but for compliance with our logging standards, we recommend sticking to the defaults provided in this package.

### Example of overwriting a default

```typescript
import DefaultLogger from "./logger"

const logger = DefaultLogger({ level: 'trace' })
```
