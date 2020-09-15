$(function () {
    //获取文章类别
    $.ajax({
        type: 'get',
        url: "/my/article/cates",
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取失败')
            }
            // console.log(res);
            // 调用模板引擎
            var htmlStr = template('art_cate', res)
            $('#alias').html(htmlStr);
            //通知layui重新渲染
            layui.form.render();
        }
    })
    //初始化富文本编辑器


    initEditor();


    //图片裁剪

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    //监听选择图片按钮

    $('#btn_chooseImg').on('click', function () {
        //模拟文件选择框的点击
        $('#coverFile').click();
    });

    $('#coverFile').on('change', function (e) {
        //拿到用户选择的文件
        var file = e.target.files[0];

        //判断用户是否选择了文件
        if (!file) {
            return;
        }
        // 根据选择的文件，创建一个对应的url地址

        var newImgUrl = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    //定义文章的发布状态
    var art_state = '已发布'

    //监听存为草稿按钮
    $('#btn_Save').on('click', function () {
        art_state = '草稿'
    })

    //监听表单提交
    $('#art_addform').on('submit', function (e) {
        //阻止默认提交
        e.preventDefault();
        //创建formdata对象
        var fd = new FormData($(this)[0])
        //将文章的发布状态存到fd中
        fd.append('state', art_state);
        //将裁剪过后的图片，输出位一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                //发起ajax请求
                $.ajax({
                    type: 'POST',
                    url: '/my/article/add',
                    data: fd,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layui.layer.msg('发布失败');
                        }
                        layui.layer.msg('发布成功');
                        //跳转到文章列表页面
                        location.href = '/article/art_list.html'
                    }
                })
            })


    })
})