
/**
 * 학생 목록 테이블 출력
 * @param {*} students  
 */
const renderingStudents = function (students) {
  const tbody = document.querySelector("#studentList");
  const tfoot = document.querySelector("#scoreList");
  let trs = "";
  let trs2 = "";
  let totalSum = 0;
  let totalAverage = 0;
  students.forEach(student => {
    trs += `
      <tr>
        <td>${student.ssn}</td>
        <td>${student.name}</td>
        <td>${student.korean}</td>
        <td>${student.english}</td>
        <td>${student.math}</td>
        <td>${student.getSum()}</td>
        <td>${student.getAverage()}</td>
        <td>순위미완성</td>
      </tr>
    `;
    totalSum = totalSum + student.getSum();
    totalAverage = ((totalSum/3) / students.length).toFixed(1);
  });
  students.forEach(student => {
    trs2 = `
       <tr>
        <th scope="row"></th>
        <th colspan="4">전체 평균</th>
        <th>${totalSum/students.length}</th>
        <th>${totalAverage}</th>
        <td></td>
      </tr>
    `;
  });
  tbody.innerHTML = trs;
  tfoot.innerHTML = trs2;
}

// 학생테이블 tbody 순위
const rank = function () {

}

// 등록
const createStudent = function (studentService) {
  const ssn = document.studentForm.ssn.value;
  const name = document.studentForm.name.value;
  const korean = document.studentForm.korean.value;
  const english = document.studentForm.english.value;
  const math = document.studentForm.math.value;

  // 입력 데이터 데이터 유효성 검증
  if (Validator.isEmpty(ssn) || !Validator.isNumber(ssn)) {
    alert("학번을 숫자로 입력하여 주세요");
    document.studentForm.ssn.value = "";
    document.studentForm.ssn.focus();
    return;
  }
  // studentService 객체에 신규 학생 등록
  studentService.addStudent(new Student(ssn, name, parseInt(korean), parseInt(english), parseInt(math)));
  inputFieldReset();
  // 학생 등록 완료 후 전체 목록 반환 후 출력
  const students = studentService.findAll();
  renderingStudents(students);
}

// input 초기화
const inputFieldReset = function () {
  const fields = document.querySelectorAll("input[type='text']");
  fields.forEach((field) => {
    field.value = "";
  })
}

// 학생 삭제
const removeStudent = function (studentService) {
  const ssn = document.querySelector("#ssn").value;
  const name = document.querySelector("#name").value;
  const students = studentService.findAll();

  for (let i = 0; i < students.length; i++) {
    if (students[i].ssn === ssn && students[i].name === name) {
      students.splice(i, 1);
    }
  }

  inputFieldReset();
  renderingStudents(students);
  return;
}

// 검색
const searchStudent = function (studentService) {
  const searchSelect = document.querySelector("#input-group-search")
  const searchText = document.querySelector("#searchText")
  const students = studentService.findAll();
  let searchStudents = [];
  for (let i = 0; i < students.length; i++) {
    if (searchSelect.value === "ssnSearch") {
      if (searchText.value.trim() === "") {
        renderingStudents(students);
        return;
      }
      searchStudents = students.filter(student => student.ssn === searchText.value);
      renderingStudents(searchStudents);
      return;
    } else if (searchSelect.value === "nameSearch") {
      if (searchText.value.trim() === "") {
        renderingStudents(students);
        return;
      }
      searchStudents = students.filter(student => student.name === searchText.value);
      renderingStudents(searchStudents);
      return;
    }
  } alert("검색 실패")
}

// 정렬
const sortList = function (select, studentService) {
  const students = studentService.findAll();

  if (select === 'ssnSort') {
    students.sort((a, b) =>
      parseInt(a.ssn) - parseInt(b.ssn)
    );
  } else if (select === 'nameSort') {
    students.sort((a, b) =>
      a.name.charCodeAt(0) - b.name.charCodeAt(0)
    );
  }
  else if (select === 'sumSort') {
    students.sort((a, b) =>
      b.getSum() - a.getSum()
    );
  }
  renderingStudents(students);
}

/**
 * 이벤트타겟에 이벤트핸들러 등록
 */
const eventRegister = function () {
  // 학생 성적 관리 서비스 객체
  let studentService = null;
  // 문서 로드이벤트 처리
  window.addEventListener("load", function () {
    studentService = new StudentService();
    // 더미데이터(학생) 등록
    const student = new Student('10', "가가가", 80, 50, 95);
    studentService.addStudent(student);
    studentService.addStudent(new Student('11', "나나나", 90, 100, 90));
    studentService.addStudent(new Student('12', "다다다", 60, 75, 60));
    studentService.addStudent(new Student('13', "라라라", 70, 95, 65));
    // 학생 전체 목록 출력
    const students = studentService.findAll();
    renderingStudents(students);
  });

  // 학생 등록 이벤트 처리
  document.querySelector("#addButton").addEventListener("click", event => createStudent(studentService));

  // 학생 삭제 이벤트 처리
  document.querySelector("#removeButton").addEventListener("click", event => removeStudent(studentService));

  // 검색 이벤트 처리
  document.querySelector("#button-addon2").addEventListener("click", event => searchStudent(studentService));

  // 정렬 이벤트 처리
  document.querySelector("#input-group-sort").addEventListener("change", event => {
    const select = document.querySelector("#input-group-sort").value;
    sortList(select, studentService)
  })
}

/**
 * 실행 진입점
 */
function main() {
  eventRegister();
}
main();