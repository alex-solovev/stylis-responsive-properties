# stylis-responsive-properties

[Stylis](https://stylis.js.org/) plugin that makes writing responsive styles more easily

[PostCSS](https://postcss.org/) version can be found [here](https://github.com/alexandr-solovyov/postcss-responsive-properties)

## Example
#### Input:
```css
body {
  color: red;
  font-size: {
    0: 1em;
    768: 1.5em;
    1600: 2em;
  }
}

```


#### Output:
```css
body {
  color: red;
  font-size: 1em;
}

@media screen and (min-width: 768px) {
  body {
    font-size: 1.5em;
  }
}

@media screen and (min-width: 1600px) {
  body {
    font-size: 2em;
  }
}
```

## Usage

Add postcss-responsive-properties and styled-components to your project:
```
yarn add stylis-responsive-properties styled-components
```

#### Using with styled-components@^5.0.0:
```js
import { StyleSheetManager } from "styled-components"
import stylisResponsiveProperties from "stylis-responsive-properties"

<StyleSheetManager stylisPlugins={[stylisResponsiveProperties]}>  
  <App />  
</StyleSheetManager>
```

#### Using with emotion:
Add postcss-responsive-properties and emotion to your project:
```
yarn add stylis-responsive-properties @emotion/core @emotion/cache
```

```js
import  createCache  from  "@emotion/cache"
import { CacheProvider, jsx, css } from  '@emotion/core'})
import  stylisResposnsiveProperties  from  "stylis-responsive-properties"

const  emotionCache  = createCache({
  stylisPlugins: [stylisResposnsiveProperties]
})

<CacheProvider value={emotionCache}>
  <App />
</CacheProvider>
```
