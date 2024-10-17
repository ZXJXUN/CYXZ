class PersonPage {
    constructor() {
        this.examData = null;
        this.semesterIdToName = {};
        this.examInfoBySemester = {};
        this.classListByExamId = {};
        this.studentListByClassIdByExamId = {};
        this.studentNameToId = {};
        this.validExamList = [];
        this.examDetailByPerson = {};
        this.examIdToName = {};
        this.overallData = {};
        this.personScoresList = [];
    }
    async doGetExamInfo() {
        let response = await fetch(`api/scores/basic_info/exam`);
        let data = await response.json();
        return data;
    }
    async doGetClassListByExamId(examId) {
        let response = await fetch(`api/scores/basic_info/class/${examId}`);
        let data = await response.json();
        if (data["code"] == 200) {
            return data["data"]["classes"];
        }
        else {
            // TODO: Show error message if request failed?
        }
    }
    getExamInfo() {
        this.doGetExamInfo().then((data) => {
            if (data["code"] === 200) {
                this.examData = data["data"];


                this.examInfoBySemester = this.examData["exams"];
                for (const [semesterId, examInfoListOfSemester] of Object.entries(this.examInfoBySemester)) {
                    if (examInfoListOfSemester.length > 0) {
                        let thisId = examInfoListOfSemester[0]["semesterId"];
                        let thisName = examInfoListOfSemester[0]["semesterName"];
                        this.semesterIdToName[thisId] = thisName;
                    }
                }

                for (const [semesterId, examList] of Object.entries(this.examData["exams"])) {
                    let semesterName = this.semesterIdToName[semesterId]
                    for (const exam of examList) {
                        this.examIdToName[exam["examId"]] = `${semesterName}${exam["examName"]}`;
                    }
                }

                const gradeSelection = document.querySelector("#grade-selection");
                while (gradeSelection.firstChild) {
                    gradeSelection.removeChild(gradeSelection.firstChild);
                }

                for (const [semesterId, semesterName] of Object.entries(this.semesterIdToName)) {
                    const optionChild = document.createElement("option");
                    optionChild.value = semesterId;
                    optionChild.textContent = semesterName;
                    gradeSelection.appendChild(optionChild);
                }

                this.updateExamList(gradeSelection.value);
                const examSelection = document.querySelector("#exam-selection");
                this.updateClassList(examSelection.value);
            } else {
                // TODO: Show error message if request failed?
            }

        });
    }
    async doGetPersonData(studentId, examId) {
        let response = await fetch(`api/scores/data/by_person/${studentId}/exam/${examId}`);
        let data = await response.json();
        const studentSelection = document.querySelector("#student-selection");
        await this.updateValidExamList(this.studentNameToId[studentSelection.value]);
        return data;
    }
    updateExamList(semesterId) {
        const examSelection = document.querySelector("#exam-selection");
        while (examSelection.firstChild) {
            examSelection.removeChild(examSelection.firstChild);
        }
        let temp = this.examInfoBySemester[semesterId];
        for (const examInfoOfSemester of temp) {
            const optionChild = document.createElement("option");
            optionChild.value = examInfoOfSemester["examId"];
            optionChild.textContent = examInfoOfSemester["examName"];
            examSelection.appendChild(optionChild);
        }
    }
    updateClassList(examId) {
        const classSelection = document.querySelector("#class-selection");
        const examSelection = document.querySelector("#exam-selection");
        if (examId in this.classListByExamId) {
            while (classSelection.firstChild) {
                classSelection.removeChild(classSelection.firstChild);
            }
            for (const classId of this.classListByExamId[examId]) {
                const optionChild = document.createElement("option");
                optionChild.value = classId;
                optionChild.textContent = classId;
                classSelection.appendChild(optionChild);
            }
        }
        else {
            while (classSelection.firstChild) {
                classSelection.removeChild(classSelection.firstChild);
            }
            const loadingChild = document.createElement("option");
            loadingChild.textContent = "Loading...";
            classSelection.appendChild(loadingChild);
            this.doGetClassListByExamId(examId).then((classList) => {
                while (classSelection.firstChild) {
                    classSelection.removeChild(classSelection.firstChild);
                }
                this.classListByExamId[examId] = classList;
                for (const classId of this.classListByExamId[examId]) {
                    const optionChild = document.createElement("option");
                    optionChild.value = classId;
                    optionChild.textContent = classId;
                    classSelection.appendChild(optionChild);
                }
                this.updateStudentList(classSelection.value, examSelection.value);
            });
        }
    }
    async doGetClassInfo(classId, examId) {
        let response = await fetch(`api/scores/data/by_class/${classId}/exam/${examId}`);
        let data = await response.json();
        return data;
    }
    updateStudentList(classId, examId) {
        const studentSelectionData = document.querySelector("#student-list");
        if (examId in this.studentListByClassIdByExamId) {
            let studentListByClassId = this.studentListByClassIdByExamId[examId];
            if (classId in studentListByClassId) {
                while (studentSelectionData.firstChild) {
                    studentSelectionData.removeChild(studentSelectionData.firstChild);
                }
                for (const studentName of this.studentListByClassIdByExamId[examId][classId]) {
                    const optionChild = document.createElement("option");
                    optionChild.value = studentName;
                    optionChild.textContent = studentName;
                    studentSelectionData.appendChild(optionChild);
                }
            } else {
                this.doGetClassInfo(classId, examId).then((data) => {
                    if (data["code"] === 200) {
                        this.studentListByClassIdByExamId[examId][classId] = [];
                        for (const scoreObject of data["data"]["scores"]) {
                            this.studentListByClassIdByExamId[examId][classId].push(scoreObject["name"]);
                            this.studentNameToId[scoreObject["name"]] = scoreObject["id"];
                        }
                        while (studentSelectionData.firstChild) {
                            studentSelectionData.removeChild(studentSelectionData.firstChild);
                        }
                        for (const studentName of this.studentListByClassIdByExamId[examId][classId]) {
                            const optionChild = document.createElement("option");
                            optionChild.value = studentName;
                            optionChild.textContent = studentName;
                            studentSelectionData.appendChild(optionChild);
                        }
                    } else {
                        // TODO: Show error message if request failed?
                    }
                });
            }
        } else {
            this.doGetClassInfo(classId, examId).then((data) => {
                if (data["code"] === 200) {
                    this.studentListByClassIdByExamId[examId] = {};
                    this.studentListByClassIdByExamId[examId][classId] = [];
                    for (const scoreObject of data["data"]["scores"]) {
                        this.studentListByClassIdByExamId[examId][classId].push(scoreObject["name"]);
                        this.studentNameToId[scoreObject["name"]] = scoreObject["id"];
                    }
                    while (studentSelectionData.firstChild) {
                        studentSelectionData.removeChild(studentSelectionData.firstChild);
                    }
                    for (const studentName of this.studentListByClassIdByExamId[examId][classId]) {
                        const optionChild = document.createElement("option");
                        optionChild.value = studentName;
                        optionChild.textContent = studentName;
                        studentSelectionData.appendChild(optionChild);
                    }
                } else {
                    // TODO: Show error message if request failed?
                }
            });
        }
    }

    subjectCmp(a, b) {
        if (a["rank"] > b["rank"]) {
            return 1;
        } else if (a["rank"] < b["rank"]) {
            return -1;
        } else {
            return 0;
        }
    }

    deltaSubjectCmp(a, b) {
        if (a["deltaRank"] > b["deltaRank"]) {
            return -1;
        } else if (a["deltaRank"] < b["deltaRank"]) {
            return 1;
        } else {
            return 0;
        }
    }

    async updateStudentScoreTable(studentId, examId) {
        let data = await (this.doGetPersonData(studentId, examId));

        if (data["code"] === 200) {
            const scoreTbody = document.querySelector(".student-score-table tbody");
            while (scoreTbody.firstChild) {
                scoreTbody.removeChild(scoreTbody.firstChild);
            }
            let scoresList = data["data"]["scores"];
            this.personScoresList = scoresList;
            let lastExamId = this.getLastValidExamId(examId);

            const chartSelectDiv = document.querySelector("#student-score-chart-select-div");

            // Show the chart select div
            document.getElementById('student-score-overview-container').style.display = 'block';
            document.getElementById('student-score-overview-chart-container').style.display = 'block';
            document.getElementById('student-score-chart-container').style.display = 'block';

            while (chartSelectDiv.firstChild) {
                chartSelectDiv.removeChild(chartSelectDiv.firstChild);
            }

            let showLst = Object.keys(subjectIdToName);
            showLst.splice(showLst.indexOf(255), 1);
            showLst.unshift(255);
            const bestSubjectSpan = document.querySelector("#student-score-overview-analysis-best-subject");
            const worstSubjectSpan = document.querySelector("#student-score-overview-analysis-worst-subject");
            const betterSubjectSpan = document.querySelector("#student-score-overview-analysis-better-subject");
            const worseSubjectSpan = document.querySelector("#student-score-overview-analysis-worse-subject");
            let subjectArray = [];
            let deltaSubjectArray = [];
            for (const [subjectId, subjectName] of Object.entries(subjectIdToName)) {
                if (subjectId in scoresList) {
                    let score = scoresList[subjectId][0];
                    let classRank = scoresList[subjectId][1];
                    let gradeRank = scoresList[subjectId][2];
                    const thisTr = document.createElement("tr");
                    const subjectNameTd = document.createElement("td");
                    subjectNameTd.textContent = subjectName;
                    thisTr.appendChild(subjectNameTd);
                    const scoreTd = document.createElement("td");
                    scoreTd.textContent = score;
                    thisTr.appendChild(scoreTd);
                    const avgScoreTd = document.createElement("td");
                    avgScoreTd.textContent = `${scoresList[subjectId][4].toFixed(1)}/${scoresList[subjectId][7].toFixed(1)}`;
                    thisTr.append(avgScoreTd);
                    const maxScoreTd = document.createElement("td");
                    maxScoreTd.textContent = `${scoresList[subjectId][3]}/${scoresList[subjectId][6]}`;
                    thisTr.append(maxScoreTd);
                    const totalTd = document.createElement("td");
                    const classRankTd = document.createElement("td");
                    const gradeRankTd = document.createElement("td");
                    if (subjectId != 255) {
                        subjectArray.push({
                            "name": subjectName,
                            "rank": gradeRank / scoresList[subjectId][8]
                        });
                    }

                    if (lastExamId != -1) {
                        let lastClassRank = this.examDetailByPerson[lastExamId][subjectId][1];
                        let lastGradeRank = this.examDetailByPerson[lastExamId][subjectId][2];
                        let deltaClassRank = lastClassRank - classRank;
                        let deltaGradeRank = lastGradeRank - gradeRank;
                        classRankTd.innerHTML = `${classRank} <span style="color: ${deltaClassRank < 0 ? 'red' : 'green'}">(${deltaClassRank >= 0 ? '+' : ''}${deltaClassRank})</span>`;
                        gradeRankTd.innerHTML = `${gradeRank} <span style="color: ${deltaGradeRank < 0 ? 'red' : 'green'}">(${deltaGradeRank >= 0 ? '+' : ''}${deltaGradeRank})</span>`;
                        if (subjectId != 255) {
                            deltaSubjectArray.push({
                                "name": subjectName,
                                "deltaRank": deltaGradeRank / scoresList[subjectId][8]
                            });
                        }

                    }
                    else {
                        classRankTd.textContent = classRank;
                        gradeRankTd.textContent = gradeRank;
                    }
                    thisTr.appendChild(classRankTd);
                    thisTr.appendChild(gradeRankTd);
                    totalTd.textContent = `${scoresList[subjectId][5]}/${scoresList[subjectId][8]}`;
                    thisTr.append(totalTd);
                    scoreTbody.appendChild(thisTr);
                }
            }
            for (const subjectId of showLst) {
                if (subjectId in scoresList) {
                    const thisBtn = document.createElement("button");
                    thisBtn.textContent = subjectIdToName[subjectId];
                    thisBtn.classList.add("subject-button");
                    thisBtn.addEventListener("click", () => {
                        this.drawChart(subjectId);
                    });
                    chartSelectDiv.appendChild(thisBtn);
                }

            }
            subjectArray.sort(this.subjectCmp);
            deltaSubjectArray.sort(this.deltaSubjectCmp);
            const betterDiv = document.querySelector("#better-div");
            const worseDiv = document.querySelector("#worse-div");
            betterDiv.style.display = "none";
            worseDiv.style.display = "none";
            let subjectNameArray = [];
            for (const subject of subjectArray) {
                subjectNameArray.push(subject["name"]);
            }
            if (subjectArray.length > 0) {
                bestSubjectSpan.textContent = subjectNameArray.slice(0, 2).join("、");
            }
            if (subjectArray.length > 2) {
                worstSubjectSpan.textContent = subjectNameArray.slice(subjectArray.length - 2, subjectArray.length).join("、");
            }
            const overallAnalysisDiv = document.querySelector("#student-score-overview-analysis");
            overallAnalysisDiv.style.display = "block";
            if (deltaSubjectArray.length > 0) {
                let betterCount = 0;
                let worseCount = 0;
                let betterList = [];
                let worseList = [];

                for (const deltaSubject of deltaSubjectArray) {
                    if (deltaSubject["deltaRank"] > 0.05) {
                        betterList.push(deltaSubject["name"]);
                        betterCount++;
                    } else if (deltaSubject["deltaRank"] < -0.05) {
                        worseList.push(deltaSubject["name"]);
                        worseCount++;
                    }
                }

                if (betterCount > 0) {
                    betterDiv.style.display = "block";
                    betterSubjectSpan.textContent = betterList.join("、");
                }
                if (worseCount > 0) {
                    worseDiv.style.display = "block";
                    worseSubjectSpan.textContent = worseList.join("、");
                }
            }
            // Add selected class to the selected button
            var buttons = document.querySelectorAll('.subject-button');
            buttons.forEach(function (button) {
                button.addEventListener('click', function () {
                    buttons.forEach(function (btn) {
                        btn.classList.remove('selected');
                        btn.disabled = false; // enable all buttons
                    });
                    button.classList.add('selected');
                    button.disabled = true; // disable the selected button
                });
            });

            for (const btn of buttons) {
                if (btn.textContent === "总分") {
                    btn.classList.add("selected");
                    btn.disabled = true;
                }
            }

        } else {
            // TODO: Show error message if request failed?
        }

    }
    async doGetExamListByPerson(studentId) {
        let response = await fetch(`api/scores/data/by_person/${studentId}/exam`);
        let data = await response.json();
        return data;
    }
    async updateValidExamList(studentId) {
        let data = await this.doGetExamListByPerson(studentId);
        if (data["code"] === 200) {
            this.validExamList = data["data"]["exams"];
        } else {
            // TODO: Show error message if request failed?
        }
    }
    getLastValidExamId(examId) {

        if (this.validExamList.length > 0) {
            let temp = -1;
            for (const id of this.validExamList) {
                if (id < examId) {
                    temp = id;
                } else {
                    break;
                }
            }
            return temp;
        } else {
            return -1;
        }
    }

    getBeginValidExamIdLst(examId, count) {
        let tempLst = this.validExamList;
        tempLst.reverse();
        if (tempLst.length > 0) {
            let flag = 0;
            let current = 0;
            let resultLst = [];
            for (const id of tempLst) {
                if (id === examId) {
                    flag = 1;
                }
                if (current >= count) {
                    break;
                }
                if (flag) {
                    resultLst.push(id);
                    current ++;
                }
            }
            return resultLst.reverse();
        } else {
            return -1;
        }
    }

    async doGetExamDetailByPerson(studentId) {
        let response = await fetch(`api/scores/data/by_person/${studentId}/exam_detail`);
        let data = await response.json();
        return data;
    }

    async getExamDetailByPerson(studentId) {
        let data = await this.doGetExamDetailByPerson(studentId);
        if (data["code"] === 200) {
            this.examDetailByPerson = data["data"]["examDetails"];
        } else {
            // TODO: Show error message if request failed?
        }

    }

    drawChart(subjectId) {
        const chartDiv = document.querySelector("#student-score-chart-div");
        while (chartDiv.firstChild) {
            chartDiv.removeChild(chartDiv.firstChild);
        }

        let show = 0;
        const thisDiv = document.createElement("div");
        thisDiv.setAttribute("class", "subject-group-div");
        thisDiv.style.display = "flex";
        const scoreCanvas = document.createElement("canvas");
        const rankCanvas = document.createElement("canvas");

        const scoreContainer = document.createElement("div");
        scoreContainer.setAttribute("class", "chart-container");
        scoreContainer.style.flex = 1;
        const rankContainer = document.createElement("div");
        rankContainer.setAttribute("class", "chart-container");
        rankContainer.style.flex = 1;

        let labels = [];
        let scores = [];
        let classMaxScores = [];
        let classAvgScores = [];
        let gradeMaxScores = [];
        let gradeAvgScores = [];
        let gradeRanks = [];
        const examSelection = document.querySelector("#exam-selection");
        let showLst = this.getBeginValidExamIdLst(Number(examSelection.value), 10);
        for (const examId of showLst) {
            const examDetail = this.examDetailByPerson[examId];
            if (subjectId in examDetail) {
                show = 1;
                labels.push(this.examIdToName[examId]);
                scores.push(examDetail[subjectId][0]);
                gradeRanks.push(examDetail[subjectId][2]);
                classMaxScores.push(examDetail[subjectId][3]);
                classAvgScores.push(examDetail[subjectId][4]);
                gradeMaxScores.push(examDetail[subjectId][5]);
                gradeAvgScores.push(examDetail[subjectId][6]);
            }

        }

        let minScore = Math.max(Math.min(...scores, ...classAvgScores, ...gradeAvgScores) - 10, 0);
        let maxScore = subjectFullScore[subjectId];


        new Chart(scoreCanvas, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "分数",
                        data: scores,
                        borderColor: "#007bff",
                        fill: false
                    },
                    {
                        label: "班级平均分",
                        data: classAvgScores,
                        borderColor: "#6c25be",
                        fill: false,
                        hidden: true,
                        borderDash: [5, 5] // Make this line dashed
                    },
                    {
                        label: "班级最高分",
                        data: classMaxScores,
                        borderColor: "#D716D9",
                        fill: false,
                        hidden: true
                    },
                    {
                        label: "年级平均分",
                        data: gradeAvgScores,
                        borderColor: "#bea925",
                        fill: false,
                        borderDash: [5, 5] // Make this line dashed
                    },
                    {
                        label: "年级最高分",
                        data: gradeMaxScores,
                        borderColor: "#DF7F10",
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        min: minScore,
                        max: maxScore
                    }
                }
            }
        }
        );

        new Chart(rankCanvas, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "年级排名",
                        data: gradeRanks,
                        borderColor: "#007bff",
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        reverse: true
                    }
                }
            }
        }
        );

        scoreContainer.appendChild(scoreCanvas);
        rankContainer.appendChild(rankCanvas);
        thisDiv.appendChild(scoreContainer);
        thisDiv.appendChild(rankContainer);
        if (show) {
            chartDiv.appendChild(thisDiv);
        }
    }

    async doGetOverallData(examId) {
        let response = await fetch(`api/scores/basic_info/subject_overall_data/exam/${examId}`);
        let data = await response.json();
        return data;
    }

    drawOverallChart() {
        const overallChartDiv = document.querySelector("#student-score-overview-chart-div");
        const overallChartCanvas = document.createElement("canvas");
        while (overallChartDiv.firstChild) {
            overallChartDiv.removeChild(overallChartDiv.firstChild);
        }
        let showLst = [];
        let labels = [];

        for (const [subjectId, subjectName] of Object.entries(subjectIdToName)) {
            if (subjectId in this.personScoresList && subjectId != 255) {
                showLst.push((1 - ((this.personScoresList[subjectId][1] - 1) / (this.personScoresList[subjectId][5] - 1))) * 100);
                labels.push(subjectName);
            }
        }

        new Chart(overallChartCanvas, {
            type: "radar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "发挥水平",
                        data: showLst,
                        borderColor: "#007bff",
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    r: {
                        ticks: {
                            display: false
                        },
                        min: 0,
                        max: 100
                    }
                }
            }
        });
        overallChartDiv.appendChild(overallChartCanvas);
    }

    initEventListeners() {
        this.getExamInfo();
        const studentSelection = document.querySelector("#student-selection");
        studentSelection.addEventListener("input", (event) => {
            if (event.target.value.trim() != "") {
                const submitButton = document.querySelector("#student-submit");
                submitButton.disabled = false;
            }
            else {
                submitButton.disabled = true;
            }
        });

        const classSelection = document.querySelector("#class-selection");
        classSelection.addEventListener("change", (event) => {
            this.updateStudentList(event.target.value, examSelection.value);
        });

        const submitButton = document.querySelector("#student-submit");
        submitButton.addEventListener("click", () => {
            submitButton.disabled = true;
            submitButton.textContent = "Loading...";

            this.updateValidExamList(this.studentNameToId[studentSelection.value]).then(() => {
                this.getExamDetailByPerson(this.studentNameToId[studentSelection.value]).then(() => {
                    this.updateStudentScoreTable(this.studentNameToId[studentSelection.value], examSelection.value).then(() => {
                        this.drawChart(255);
                        this.drawOverallChart();
                        submitButton.disabled = false;
                        submitButton.textContent = "查询";
                    })

                });
            });
        });

        const gradeSelection = document.querySelector("#grade-selection");
        gradeSelection.addEventListener("change", (event) => {
            const classSelectionPreviousIndex = classSelection.selectedIndex;
            this.updateExamList(event.target.value);
            classSelection.selectedIndex = classSelectionPreviousIndex;

        });

        const examSelection = document.querySelector("#exam-selection");
        examSelection.addEventListener("change", (event) => {
            const classSelectionPreviousIndex = classSelection.selectedIndex;
            this.updateClassList(event.target.value);
            setTimeout(() => {
                classSelection.selectedIndex = classSelectionPreviousIndex;
            }, 50);


        });


    }
}

// Create the instance manually when user directly open person page.
if (!("personPage" in window)) {
    window["personPage"] = new PersonPage();
    window.personPage.initEventListeners();
}