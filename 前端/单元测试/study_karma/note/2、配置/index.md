<!--
 * @Author: your name
 * @Date: 2021-07-22 11:11:35
 * @LastEditTime: 2021-08-04 16:09:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /study_karma/note/一、配置/index.md
-->

# 2、配置

## 生成配置文件

输入`karma init karma.conf.js`将会生成 js 配置文件

## 启动

输入`karma start karma.conf.js`将会启动测试，更多选项比如，`karma start karma.conf.js --log-level debug --single-run`，输入`karma start --help`可查看更多可选项

## 配置项

```javascript
module.exports = function(config) {
  config.set({

    // 开启或关闭观察模式,CLI:--auto--watch --no-auto-watch
    autoWatch: true,

    // 自动观察模式的批处理时间，即每次修改文件批处理后下次批处理的最短时间
    autoWatchBatchDelay: 250,

    // 项目根路径，作为files和exclude项的相对路径，默认根路径取配置文件处的__dirname
    basePath: '',

    // 浏览器断开重连事件，超过这个时间则karma立即运行失败，单位ms
    browserDisconnectTimeout: 2000,

    // 浏览器控制台配置
    // level报告等级
    // format报告格式，%b-browser string，%t-log type in lowercase，%T-log type in uppercase，%m-log message
    // path输出文件的输出路径
    // terminal是否在终端显示
    browserConsoleLogOptions: {
      level: "debug",
      format: "%b %T: %m",
      terminal: true
    },

    // 浏览器断开重连的最大次数，超过该次数视为失败
    browserDisconnectTolerance: 0,

    // Karma没有从浏览器接收任何信息需要多久才断开连接，单位ms
    browserNoActivityTimeout: 30000，

    // Karma启动浏览器测试的列表，随着Karma开启关闭，默认地址是http://localhost:9876/
    // CLI: --browsers Chrome,Firefox, --no-browsers
    // 可能的值：
    // Chrome (launcher requires karma-chrome-launcher plugin)
    // ChromeCanary (launcher requires karma-chrome-launcher plugin)
    // ChromeHeadless (launcher requires karma-chrome-launcher plugin ^2.1.0)
    // PhantomJS (launcher requires karma-phantomjs-launcher plugin)
    // Firefox (launcher requires karma-firefox-launcher plugin)
    // Opera (launcher requires karma-opera-launcher plugin)
    // IE (launcher requires karma-ie-launcher plugin)
    // Safari (launcher requires karma-safari-launcher plugin)
    browsers: [],

    // 浏览器启动和连接Karma的最大允许时间，单位ms。如果在这个时间内没有任何浏览器启动Karma将会杀掉进程并重启三次
    captureTimeout: 60000,

    client: {
      // 传递给适配器的参数，仅当使用karma run的时候使用
      // CLI: karma run -- + 传进的参数
      args: undefined,

      // 是否在iframe里运行测试案例，true在iframe里运行，false在新窗口运行。一些案例可能不能运行在iframe里可能需要运行在新窗口
      useIframe: true,

      // 运行测试案例在同一个窗口，而不是在iframe或新窗口
      runInParent: false,

      // 捕获全部的控制台输出并通过管道输入到终端显示
      captureConsole: true,

      // 清理上下文环境，在测试案例完全运行完后清理上下文环境。Setting this to false is useful when embedding a Jasmine Spec Runner Template.
      clearContext: true，

      // 是否显示客户端元素，如果true就不显示banner和brower list
      clientDisplayNone: false
    },

    // 开启和关闭输出颜色
    // CLI: --colors, --no-colors
    colors: true

    // 同时运行多少个浏览器
    concurrency: Infinity，

    // true则添加crossorigin属性给script标签，来禁止script的跨域
    crossOriginAttribute: true,

    // 如果是null则用Karma自己的context.html文件
    customContextFile: null,

    // 如果是null则用Karma自己的debug.html文件
    customDebugFile: null,

    // 如果是null则用Karma自己的client_with_context.html文件。该属性当client.runInParent为true的时候使用
    customClientContextFile: null,

    // 对于匹配的请求添加header
    // 数组,例子:
    // [{
    //   match: '.*foo.html',
    //   name: 'Service-Worker-Allowed',
    //   value: '/'
    // }]
    customHeaders: undefined,

    // 如果是true，则karma服务运行在其他的进程，控制台无任何输出，该服务可通过karma stop指令停止
    // CLI: --detached
    detached: false,

    // 不读取文件的列表或模式
    exclude: [],

    // 开启和关闭运行空套件则失败。如果关闭则程序返回exit-code 0并警告
    // CLI: --fail-on-empty-test-suite，--no-fail-on-empty-test-suite
    failOnEmptyTestSuite: true

    // 开启和关闭故意略过测试则失败，比如jasmine的fit()和xit()。用来阻止用于验证产品的测试的偶然关闭
    // CLI: --fail-on-skipped-tests, --no-fail-on-skipped-tests
    failOnSkippedTests: false，

    // 开启或关闭测试失败则失败
    // CLI: --fail-on-failing-test-suite, --no-fail-on-failing-test-suite
    failOnFailingTestSuite: true

    // 决定了哪些文件被浏览器读取，被karma观察和服务
    // 数组子项是String或{ pattern, type, watched, included, served, nocache }
    // pattern string，没有默认值，是必须的，pattern被使用去匹配文件
    // type string，默认是基于当前文件的后缀名的，如果匹配失败则默认是js，可能的值有css、html、js、module、dom
    // watched boolean，默认是true，如果autoWatch被设置为true，所有watched被设为true的文件都会被观察变化
    // included boolean，默认是true，决定文件是否能被包含在<script>标签里，如果是false，则只能手动加载，比如使用RequreJS
    // served boolean，默认值是true，决定文件是否可被karma服务使用
    // nocache boolean，默认是false，决定是否每次都被karma服务重新读取而不使用缓存
    // pattern的规则相对路径都是基于basePath的，而basePath的相对路径是基于配置文件的位置，pattern使用glob规则（里面包含minimatch规则）
    // 部分细则没细看，详见http://karma-runner.github.io/6.3/config/files.html
    files: [],


    forceJSONP: false
  })
}
```
