$(document).ready(function () {

    $('#choose-type').on('change', function () {

        var type = this.value;
        console.log(type);
        if (type == "full") {
            $('#vung').hide();
            $('#tinh').hide();
            $('#div-tbl-info-employee').hide();
            $('#chart').show();
        } else if (type == "state") {
            $('#vung').show();
            $('#tinh').hide();
            $('#div-tbl-info-employee').hide();
            $('#chart').show();
            getAllStates();
        } else if(type =="province") {
            $('#vung').show();
            $('#tinh').show();
            $('#div-tbl-info-employee').hide();
            $('#chart').show();
            var idDefault = $("#state-select").val();
            getProvincesByState(idDefault);
        } else {
            $('#vung').hide();
            $('#tinh').hide();
            $('#chart').hide();
            $('#div-tbl-info-employee').show();
        }

    });

    getAllStates();

    $('#m-choose-type').on('change', function() {
        var mType = this.value;
        console.log(mType);
        if(mType=="month") {
            $('#type-month').show();
            $('#type-day').hide();
        } else {
            $('#type-month').hide();
            $('#type-day').show();
        }
    });

    var employees;
    var state;

    var t = $('#tbl-info-employees').DataTable({
        "retrieve": true,
        "ordering": true,
        "info": false,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": true,
        "bInfo": false,
        "bAutoWidth": false,
    });

    getAllEmployees();

    function getAllEmployees() {
        $.ajax('/admin/employees', {
            method: 'GET'
        }).success(function (res) {
            if (res.status == 'success') {
                employees = [];
                for (var i = 0; i < res.result.length; i++) {
                    employees.push(res.result[i]);
                    convertDataToEmployeesTable(employees);
                }
            }
        }).error(function (err) {
            console.log(err);
        });
    }

    function convertDataToEmployeesTable(employees) {
        var employeesTmp = [];
        for (var i = 0; i < employees.length; i++) {
            employeesTmp.push({
                employee_code: employees[i].employee_code,
                name: employees[i].name,
                phone: employees[i].phone,
                state: employees[i].state
            });
        }
        addEmployeesToTable(employeesTmp);
    }

    function addEmployeesToTable(employees) {
        if (employees.length != 0) {
            t.clear();
            employees.forEach(function (value, index) {
                t.row.add([value.employee_code, value.name, value.phone, value.state.name]).draw(false);
            });
        }
        else {
            $('#body-info-employees').empty();
        }
    }

    function getAllStates() {
        $.ajax('/states', {
            method: 'GET'
        }).success(function (res) {
            if (res.status == 'success') {
                states = [];
                for (var i = 0; i < res.result.length; i++) {
                    states.push(res.result[i]);
                }
                addStatesToSelect(states);
            }
        }).error(function (err) {
            console.log(err);
        });
    }

    function addStatesToSelect(states) {
        console.log(states.length);
        $("#state-select").empty();
        var select = "";
        for (var i = 0; i < states.length; i++) {
            if (i == 0) {
                select = select + "<option value='" + states[i].id + "' selected = 'selected'>" + states[i].name + "</option> ";
            }
            else {
                select = select + "<option value='" + states[i].id + "'>" + states[i].name + "</option> ";
            }
        }
        $("#state-select").append(select);
    }

    function getProvincesByState(id) {
        $.ajax('/' + id + '/provinces', {
            method: 'GET'
        }).success(function (res) {
            if (res.status == 'success') {
                provinces = [];
                for (var i = 0; i < res.result.length; i++) {
                    provinces.push(res.result[i]);
                }
                addProvincesToSelect(provinces);
            }
        }).error(function (err) {
            console.log(err);
        });
    }

    function addProvincesToSelect(provinces) {
        if (provinces.length != 0) {
            $("#province-select").empty();
            var select = "";
            for (var i = 0; i < provinces.length; i++) {
                if (i == 0) {
                    select = select + "<option value='" + provinces[i].id + "' selected = 'selected'>" + provinces[i].name + "</option> ";
                }
                else {
                    select = select + "<option value='" + provinces[i].id + "'>" + provinces[i].name + "</option> ";
                }
            }
            $("#province-select").append(select);
            $("#province-select").val(provinces[0].id);
        }
        else {
            $("#select-provinces").empty();
        }
    }

    $("#state-select").on('change', function() {
        $("#province-select").empty();
        var stateId = $("#state-select").val();
        getProvincesByState(stateId);
    });

    $('#btn-see-result').on('click', function() {
        console.log('1');
        adminStatistic();
    });

    function adminStatistic() {
        var param = [
            {name : "start", value:"123232"},
            {name : "end", value:"5535353"},
            {name : "group_by", value:"day"},

        ];
        $.ajax('/statistic', {
            method: 'GET',
            data:param
        }).success(function (res) {
            if (res.status == 'success') {
                console.log(res);
            }
        }).error(function (err) {
            console.log(err);
        });
    }
})