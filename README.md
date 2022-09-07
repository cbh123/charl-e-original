# charl-e

Charl-E is an ElectronJS app that allows you to run Stable Diffusion locally on your M1 Mac. No setup scripts or other downloads necessary!
It works by packaging [Stable Diffusion](https://github.com/bfirsh/stable-diffusion) as a python executable, which is then called by the electron app.

You can download it here: https://www.charl-e.com

I'm working on making this faster and making the UI cleaner.

## Troubleshooting
- After downloading, make sure you drag it into the applications folder. It won't work until you do that.
- You may get a warning about malicious code. To bypass this, you can right click on the app and select 'Open'. I realize this sounds suspicious but in order to get rid of the warning I need to get Apple to 'notarize' the app which is a little tricky. Stay tuned.

## To Run

If you don't want to download the DMG and would rather set it up yourself, it's easy! 

From your command line:

```bash
# Clone this repository
git clone [https://github.com/electron/electron-quick-start](https://github.com/cbh123/charl-e)
# Go into the repository
cd charl-e
```

Next you'll need to download the weights from hugging face. [You can find them here](https://huggingface.co/CompVis/stable-diffusion-v-1-4-original). Download `sd-v1-4.ckpt` and move it to the `/models` folder in this directory.

Finally: 
```bash
# Install dependencies
npm install
# Run the app
npm start
```

You should be good to go.

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
# charl-e
