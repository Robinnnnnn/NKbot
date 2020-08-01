PATH /usr/local/bin
  1. I added the chromiumdriver download into that folder
  2. chromium has a bunch of CLI commands that you can adjust using the Capabilities class and you can change the options to customize how the rogram will function
  3. To find a specific element
    1. use the `findElement` function with the `By.js()` method passed as the argument to `findElement`
    2. `By.js()` takes a callback function that you can execute, just return the JSpath from the dev console of the element you want to select