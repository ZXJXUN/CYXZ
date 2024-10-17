class ClassPage {
    constructor() {
        this.examData = {};
        this.examIdToName = {};
        this.examInfoBySemester = {};
        this.semesterIdToName = {};
        this.semesterIdToName = {};
        this.classListByExamId = {};
        this.classAnalysis = {};
        this.overallData = {};
        this.validExamList = [];
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

    async doGetValidNum(examId, classId) {
        let response = await fetch(`api/scores/basic_info/by_class/${classId}/exam/${examId}`);
        let data = await response.json();
        return data;
    }

    async doGetClassAnalysis(examId, classId) {
        let response = await fetch(`api/scores/analysis/by_class/${classId}/exam/${examId}`);
        let data = await response.json();
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
            });
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

    async doGetOverallData(examId) {
        let response = await fetch(`api/scores/basic_info/subject_overall_data/exam/${examId}`);
        let data = await response.json();
        return data;
    }

    async getOverallData(examId) {
        let data = await this.doGetOverallData(examId);
        if (data["code"] === 200) {
            this.overallData = data["data"]["overallData"];
        }
        else {
            // TODO: Show error message if request failed?
        }
    }

    async getClassAnalysis(examId, classId) {
        let data = await this.doGetClassAnalysis(examId, classId)
        if (data["code"] === 200) {
            const analysisResult = data["data"];
            this.classAnalysis = analysisResult;
            const analysisTableBody = document.querySelector(".analysis-table tbody");
            const subjectSelectionDiv = document.querySelector(".subject-selection-div");
            while (analysisTableBody.firstChild) {
                analysisTableBody.removeChild(analysisTableBody.firstChild);
            }
            while (subjectSelectionDiv.firstChild) {
                subjectSelectionDiv.removeChild(subjectSelectionDiv.firstChild);
            }
            for (const [subjectId, subjectAnalysis] of Object.entries(analysisResult)) {
                const thisTr = document.createElement("tr");
                const subjectNameTd = document.createElement("td");
                const gradeAvgTd = document.createElement("td");
                const gradeMaxTd = document.createElement("td");
                const classAvgTd = document.createElement("td");
                const classAvgRankTd = document.createElement("td");
                const classMaxTd = document.createElement("td");
                const classMaxNameTd = document.createElement("td");
                const firstTenAvgTd = document.createElement("td");
                const firstTenAvgRankTd = document.createElement("td");
                const lastTenAvgTd = document.createElement("td");
                const lastTenAvgRankTd = document.createElement("td");

                subjectNameTd.textContent = subjectIdToName[subjectId];
                gradeAvgTd.textContent = this.overallData[subjectId]["gradeAvgScore"].toFixed(1);
                gradeMaxTd.textContent = this.overallData[subjectId]["gradeMaxScore"].toFixed(1);
                const deltaAvgScore = subjectAnalysis["classAvgScore"] - this.overallData[subjectId]["gradeAvgScore"];
                classAvgTd.innerHTML = `<span style="color: ${deltaAvgScore < 0 ? 'red' : 'green'}">${subjectAnalysis["classAvgScore"].toFixed(1)}</span>`;
                classAvgRankTd.textContent = subjectAnalysis["classAvgRank"];
                classMaxTd.textContent = subjectAnalysis["firstScore"].toFixed(1);
                classMaxNameTd.textContent = subjectAnalysis["firstName"];
                firstTenAvgTd.textContent = subjectAnalysis["first10AvgScore"].toFixed(1);
                firstTenAvgRankTd.textContent = subjectAnalysis["first10AvgRank"];
                lastTenAvgTd.textContent = subjectAnalysis["last10AvgScore"].toFixed(1);
                lastTenAvgRankTd.textContent = subjectAnalysis["last10AvgRank"];

                thisTr.appendChild(subjectNameTd);
                thisTr.appendChild(gradeAvgTd);
                thisTr.appendChild(gradeMaxTd);
                thisTr.appendChild(classAvgTd);
                thisTr.appendChild(classAvgRankTd);
                thisTr.appendChild(classMaxTd);
                thisTr.appendChild(classMaxNameTd);
                thisTr.appendChild(firstTenAvgTd);
                thisTr.appendChild(firstTenAvgRankTd);
                thisTr.appendChild(lastTenAvgTd);
                thisTr.appendChild(lastTenAvgRankTd);

                analysisTableBody.appendChild(thisTr);

                
            }

            const totalBtn = document.createElement("button");
            totalBtn.textContent = "总分";
            totalBtn.addEventListener("click", () => {
                this.showClassAnalysisBySubject(classId, 255, totalBtn);
            });
            subjectSelectionDiv.appendChild(totalBtn);

            for (const subjectId of Object.keys(analysisResult)) {
                if (subjectId != 255) {
                    const thisBtn = document.createElement("button");
                    thisBtn.textContent = subjectIdToName[subjectId];
                    thisBtn.addEventListener("click", () => {
                    this.showClassAnalysisBySubject(classId, subjectId, thisBtn);
                    });
                    subjectSelectionDiv.appendChild(thisBtn);
                }
            }
            this.showClassAnalysisBySubject(classId, 255, totalBtn);
        }
        else {
            // TODO: Show error message if request failed?
        }
    }
    async doGetClassAnalysisBySubject(classId, subjectId) {
        let response = await fetch(`api/scores/data/chart_data/by_subject/${subjectId}/by_class/${classId}`);
        let data = await response.json();
        return data;
    }

    async doGetValidExamList(class_id) {
        const response = await fetch(`api/scores/data/basic_info/by_class/${class_id}/valid_exam`);
        return await response.json();
    }

    async updateValidExamList(class_id) {
        const validExamList = await this.doGetValidExamList(class_id);
        if (validExamList["code"] === 200) {
            this.validExamList = validExamList["data"]["validExams"];
        } else {
            // TODO: Show error message if request failed?
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

    showClassAnalysisBySubject(classId, subjectId, thisBtn) {
        const subjectSelectionDiv = document.querySelector(".subject-selection-div");
        const childButtonLst = subjectSelectionDiv.children;
        for (const childButton of childButtonLst) {
            childButton.disabled = true;
        }
        thisBtn.textContent = "Loading...";
        const subjectChartDiv = document.querySelector(".subject-chart-div");
        while (subjectChartDiv.firstChild) {
            subjectChartDiv.removeChild(subjectChartDiv.firstChild);
        }
        this.doGetClassAnalysisBySubject(classId, subjectId).then((data) => {
            if (data["code"] === 200) {

                const classTotalContainer = document.createElement("div");
                classTotalContainer.setAttribute("class", "total-chart-container");

                const classAvgContainer = document.createElement("div");
                classAvgContainer.setAttribute("class", "chart-container");
                const classAvgCanvas = document.createElement("canvas");
                classAvgContainer.appendChild(classAvgCanvas);

                const classAvgRankContainer = document.createElement("div");
                classAvgRankContainer.setAttribute("class", "chart-container");
                const classAvgRankCanvas = document.createElement("canvas");
                classAvgRankContainer.appendChild(classAvgRankCanvas);

                classTotalContainer.appendChild(classAvgContainer);
                classTotalContainer.appendChild(classAvgRankContainer);

                const classFirstTenContainer = document.createElement("div");
                classFirstTenContainer.setAttribute("class", "first-chart-container");
                const classFirstTenAvgContainer = document.createElement("div");
                classFirstTenAvgContainer.setAttribute("class", "chart-container");
                const classFirstTenAvgCanvas = document.createElement("canvas");
                classFirstTenAvgContainer.appendChild(classFirstTenAvgCanvas);

                const classFirstTenRankContainer = document.createElement("div");
                classFirstTenRankContainer.setAttribute("class", "chart-container");
                const classFirstTenRankCanvas = document.createElement("canvas");
                classFirstTenRankContainer.appendChild(classFirstTenRankCanvas);

                classFirstTenContainer.appendChild(classFirstTenAvgContainer);
                classFirstTenContainer.appendChild(classFirstTenRankContainer);

                const classLastTenContainer = document.createElement("div");
                classLastTenContainer.setAttribute("class", "last-chart-container");
                const classLastTenAvgContainer = document.createElement("div");
                classLastTenAvgContainer.setAttribute("class", "chart-container");
                const classLastTenAvgCanvas = document.createElement("canvas");
                classLastTenAvgContainer.appendChild(classLastTenAvgCanvas);

                const classLastTenRankContainer = document.createElement("div");
                classLastTenRankContainer.setAttribute("class", "chart-container");
                const classLastTenRankCanvas = document.createElement("canvas");
                classLastTenRankContainer.appendChild(classLastTenRankCanvas);

                classLastTenContainer.appendChild(classLastTenAvgContainer);
                classLastTenContainer.appendChild(classLastTenRankContainer);

                const stdContainer = document.createElement("div");
                stdContainer.setAttribute("class", "std-container");
                const stdCanvas = document.createElement("canvas");
                stdContainer.appendChild(stdCanvas);

                let labels = [];
                let classAvgLst = [];
                let gradeAvgLst = [];
                let classAvgRankLst = [];
                let classStdLst = [];
                let firstTenAvgLst = [];
                let firstTenAvgRankLst = [];
                let firstTenStdLst = [];
                let lastTenAvgLst = [];
                let lastTenAvgRankLst = [];
                let lastTenStdLst = [];

                const examSelection = document.querySelector("#exam-selection");
                const thisExam = Number(examSelection.value);
                const showExamLst = this.getBeginValidExamIdLst(thisExam, 10);
                for (const examId of showExamLst) {
                    let chartData = data["data"]["chartData"][examId];
                    labels.push(this.examIdToName[examId]);
                    classAvgLst.push(chartData["avgScore"]);
                    gradeAvgLst.push(chartData["gradeAvgScore"]);
                    classAvgRankLst.push(chartData["avgScoreRank"]);
                    classStdLst.push(chartData["std"]);
                    firstTenAvgLst.push(chartData["first10AvgScore"]);
                    firstTenAvgRankLst.push(chartData["first10AvgScoreRank"]);
                    firstTenStdLst.push(chartData["first10std"]);
                    lastTenAvgLst.push(chartData["last10AvgScore"]);
                    lastTenAvgRankLst.push(chartData["last10AvgScoreRank"]);
                    lastTenStdLst.push(chartData["last10std"]);

                }

                let minScore = Math.max(Math.min(...classAvgLst, ...gradeAvgLst, ...lastTenAvgLst) - 10, 0);
                let maxScore = subjectFullScore[subjectId];

                let minStd = 0;
                let maxStd = Math.max(...classStdLst, ...firstTenStdLst, ...lastTenStdLst) + 5;
                new Chart(classAvgCanvas, {
                    type: "line",
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: "班级平均分",
                                data: classAvgLst,
                                borderColor: "#007bff",
                                fill: false
                            },
                            {
                                label: "年级平均分",
                                data: gradeAvgLst,
                                borderColor: "#bea925",
                                fill: false,
                                borderDash: [5, 5] // Make this line dashed
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

                new Chart(classAvgRankCanvas, {
                    type: "line",
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: "班级平均分排名",
                                data: classAvgRankLst,
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

                new Chart(classFirstTenAvgCanvas, {
                    type: "line",
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: "班级前十平均分",
                                data: firstTenAvgLst,
                                borderColor: "#007bff",
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

                new Chart(classFirstTenRankCanvas, {
                    type: "line",
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: "班级前十平均分排名",
                                data: firstTenAvgRankLst,
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

                new Chart(classLastTenAvgCanvas, {
                    type: "line",
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: "班级后十平均分",
                                data: lastTenAvgLst,
                                borderColor: "#007bff",
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

                new Chart(classLastTenRankCanvas, {
                    type: "line",
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: "班级后十平均分排名",
                                data: lastTenAvgRankLst,
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

                new Chart(stdCanvas, {
                    type: "line",
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: "班级标准差",
                                data: classStdLst,
                                borderColor: "#007bff",
                                fill: false
                            },
                            {
                                label: "班级前十标准差",
                                data: firstTenStdLst,
                                borderColor: "#6c25be",
                                fill: false
                            },
                            {
                                label: "班级后十标准差",
                                data: lastTenStdLst,
                                borderColor: "#bea925",
                                fill: false
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                min: minStd,
                                max: maxStd
                            }
                        }
                    }

                }
                );
                subjectChartDiv.appendChild(classTotalContainer);
                subjectChartDiv.appendChild(classFirstTenContainer);
                subjectChartDiv.appendChild(classLastTenContainer);
                subjectChartDiv.appendChild(stdContainer);

                for (const childButton of childButtonLst) {
                    childButton.disabled = false;
                }
                thisBtn.disabled = true;
                thisBtn.textContent = subjectIdToName[subjectId];
            } else {
                // TODO: Show error message if request failed?
            }
        });
    }

    async getValidNum() {
        const examSelection = document.querySelector("#exam-selection");
        const classSelection = document.querySelector("#class-selection");
        const basicInfoDiv = document.querySelector(".basic-info-div");
        let data = await this.doGetValidNum(examSelection.value, classSelection.value)
        if (data["code"] === 200) {
            const validNum = data["data"]["validNum"];
            const validNumSpan = document.querySelector("#valid-num");
            validNumSpan.textContent = validNum;
            basicInfoDiv.style.display = "block";
        } else {
            // TODO: Show error message if request failed?
        }

    }

    initEventListeners() {
        this.getExamInfo();

        const classSelection = document.querySelector("#class-selection");

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

        const submitButton = document.querySelector("#class-submit");
        submitButton.addEventListener("click", (event) => {
            submitButton.textContent = "Loading...";
            submitButton.disabled = true;
            this.getValidNum();
            this.updateValidExamList(classSelection.value).then(() => {
                this.getOverallData(examSelection.value).then(() => {
                    this.getClassAnalysis(examSelection.value, classSelection.value).then(() => {
                        submitButton.disabled = false;
                        submitButton.textContent = "查询";
                    });
                });
            });
        });
    }
}

if (!("classPage" in window)) {
    window["classPage"] = new ClassPage();
    window.classPage.initEventListeners();
}
