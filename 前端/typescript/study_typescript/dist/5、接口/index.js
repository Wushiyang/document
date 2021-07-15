"use strict";
function printLabel(name) {
    console.log(name.firstName +
        (name.secondName ? '~' + name.secondName : '') +
        '~' +
        name.lastName);
}
function ajax(config) {
    var xhr = new XMLHttpRequest();
    xhr.open(config.type, config.url);
    if (config.data) {
        xhr.send(config.data);
    }
    else {
        xhr.send();
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log('成功');
            if (config.dataType === 'json') {
                console.log(JSON.parse(xhr.responseText));
            }
            else {
                console.log(xhr.responseText);
            }
        }
    };
}
ajax({
    type: 'GET',
    url: 'http://www.baidu.com',
    dataType: 'json'
});
var md5 = function (key, value) {
    return key + value;
};
console.log(md5('name', '张三'));
