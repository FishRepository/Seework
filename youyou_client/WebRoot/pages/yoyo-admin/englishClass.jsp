<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
    <title>后台管理</title>
    <%@ include file="../../include/base.jsp" %>
    <script type="text/javascript" src="../../js/pictureHandle.js" ></script>
</head>
<body>
<div class="topics">
    <div class="form-group clearfix">
        <h4>添加英语课程</h4>
        <div class="col-lg-5 col-md-5 col-xs-5 col-sm-5">
            <label>课程名称</label>
            <input type="text" id="className" class="form-control" placeholder="输入课程名称"/>
        </div>
        <div class="col-lg-2 col-md-2 col-xs-2 col-sm-2">
            <label>是否付费</label>
            <select id="isPay" class="form-control">
                <option value="0">否</option>
                <option value="1">是</option>
            </select>
        </div>
        <div class="col-lg-3 col-md-3 col-xs-3 col-sm-3">
            <label></label>
            <button type="button" id="btnAdd" class="btn btn-block btn-success">添加</button>
        </div>
    </div>



    <div class="form-group clearfix">
        <h4>英语课程列表查看</h4>
        <div class="form-group clearfix">
        <div class="col-lg-5 col-md-5 col-xs-5 col-sm-5">
            <label>课程名称</label>
            <input type="text" id="classNameQ" class="form-control" placeholder="输入课程名称"/>
        </div>
        <div class="col-lg-2 col-md-2 col-xs-2 col-sm-2">
            <label>是否付费</label>
            <select id="isPayQ" class="form-control">
                <option value="0">否</option>
                <option value="1">是</option>
            </select>
        </div>
        <div class="col-lg-3 col-md-3 col-xs-3 col-sm-3">
            <label></label>
            <button type="button" id="btnSearch" class="btn btn-block btn-primary">查询</button>
        </div>
        </div>
        <table class="table table-bordered">
            <thead>
            <tr>
                <th width="10%">序号</th>
                <th width="30%">课程图片</th>
                <th width="30%">课程名称</th>
                <th width="10%">是否付费</th>
                <th width="20%">操作</th>
            </tr>
            </thead>
            <tbody class="search-list">

            </tbody>
        </table>
    </div>


    <!-- 模态框（Modal） -->
    <div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
        <div class="modal-dialog" style="width:500px;">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">修改课程</h4>
                    <input type="hidden" id="mClassId"/>
                </div>
                <div class="modal-body">
                    <div class="form-group row">
                        <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                            <label>课程名称</label>
                            <input type="text" id="mClassName" class="form-control" placeholder=""/>
                        </div>
                        <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                            <label>是否付费</label>
                            <select id="mIsPay" class="form-control">
                                <option value="0">否</option>
                                <option value="1">是</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button type="button" class="btn btn-primary" id="btnUpd">提交修改</button>
                </div>
            </div>
        </div>
    </div>


    <!-- 模态框添加图片 -->
    <div id="myModalPic" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">添加图片</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group row">
                        <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                            <label>添加图片<small class="text-danger">有图片的课程可选择上传图片</small></label>
                            <input class="btn btn-default" type="file" id="upFile" />
                        </div>
                        <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                            <label>图片预览</label>
                            <div class="form-control-sty2 ">
                                <img src="" id="nextview"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                    <button type="button" id="addImageEgPic" class="btn btn-primary" data-id="">提交更改</button>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
<script>
    $(function(){
        /*查询英语课程*/
        $("#btnSearch").click(function(){
            refleshTable();
        });
        $("#btnUpd").click(function () {
            updEgClass();
        });
        /*添加英语课程*/
        $("#btnAdd").click(function(){
            var className = $("#className").val();
            var isPay = $("#isPay").val();
            if(!className){
                alert("课程名称不能为空！");
                return;
            }else{
                $.ajax({
                    type:"post",
                    url:urlPath+"/admin.do?method=addEnglishClass",
                    async:true,
                    data:{
                        className:className,
                        isPay:isPay
                    },
                    success:function(d){
                        if(d.RESULT=="SUCCESS"){
                            alert("添加成功");
//                            location.reload();
                            refleshTable();
                        }
                    }
                });
            }
        });
    });

    function opModal(id,className,isPay){
        $("#mClassId").val(id);
        $("#mClassName").val(className);
        $("#mIsPay").val(isPay);
        $("#myModal").modal('show');
    }

    function del(id,t){
        if(window.confirm('确定删除该记录吗？')){
            $.ajax({
                type:"post",
                data:{
                    id:id
                },
                url:urlPath+"/admin.do?method=delEnglishClass",
                async:true,
                success:function(d){
                    if(d.RESULT=="SUCCESS"){
                        alert("删除成功")
                        $(t).parents("tr").remove();
                    }
                }
            });
            return true;
        }else{
            return false;
        }
    }

    function updEgClass(){
        var a=$('#mClassId').val();
        var b=$('#mClassName').val();
        var c=$('#mIsPay').val();
        $.ajax({
            type:"post",
            data:{
                id:a,
                className:b,
                isPay:c
            },
            url:urlPath+"/admin.do?method=updEnglishClass",
            async:true,
            success:function(d){
                if(d.RESULT=="SUCCESS"){
                    $("#myModal").modal('hide');
                    alert("修改成功");
                    refleshTable();
                }
            }
        });
    }

    function opPicModal(classId){
        $("#addImageEgPic").attr("data-id",classId);
        $("#myModalPic").modal('show');
    }

    function refleshTable(){
        var classNameQ = $("#classNameQ").val();
        var isPayQ = $("#isPayQ").val();
        $.ajax({
            type:"get",
            url:urlPath+"/admin.do?method=getEnglishClass",
            async:true,
            data:{
                className:classNameQ,
                isPay:isPayQ
            },
            success:function(d){
                var tr="";
                for (var i = 0; i < d.LIST.length; i++) {
                    var x = d.LIST[i].isPay == 1 ? '是' : '否';
                    var pic='';
                    if(d.LIST[i].classPic){
                        pic='<img width="120" height="120" class="img-thumbnail" src="'+urlPath+d.LIST[i].classPic+'" /img>';
                    }
                    tr += '<tr>' +
                        '<th>' + (i + 1) + '</th>' +
                        '<td>'+pic+'</td>' +
                        '<td>' + d.LIST[i].className + '</td>' +
                        '<td>' + x + '</td>' +
                        '<td>'+
                        '<a class="btn btn-primary" onclick="opModal(\''+d.LIST[i].id+'\',\''+d.LIST[i].className+'\',\''+d.LIST[i].isPay+'\')">修改</a>' +
                        '<a class="btn btn-info" onclick="opPicModal(\'' + d.LIST[i].id + '\')">上传图片</a>' +
                        '<a class="btn btn-danger" onclick="del(\'' + d.LIST[i].id + '\',this)">删除</a>' +
                        '</td>' +
                        '</tr>'
                }
                $(".search-list").html(tr);
            }
        });
    }
</script>
</html>