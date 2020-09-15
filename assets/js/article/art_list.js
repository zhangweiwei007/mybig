$(function () {

    //根据接口文档 定义一个请求参数的数据
    var q = {
        pagenum: 1, //默认页码值为1
        pagesize: 2, //每页显示多少条数据  默认为2
        cate_id: '', //文章分类的 Id 默认为空
        state: '', //文章的状态，可选值有：已发布、草稿 默认为空
    }
    // 定义一个时间过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data);

        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 定义获取文件列表的函数并渲染页面
    function initArtList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取失败');
                }
                // console.log(res);
                var htmlStr = template('artList', res);
                $('tbody').html(htmlStr);
                //调用分页渲染函数
                renderpage(res.total);
            }
        })
    }
    initArtList();

    // 文章类别列表

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
                var htmlStr = template('artCate', res)
                $('#art_Cate').html(htmlStr);
                //通知layui重新渲染
                layui.form.render();
            }
        })
    }
    renderArtCate();


    // 监听筛选按钮

    $('#form-select').on('submit', function (e) {
        //阻止默认提交
        e.preventDefault();
        var data = layui.form.val("form-select")
        // console.log(data1);
        q.cate_id = data.cate_id;
        q.state = data.state;
        initArtList();
    })


    // 定义分页的渲染函数
    var laypage = layui.laypage;

    function renderpage(total) {
        // console.log(total);
        laypage.render({
            elem: "pagebox",
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {

                if (!first) {
                    // console.log(obj.curr); 当前页码值
                    // console.log(obj.limit); 当前每页显示数据的条数
                    q.pagesize = obj.limit;
                    q.pagenum = obj.curr;
                    //重新获取数据
                    initArtList();
                }
            }
        })
    }

    // 监听删除按钮

    $('.layui-table').on('click', '#deArt', function () {
        // console.log($(this).parent().data('id'));
        //发起ajax请求根据id删除文章
        // 获取页面剩余按钮的个数
        var len = $('.btn_deArt').length
        // console.log(len);
        $.ajax({
            type: 'GET',
            url: '/my/article/delete/' + $(this).parent().data('id'),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('删除失败');
                }
                layui.layer.msg('删除成功');

                // 判断当删除按钮个数为1时 页面没有数据，应当跳转到上一页
                if (len === 1) {
                    q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
                }
                //重新获取列表数据
                initArtList();
            }
        })
    })
})