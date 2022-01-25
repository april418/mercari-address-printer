import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import common from './webpack.common'

const config = merge<Configuration>(common, {
  devtool: 'inline-source-map',
  mode: 'development'
})

export default config