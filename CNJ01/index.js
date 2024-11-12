"use strict"
import main  from "./main.js"
import {remote}  from "webdriverio"

class index {


 async webconfig(
 ){
    global.browser = await remote({
        capabilities: {
          browserName: "chrome",
          "goog:chromeOptions": {
            args: process.env.CI ? ["headless", "disable-gpu"] : [],
          },
        },
      });

 }

 async start(){
  await this.webconfig()
  await new main().execute()
  await browser.closeWindow()
 }
} 
new index().start()
