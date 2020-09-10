$(function () {
    //调用函数 获取用户信息
    GetUserInfo()
    $('#btnlogout').on('click', function () {
        // 提示用户是否退出
        layer.confirm('确定退出登录？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 页面跳转
            location.href = '/login.html';
            // 清空token
            localStorage.removeItem('token');
            // 关闭询问框
            layer.close(index);
        });
    })
})
//获取用户的基本信息
function GetUserInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        //请求头
        // headers: {
        //     Authorization: localStorage.getItem('token'),
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')

            }
            //调用渲染用户头像的函数
            renderAvatar(res.data);
        },
        // 无论成功与否都会调用这个函数
        // complete: function (res) {
        //     // console.log(res);
        //     //    在complete 函数中，可以使用res.responseJSON 拿到服务器回应的信息
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
        //         //1 强制清空token 
        //         // console.log(11);
        //         localStorage.removeItem('token')
        //         //2 强制跳转页面
        //         location.href = '/login.html'

        //     }
        // }
    })
}
// 渲染用户头像
function renderAvatar(user) {
    // 1获取用户名称
    var name = user.nickname || user.username;
    //2,设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //3,判断是否有头像
    if (user.user_pic !== null) {
        //存在头像
        // 修改头像的src 并显示
        $('.layui-nav-img').attr('src', user.user_pic).show();
        //隐藏文本头像
        $('.text-avatar').hide();
    } else {
        //不存在头像
        // 隐藏普通头像
        $('.layui-nav-img').hide();
        // 修改文本头像的文字并显示
        $('.text-avatar').html(name[0].toUpperCase()).show();
    }
}