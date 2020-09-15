$(function () {
    //调用渲染函数
    renderArtCate();

    function renderArtCate() {
        //发起AJAX请求
        //获取服务器的数据
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
                $('tbody').html(htmlStr);
            }
        })
    }
    var layer = layui.layer;
    var form = layui.form;
    //监听添加类别按钮
    var index = null;
    $('#btnAddCate').on('click', function () {
        // console.log($('#art_addCate').html());
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#art_addCate').html(),
        });
    })
    // 因为form在页面中不是直接存在的 所以必须使用代理的方式来为form表单添加监听事件

    $('body').on('submit', '#addCate', function (e) {
        //阻止默认提交事件
        e.preventDefault();
        // 发起AJAX请求


        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章类别失败');
                }

                layer.msg('新增文章成功');
                // 关闭弹窗
                layer.close(index);
                //重新渲染页面
                renderArtCate();
            }
        })
    })

    // 监听编辑模块
    $('#CateList').on('click', '#bjCate', function () {

        // console.log($(this).parent().data('id'));
        // 根据ID获取类别信息
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + $(this).parent().data('id'),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败');
                }
                form.val('reCate', res.data);
            }
        })
        // console.log(11);
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#art_reCate').html(),
        });
    })

    //因为编辑页面中的表单并不直接存在页面中，所以需要使用代理的方式来进行监听

    $('body').on('submit', '#reCate', function (e) {
        // 阻止默认事件
        e.preventDefault();
        // AJAX请求更新
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: form.val('reCate'),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改失败')
                }
                layer.msg('修改成功');
                // 关闭弹窗
                layer.close(index);
                //调用渲染函数
                renderArtCate();
            }
        })
    })
    //监听删除按钮

    $('#CateList').on('click', '#deCate', function () {

        //发起ajax请求删除数据
        $.ajax({
            type: 'GET',
            url: '/my/article/deletecate/' + $(this).parent().data('id'),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('删除失败');
                }
                layer.msg('删除成功');
                //调用渲染函数
                renderArtCate();
            }
        })
    })

})