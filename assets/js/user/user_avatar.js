$(function () {

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 监听文件上传按钮

    $('#btnUp').on('click', function () {
        // 模拟files框点击
        $('#files').click();
    })
    $('#files').on('change', function (e) {
        // 获取用户获取的文件
        var filesList = e.target.files;
        if (filesList.length <= 0) {
            return layui.layer.msg('请选择图片');
        }
        // console.log(filesList);
        // 将文件转换为路径
        var imgURL = URL.createObjectURL(filesList[0])
        // 重新初始化裁剪区域
        $image.cropper('destroy') //销毁旧的裁剪区域
            .attr('src', imgURL) //重新设置图片路径
            .cropper(options) //重新初始化裁剪区域
    })
    // 为确定按钮绑定点击事件
    $('#btncfm').on('click', function () {
        //1 拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        //2 调用接口，把头像上传到服务器

        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('头像更新失败');
                }
                layui.layer.msg('头像更新成功');
                // 调用父页面的重新渲染头像区域
                window.parent.GetUserInfo();
            }
        })
    })
})