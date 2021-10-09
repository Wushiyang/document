/*
 * @Author: Wushiyang
 * @LastEditors: Wushiyang
 * @Date: 2021-10-09 09:14:18
 * @LastEditTime: 2021-10-09 10:46:47
 * @Description: 请描述该文件
 */
module.exports = (config) => {
  config.set({
    basePath: '../..',
    frameworks: ['jasmine'],
    files: ['./index.js'],
    preprocessors: {
      '**/*.ts': 'karma-typescript'
    },
    plugins: ['karma-jasmine'],
    browsers: ['Chrome', 'Firefox', 'Safari'],
    reporters: ['progress'],
    singleRun: true,
    plugins: base.plugins.concat(['karma-chrome-launcher', 'karma-firefox-launcher', 'karma-safari-launcher'])
  })
}
