$(function () {
    // 点击注册显示注册页面
    $('#link_reg').on('click', function () {
        $(this).parents('#login-box').hide();
        $('#reg-box').show();
    })
    //点击去登陆显示登录页面
    $('#link_login').on('click', function () {
        $(this).parents('#reg-box').hide();
        $('#login-box').show();
    })

    // 从layui中获取form对象
    var form = layui.form
    // 从layui中获取layer对象
    var layer = layui.layer
    // 通过form.verify()方法自定义校验规则
    form.verify({
        //自定义了一个 pwd 的规则 校验密码是否符合规范
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 自定义了一个repwd 的规则 校验两次密码是否一致
        repwd: function (value) { //value：表单的值、item：表单的DOM对象
            if (value != $('#password').val()) {
                return '两次密码不一致';
            }
        }
    })
    // AJAX请求

    var url = 'http://ajax.frontend.itheima.net'
    // 注册
    //监听注册表单
    $('#reg-form').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 获取表单数据
        var data = $(this).serialize()
        // console.log(data);
        var turl = url + '/api/reguser';
        //发起AJAX请求
        $.ajax({
            type: 'post',
            url: turl,
            data: data,
            success: function (res) {
                if (res.status != 0) {
                    //使用layui中的弹出框
                    return layer.msg(res.message);
                } else {
                    layer.msg('注册成功,请登录！！');
                    $('#link_login').click();
                    return
                }

            }
        })
    })

    //登录
    // 监听登录表单
    $('#login-form').on('submit', function (e) {
        //阻止值默认事件
        e.preventDefault();
        //获取表单数据
        var data = $(this).serialize();
        // console.log(data);
        var turl = url + '/api/login';
        // 发起ajax请求
        $.ajax({
            type: 'post',
            url: turl,
            data: data,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('用户名或账号错误');
                }
                layer.msg('登陆成功');
                //登录成功后将得到的 token 字符串保存到 localStorage 中
                localStorage.setItem('token', res.token)
                //登录成功跳转到主页
                location.href = '/index.html'
            }
        })

    })
})