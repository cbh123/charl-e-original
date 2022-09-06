# charl-e

Charl-E is an ElectronJS app that allows you to run Stable Diffusion locally on your M1 Mac.
It works by packaging [Stable Diffusion](https://github.com/bfirsh/stable-diffusion) as a python executable, which is then called by the electron app.

You can download it here: 

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
