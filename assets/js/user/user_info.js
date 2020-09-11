$(function () {
    var form = layui.form;
    //添加自定义验证
    form.verify({
        nickname: function (value) { //value：表单的值、item：表单的DOM对象
            if (value.length > 6) {
                return '昵称长度为1-6的字符';
            }
        }
    });
    // 优化AJAX请求次数
    var userInfo = null;
    InitUserInfo();
    // 初始化用户信息
    function InitUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！')
                }
                // console.log(res);
                //为表单赋值
                form.val("user_info", res.data);
                userInfo = res.data;
            },
        })
    }
    //监听重置按钮
    $('#btn-reset').on('click', function (e) {
        // console.log(11);
        //清除默认重置
        e.preventDefault();
        //调用初始化用户信息函数
        // InitUserInfo();
        form.val("user_info", userInfo);
    })
    // 监听表单提交修改用户信息

    $('#user-info').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 获取data
        var data = {
            id: $('#user-info [name=id]').val(),
            nickname: $('#user-info [name=nickname]').val(),
            email: $('#user-info [name=email]').val()
        }
        // console.log(data);
        //发起修改用户信息的请求
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改失败');
                }
                // 调用父页面的方法，重新渲染用户的头像信息
                //注意 在子页面中调用父页面的方法
                window.parent.GetUserInfo();
                // 成功后初始化用户列表信息
                InitUserInfo();
            }
        })
    })
})