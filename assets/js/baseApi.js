// 每次调用AJAX时都会先调用这个函数
// 可以拿到我们给AJAX提供的配置对象
$.ajaxPrefilter(function (options) {
    //发起ajax请求之前,拼接路径
    options.url = "http://ajax.frontend.itheima.net" + options.url;
    // 统一为有权限的接口,设置 headers 请求头

    // 判断请求路径中是否包含 '/my/' 这个字符串

    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token'),
        }
    }
    // 统一挂载 complete 函数
    options.complete = function (res) {
        // console.log(res);
        //    在complete 函数中，可以使用res.responseJSON 拿到服务器回应的信息
        if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
            //1 强制清空token 
            // console.log(11);
            localStorage.removeItem('token')
            //2 强制跳转页面
            location.href = '/login.html'

        }
    }
})