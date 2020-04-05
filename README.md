# Asyncview

### A tiny Express middleware for logging async requests and responses

```js
const express = require('express')
const asyncview = require('asyncview')

const app = express()
app.use(asyncview)
```

![Preview](./assets/preview.jpg)

`asyncview` is a lightweight middleware based on Connect.  
It logs every incoming request and the corresponding response as separate events.  
If desired, it can also integrate with the [`debug`](https://github.com/visionmedia/debug#readme) module.
