'use strict';

const app = require('./express/server');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => console.log('App is listening on port: ' + port));