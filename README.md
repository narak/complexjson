# Epsilon UI

The workflow ui for the epsilon engine.

### Pre-Requisites
1. Node and Yarn. Tested with Node 6.5 & Yarn 0.18, but future versions should work as well.
2. Epsilon-zaffi endpoint

### Setup
Update the parameters inside config.js.

<pre>
yarn global add webpack
yarn
</pre>

### Prod Server
<pre>
npm build
npm start
</pre>
Server should come up at configured port.

### Dev Server with hotloader
<pre>
npm run build:hot
node serve.js dev
</pre>

### Dev Server without hotloader
<pre>
npm run build:dev
node serve.js
</pre>
Server should come up at configured port.
