reserved-ip
--

> Check if IP address is reserved.

### Installation

```bash
❯ npm install reserved-ip --save

or

❯ yarn add reserved-ip
```

### Usage

```js
const isReservedIP = require('reserved-ip')

isReservedIP('10.0.0.0')
// => true

isReservedIP('google.com')
// => undefined

```

### License
[MIT](https://opensource.org/licenses/MIT)   