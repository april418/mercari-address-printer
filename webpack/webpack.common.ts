import { join } from 'path'
import { readdirSync } from 'fs'
import CopyPlugin from 'copy-webpack-plugin'

const srcDir = join(__dirname, '..', 'src')
const scriptfiles = readdirSync(srcDir).filter(file => /^.+\.tsx?$/.test(file))
const scripts = scriptfiles.reduce<{ [key: string]: string }>((obj, file) => {
  obj[file.split('.')[0]] = join(srcDir, file)
  return obj
}, {})
const contentScriptsDir = join(srcDir, 'content_scripts')
const contentScriptfiles = readdirSync(contentScriptsDir).filter(file => /^.+\.tsx?$/.test(file))
const contentScripts = contentScriptfiles.reduce<{ [key: string]: string }>((obj, file) => {
  obj[`${file.split('.')[0]}_content_script`] = join(contentScriptsDir, file)
  return obj
}, {})
const entry = Object.assign({}, scripts, contentScripts)

const config = {
  entry,
  output: {
    path: join(__dirname, '..', 'dist', 'js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: '.', to: '../', context: 'public' }],
    }),
  ],
}

export default config