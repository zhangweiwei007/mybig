$(function () {

    var form = layui.form;
    //添加自定义验证
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 自定义了一个newpwd 的规则 校验新密码是否与原密码一致
        newpwd: function (value) { //value：表单的值、item：表单的DOM对象
            if (value == $('#oldpassword').val()) {
                return '新密码不能和原密码一致';
            }
        },
        // 自定义了一个repwd 的规则 校验两次新密码是否一致
        repwd: function (value) { //value：表单的值、item：表单的DOM对象
            if (value != $('#newpassword').val()) {
                return '两次新密码不一致';
            }
        }
    });

    //ajax请求


    //监听表单提交事件
    $('#user-password').on('submit', function (e) {
        //阻止默认事件
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);

                }
                layui.layer.msg('密码修改成功');
                //重置表单
                $('#user-password')[0].reset();
            }
        })
    })


})