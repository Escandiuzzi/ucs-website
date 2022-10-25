let req = new XMLHttpRequest();

req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
        loadPage(req.responseText);
    }
};

req.open("GET", "https://api.jsonbin.io/v3/b/63573cb965b57a31e6a16180/latest", true);
req.setRequestHeader("X-Master-Key", "$2b$10$uThXaux6iYQCRdmFOmsRouUIVF8zmoj1h/H0zXrXCpqtRBf2hC8IK");
req.send();

var dict = new Object();

function loadPage(data) {
    const parsedData = JSON.parse(data).record;

    loadHeader(parsedData);
    createTable(parsedData);

    loadModal();
}

function loadHeader(data) {
    var courseTitle = document.getElementById("course_title");
    courseTitle.innerHTML = data.CURSO;

    var courseCode = document.getElementById("course_code");
    courseCode.innerHTML = data.CODIGO_DO_CURSO;

    var duration = document.getElementById("duration");
    duration.innerHTML = data.DURACAO;

    var workload = document.getElementById("workload");
    workload.innerHTML = data.CARGA_HORARIA;
}

function createTable(data) {
    var classes = [];
    classes = data.DISCIPLINAS;

    const semester = document.createElement('div');
    const code = document.createElement('div');
    const name = document.createElement('div');
    const duration = document.createElement('div');

    const table = document.getElementById('table');

    semester.innerHTML = 'Semestre';
    semester.classList.add('item');

    code.innerHTML = 'Código da Disciplina';
    code.classList.add('item');

    name.innerHTML = 'Nome da Disciplina';
    name.classList.add('item');

    duration.innerHTML = 'Número de Horas';
    duration.classList.add('item');

    var color = '#ebedec';

    semester.style.backgroundColor = color;
    code.style.backgroundColor = color;
    name.style.backgroundColor = color;
    duration.style.backgroundColor = color;

    table.appendChild(semester);
    table.appendChild(code);
    table.appendChild(name);
    table.appendChild(duration);

    classes.forEach(element => {
        addRow(element, table);
    });
}

function addRow(row, table) {
    const semester = document.createElement('div');
    const code = document.createElement('div');
    const name = document.createElement('div');
    const duration = document.createElement('div');

    semester.innerHTML = row.SEMESTRE;
    semester.classList.add('item');
    semester.dataset.row = row.ORDEM;

    code.innerHTML = row.CODIGO;
    code.classList.add('item');
    code.dataset.row = row.ORDEM;

    name.innerHTML = row.DISCIPLINA;
    name.classList.add('item');
    name.dataset.row = row.ORDEM;

    duration.innerHTML = row.HORAS;
    duration.classList.add('item');
    duration.dataset.row = row.ORDEM;

    var color = row.SEMESTRE % 2 === 0 ? '#8db4f2' : '#f2f28d';

    semester.style.backgroundColor = color;
    code.style.backgroundColor = color;
    name.style.backgroundColor = color;
    duration.style.backgroundColor = color;

    table.appendChild(semester);
    table.appendChild(code);
    table.appendChild(name);
    table.appendChild(duration);

    dict[row.ORDEM] = {
        SEMESTRE: row.SEMESTRE,
        CODIGO: row.CODIGO,
        ORDEM: row.ORDEM,
        DISCIPLINA: row.DISCIPLINA,
        EMENTA: row.EMENTA,
        NAT: row.NAT,
        HORAS: row.HORAS,
        PREREQUISITOS: row.PREREQUISITOS != null ? row.PREREQUISITOS : null
    }
}

function loadModal() {
    $('.item').on('click', function () {
        var row = dict[$(this).data('row')];

        $('.modal').addClass('active');

        var modal = $('.modal-card');

        modal.find('#modal_course_code').html(row.CODIGO);
        modal.find('#modal_course_title').html(row.DISCIPLINA);
        modal.find('#modal_course_description').html(row.EMENTA);
        modal.find('#modal_course_infos').html(row.SEMESTRE + 'º Semestre - Modalidade ' + row.NAT + ' - Duração ' + row.HORAS);

        const div = document.getElementById('prerequisites');

        div.style.display = row.PREREQUISITOS == null ? 'none' : 'block';

        if (row.PREREQUISITOS != null) {
            if (Number.isInteger(row.PREREQUISITOS)) {
                addPrerequisite(row.PREREQUISITOS);
            } else {
                var prerequisites = row.PREREQUISITOS.split(",");
                prerequisites.forEach(x => addPrerequisite(parseInt(x)));
            }
        }

        $('body').css('overflow-y', 'hidden');
    });

    function addPrerequisite(index) {
        const container = document.getElementById('prerequisites-containter');

        const div = document.createElement('div');
        div.classList.add('pre-requisito');

        const prerequisite = dict[index];

        div.innerHTML = `
                            <h2 class='prerequisite-code'>${prerequisite.CODIGO}</h2> 
                            <h4 class='prerequisite-class'>${prerequisite.DISCIPLINA}</h4>
                        `;

        container.appendChild(div);
    }

    $('#close_modal').on('click', function () {
        $('#prerequisites-containter').empty();
        $('.modal').removeClass('active');
        $('body').css('overflow-y', 'auto');
    })
}