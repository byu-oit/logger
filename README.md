# BYU Logger

Creates a [pino logger](https://github.com/pinojs/pino) with default settings to match the [BYU Application Development logging standards](https://github.com/byu-oit/app-dev-best-practices/blob/main/adr/application/0006-basic-logging-standards.md).

## Install

```
npm i @byu-oit/logger 
```

## Usage
```typescript
import DefaultLogger from '@byu-oit/logger'
import { Logger } from 'pino'

const logger: Logger = DefaultLogger()

logger.info('Hello World')
```

## Options
| Option | Type | Description | Default |
| --- | --- | --- | --- |
| name | string | Name of your logger | |
| level | string | Logger level | `info` (if `NODE_ENV == 'production'`) or `debug` (if `NODE_ENV != 'production'`)
