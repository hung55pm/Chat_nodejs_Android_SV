$(document).ready(function () {
    var tblMessageRecent = $('#tb-mesage-recent').DataTable({
        "retrieve": true,
        "ordering": true,
        "info": false,
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": false,
        "bInfo": false,
        "bAutoWidth": false,
        "fnDrawCallback": function (oSettings) {
           // bindActionTable();
        }
    });

    function bindActionTable() {
        getAllMessageRecent("0987654321")
    }
    bindActionTable();
    function addEmployeesToTable(employees) {

        tblMessageRecent.clear().draw();

        if (employees.length != 0) {
            employees.forEach(function (value, index) {
                tblMessageRecent.row.add([value.friend_name,
                        value.sender_name+": "+value.message,
                        value.date,
                        value.remove
                    ]).draw(false);

            });
        }
    }
    function getAllMessageRecent(user_id) {
        $.ajax('/web/get-mesrecent',
            {
            method: 'POST', data: {user_id: user_id}
        }).success(function (res) {
            if (res.code == "200") {
                convertDataToEmployeesTable(res.result);

            }
            else {

                showNoti(3, "Đã xảy ra lỗi vui lòng thử lại sau");
            }
        }).error(function (err) {
            showNoti(3, "Đã xảy ra lỗi vui lòng thử lại sau");
        });
    }

    function convertDataToEmployeesTable(recent) {
        var recentTp = [];
        for (var i = 0; i < recent.length; i++) {
            var recentob = {
                _id: recent[i]._id,
                room_id:recent[i].room_id,
                sender_id:recent[i].sender_id,
                sender_name:recent[i].sender_name,
                friend_name:recent[i].friend_name,
                message:recent[i].message,
                date: recent[i].date,
                remove: "<a class ='btn-remove' room_id='" + recent[i].room_id + "' href='#' data-toggle='modal' data-target='#myModal'>" +
                "<i class='fa fa-times'></i></a>"
            }
            recentTp.push(recentob);
        }
        addEmployeesToTable(recentTp);
    }
    function showNoti(type, text) {
        if (type == 1) {
            Lobibox.notify('info', {
                size: "mini",
                delay: 3000,
                position: 'bottom right',
                msg: text
            });
        }
        else if (type == 2) {
            Lobibox.notify('warning', {
                size: "mini",
                delay: 3000,
                position: 'bottom right',
                msg: text
            });
        }
        else if (type == 3) {
            Lobibox.notify('error', {
                size: "mini",
                delay: 3000,
                position: 'bottom right',
                msg: text
            });
        }
        else {
            Lobibox.notify('success', {
                size: "mini",
                delay: 3000,
                position: 'bottom right',
                msg: text
            });
        }
    }
});