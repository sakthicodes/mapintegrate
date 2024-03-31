// document.addEventListener('contextmenu',Event =>{
//     Event.preventDefault();
// });
var nameOfWork = null;
function setNameOfWork() {
    var inputValue = document.getElementById("nameofwork").value;
    if (inputValue.trim() != "") nameOfWork = inputValue;
    var nowModal = document.getElementById('nowModal');
    $(nowModal).modal('hide');
}

$(document).ready(function () {
    $('.modal').draggable({
        handle: ".modal-header"
    });
});

document.getElementById('mainList').cells.item(0).innerHTML = document.getElementById('mainList').rowIndex;

var currentSerialNumber = 1;

function addRow() {
    var mainRow = $("#mainList");
    var newRow = mainRow.clone();

    newRow.attr('id', '');
    newRow.addClass('new-row');

    var lastRow = $("#listBody tr:last");
    if (lastRow.length > 0) {
        currentSerialNumber = parseInt(lastRow.find("td:first-child").text()) + 1;
    } else {
        currentSerialNumber++;
    }
    newRow.find("td:first-child").text(currentSerialNumber);

    var lastRow = $("#listBody tr:last");
    newRow.find('select[name="state"]').addClass('state');
    newRow.find('select[name="department"]').addClass('department');
    newRow.find('select[name="sor"]').addClass('sor');
    newRow.find('select[name="region"]').addClass('region');
    newRow.find('select[name="lrate"]').addClass('lrate');
    newRow.find('select[name="mrate"]').addClass('mrate');
    newRow.find('select[name="text"]').addClass('item_no');
    newRow.find('select[name="state"]').val(lastRow.find('select[name="state"]').val());
    newRow.find("input[type='text']").val(lastRow.find("input[type='text']").val());


    $.ajax({
        url: "seldept.php",
        type: "GET",
        data: {
            state: lastRow.find('select[name="state"]').val()
        }
    })
        .done(function (data) {
            newRow.find('select[name="department"]').empty().append(data);
            newRow.find('select[name="department"]').val(lastRow.find('select[name="department"]').val());
        })
        .fail(function (error) {
            console.error("Error fetching car models:", error);
        });

    $.ajax({
        url: "selsor.php",
        type: "GET",
        data: {
            state: lastRow.find('select[name="state"]').val(),
            department: lastRow.find('select[name="department"]').val()
        }
    })
        .done(function (data) {
            newRow.find('select[name="sor"]').empty().append(data);
            newRow.find('select[name="sor"]').val(lastRow.find('select[name="sor"]').val());
        })
        .fail(function (error) {
            console.error("Error fetching car models:", error);
        });

    $.ajax({
        url: "selregion.php",
        type: "GET",
        data: {
            state1: lastRow.find('select[name="state"]').val(),
            department1: lastRow.find('select[name="department"]').val()
        }
    })
        .done(function (data) {
            newRow.find('select[name="region"]').empty().append(data);
            newRow.find('select[name="region"]').val(lastRow.find('select[name="region"]').val());
        })
        .fail(function (error) {
            console.error("Error fetching car models:", error);
        });

    $.ajax({
        url: "sellabourrate.php",
        type: "GET",
        data: {
            state1: lastRow.find('select[name="state"]').val(),
            department1: lastRow.find('select[name="department"]').val()
        }
    })
        .done(function (data) {
            newRow.find('select[name="lrate"]').empty().append(data);
            newRow.find('select[name="lrate"]').val(lastRow.find('select[name="lrate"]').val());
        })
        .fail(function (error) {
            console.error("Error fetching car models:", error);
        });

    $.ajax({
        url: "selmaterialrate.php",
        type: "GET",
        data: {
            state1: lastRow.find('select[name="state"]').val(),
            department1: lastRow.find('select[name="department"]').val()
        }
    })
        .done(function (data) {
            newRow.find('select[name="mrate"]').empty().append(data);
            newRow.find('select[name="mrate"]').val(lastRow.find('select[name="mrate"]').val());
        })
        .fail(function (error) {
            console.error("Error fetching car models:", error);
        });

    $("#listBody").append(newRow);

    if ($("#listBody tr").length > 4) {
        $(".table-responsive").css({
            'max-height': '300px',
            'overflow-y': 'auto'
        });
    }
}

var manualRates = new Map();
var xcell_data = [];
var xcell_data_local = [];

function submitData() {
    var isCpohChecked = document.getElementById("exCpoh").checked;
    console.log(isCpohChecked)
    var ajaxCalls = [];
    var sort_values = [];
    $('#inputItemTable tbody tr').each(function (index, row) {
        var rowData = {
            state: $(row).find('select[name="state"]').val(),
            department: $(row).find('select[name="department"]').val(),
            sor: $(row).find('select[name="sor"]').val(),
            region: $(row).find('select[name="region"]').val(),
            lrate: $(row).find('select[name="lrate"]').val(),
            mrate: $(row).find('select[name="mrate"]').val(),
            itemNo: $(row).find('input[type="text"]').val()
        };

        var primary_table_name = null
        var lrate_table_name = null
        var mrate_table_name = null

        if (rowData.region == null) {
            rowData.region = ""
        }

        if (rowData.state != null && rowData.department != null) {
            primary_table_name = rowData.state.toLowerCase() + rowData.department.toLowerCase() + rowData.sor
        }
        if (rowData.lrate != null) {
            lrate_table_name = rowData.state.toLowerCase() + rowData.department.toLowerCase() + rowData.region.toLowerCase() + "lrate" + rowData.lrate.toLowerCase()
        }
        if (rowData.mrate != null) {
            mrate_table_name = rowData.state.toLowerCase() + rowData.department.toLowerCase() + rowData.region.toLowerCase() + "mrate" + rowData.mrate.toLowerCase()
        }
        sort_values.push([primary_table_name, mrate_table_name, lrate_table_name, rowData.itemNo])
        // ajaxCalls.push(getDataFromAPI(primary_table_name, mrate_table_name, lrate_table_name, rowData.itemNo))
    });

    sort_values.sort((a, b) => {
        let aParts = a[3].split('.').map(Number);
        let bParts = b[3].split('.').map(Number);
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            if (aParts[i] === undefined) return -1;
            if (bParts[i] === undefined) return 1;
            if (aParts[i] !== bParts[i]) return aParts[i] - bParts[i];
        }
        return 0;
    });

    for (item of sort_values) {
        ajaxCalls.push(getDataFromAPI(item[0], item[1], item[2], item[3]));
    }

    var isManualRateChecked = document.getElementById("manualrate").checked;
    console.log(isManualRateChecked)

    if (isManualRateChecked) {
        var modal = document.getElementById("myModal");
        var span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";
        var data = `
            <div class="table-responsive">
                <table class='table table-sm table-bordered table-hover' id='manualratetable'>
                    <thead>
                        <tr>
                            <th>SOR</th>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                </table>
            </div>
            `;
        var modalDataContainer = document.getElementById("modalDataContainer");
        modalDataContainer.innerHTML = data;
        captureCodesFromData(ajaxCalls);

        var submitButton = document.createElement('button');
        submitButton.className = 'btn btn-sm btn-success';
        submitButton.textContent = 'UPDATE RATE';
        modalDataContainer.appendChild(submitButton)
        submitButton.addEventListener('click', function () {

            var table = document.getElementById("manualratetable");
            var inputFields = table.querySelectorAll('input[type="number"]');
            var rateValues = new Map();

            inputFields.forEach(function (inputField) {
                rateValues.set(inputField.id, inputField.value);
            });

            manualRates = rateValues;
            modal.style.display = "none";
            generateResponse(isManualRateChecked, isCpohChecked, ajaxCalls)
        });

        span.onclick = function () {
            modal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    } else {
        generateResponse(isManualRateChecked, isCpohChecked, ajaxCalls);
    }
}

function captureCodesFromData(ajaxCalls) {
    Promise.all(ajaxCalls)
        .then(function (responses) {
            async function processResponses(responses) {
                for (const response of responses) {
                    const data = response[0];
                    const sor = response[1];
                    const itemNo = response[4];
                    var table = document.getElementById("manualratetable");

                    const primary_table_name = response[1];
                    const mrate_table_name = response[2];
                    const lrate_table_name = response[3];


                    if (primary_table_name == "biharwrd2022") {
                        await captureCodesFromDataBiharWRD(ajaxCalls, data, primary_table_name, mrate_table_name, lrate_table_name, itemNo);
                    }
                }
            }

            (async () => {
                try {

                    await processResponses(responses);
                } catch (error) {
                    console.error("Error occurred during processing:", error);
                }
            })();

        })
        .catch(function (error) {
            alert("data not exist")
            console.error("error : ", error);
        });
}

function generateResponse(isManualRateChecked, isCpohChecked, ajaxCalls) {
    var abstract_data = [];
    Promise.all(ajaxCalls)
        .then(function (responses) {
            xcell_data = [];
            xcell_data.push({
                item_no: 'Name of Work',
                description: nameOfWork,
            });
            abstract_data.push({
                code: 'Name of Work',
                description: nameOfWork,
                unit: '',
            });
            var abstract_rate_data = new Map()
            var type_of_labour = new Set()
            var type_of_material = new Set()
            var mFactor = new Set()
            if (isManualRateChecked) {
                var table = document.getElementById("manualratetable");
                var inputFields = table.querySelectorAll('input[type="number"]');
                var rateValues = new Map();

                inputFields.forEach(function (inputField) {
                    rateValues.set(inputField.id, inputField.value);
                });
            }


            async function processResponses(responses) {
                for (const response of responses) {
                    const data = response[0];
                    const itemNo = response[4];
                    const primary_table_name = response[1];
                    const mrate_table_name = response[2];
                    const lrate_table_name = response[3];

                    if (primary_table_name == "biharwrd2022") {
                        var lrate_table_default = "biharwrdlrateoct2023";
                        var mrate_table_default = "biharwrdmrateoct2023";
                        biharwrd22 = await handleBiharWRD2022(data, primary_table_name, lrate_table_name, mrate_table_name, lrate_table_default, mrate_table_default, itemNo, isManualRateChecked, isCpohChecked, manualRates);
                        xcell_data = xcell_data.concat(biharwrd22[0])
                        console.log(biharwrd22[0])
                        console.log(biharwrd22[5])
                        xcell_data = xcell_data.concat(biharwrd22[5])
                        abstract_rate_data = new Map([...abstract_rate_data, ...biharwrd22[1]])
                        type_of_labour = new Set([...type_of_labour, ...biharwrd22[2]])
                        type_of_material = new Set([...type_of_material, ...biharwrd22[3]])
                        mFactor = new Set([...mFactor, ...biharwrd22[6]])
                        abstract_data = abstract_data.concat({ ...biharwrd22[4][0], unit: xcell_data.unit })

                    }
                    else if (primary_table_name == "biharbcd2022") {
                        biharbcd22 = await handleBiharBCD2022(data, primary_table_name, itemNo);
                        abstract_rate_data = new Map([...abstract_rate_data, ...bihabcrd22[1]])
                        abstract_data = abstract_data.concat({ ...biharbcd22[4][0], unit: xcell_data.unit })

                    }
                }
                // xcell_data.push(xcell_data_local);
                return [xcell_data, abstract_rate_data];
            }


            (async () => {
                try {
                    sheet_response = await processResponses(responses);
                    xcell_data = sheet_response[0]
                    console.log(xcell_data)
                    abstract_rate_data = sheet_response[1]
                    const columnTitles = [
                        { header: "Item No.", key: "item_no" },
                        { header: "Description", key: "description" },
                        { header: "Unit", key: "unit" },
                        { header: "Quantity", key: "quantity" },
                        { header: "Rate", key: "rate" },
                        { header: "Amount", key: "amount" },
                        { header: "Code", key: "code" },
                    ];
                    var columnTitlesLength = columnTitles.length;

                    const worksheetData = xcell_data.map(obj => {
                        const row = {};
                        columnTitles.forEach(column => row[column.key] = obj[column.key] === "0" ? "" : obj[column.key]);
                        console.log(row)
                        return row;

                    });
                    const workbook = new ExcelJS.Workbook();

                    const worksheet = workbook.addWorksheet('Analysis');
                    worksheet.columns = columnTitles;
                    worksheet.columns[1].width = 40;

                    worksheet.columns[3].numFmt = '0.00'
                    worksheet.columns[4].numFmt = '0.00'
                    worksheet.columns[5].numFmt = '0.00'

                    var formulaIndex = 0;
                    var startIndex = 0;
                    var excel_row_per = {};

                    worksheetData.forEach((row, index) => {
                        worksheet.addRow(row);
                        excel_row = worksheet.lastRow;

                        var rowLength = excel_row._cells.length
                        if (rowLength < columnTitlesLength) {
                            if (rowLength == 2) {
                                worksheet.mergeCells(excel_row._cells[1]._address + ':' + 'G' + getNumberFromString(excel_row._cells[1]._address));
                                worksheet.getCell(excel_row._cells[1]._address).alignment = { wrapText: true };
                            }
                        }
                        excel_row.eachCell((cell, cellNumber) => {
                            cell.border = {
                                top: { style: 'thin' },
                                left: { style: 'thin' },
                                bottom: { style: 'thin' },
                                right: { style: 'thin' },
                            };
                            if (cell.value && cell.value.length > 100) {
                                cell.alignment = { vertical: 'center', horizontal: 'left', wrapText: true, shrinkToFit: true };
                            }

                        });


                        // formula
                        console.log("entered in formulae")
                        let excelRowIndex = getNumberFromString(excel_row._cells[1]._address);
                        console.log(excel_row._cells[1])
                        console.log(excel_row._cells[1].value)
                        console.log(excel_row._cells[1]._address)
                        console.log(excelRowIndex)


                        if (startIndex === 0 && rowLength > 2 && row.rate != "") {
                            startIndex = excelRowIndex;
                            console.log(startIndex)
                        }
                        if (rowLength > 2 && row.rate != "") {
                            worksheet.getCell("F" + excelRowIndex).value = { formula: `D${excelRowIndex}*E${excelRowIndex}` };
                        }
                        var description = row.description;
                        // if (description && description.trim().toLowerCase() === "total") {
                        //     formulaIndex = 1;

                        //     for (formulaIndex = 1; formulaIndex < 6; formulaIndex++) {
                        //      console.log(formulaIndex)
                        if (description && description.trim().toLowerCase() === 'total' && row.rate == "") {
                            formulaIndex = 1;
                            console.log("entered in formula for total")
                            worksheet.getCell("F" + excelRowIndex).value = { formula: `SUM(F${startIndex}:F${excelRowIndex - 1})` };
                            formulaIndex++;
                        }
                        if (description && description.trim().toLowerCase().includes('add') && row.rate == "" && formulaIndex > 0) {
                            console.log("entered in formula for add")
                            // let numberfromDesc = parseFloat(extractWordAndNumberInQuotes(row.description).number)
                            worksheet.getCell("F" + excelRowIndex).value = { formula: `F${excelRowIndex - 1}*15%` };
                            formulaIndex++;
                        }
                        if (description && description.trim().toLowerCase().includes('cost') && row.rate == "" && formulaIndex > 0) {
                            console.log("entered in formula for cost")
                            worksheet.getCell("F" + excelRowIndex).value = { formula: `SUM(F${excelRowIndex - 1}:F${excelRowIndex - 2})` };
                            formulaIndex++;
                            // excel_row_per = worksheet.lastRow;
                        }

                        // if (description && description.trim().toLowerCase().includes('rate') && formulaIndex > 0) {
                        //     console.log("entered in formula for rate")
                        //     if (description.trim().toLowerCase().includes('per')) {
                        //         // let last_row = row{8};
                        //         // console.log(last_row)
                        //         console.log(excel_row_per._cells[1].value)
                        //         let costper = parseFloat(extractWordAndNumberInQuotes(excel_row_per._cells[1].value).number)
                        //         if ((costper == '') || (costper == null) || (costper == undefined)) {
                        //             costper = 1;

                        //         }
                        //         console.log(costper)
                        //         worksheet.getCell("F" + excelRowIndex).value = { formula: `F${excelRowIndex - 1}/${costper}` };
                        //         // ((parseFloat(x_total) / costper)).toFixed(2),


                        //     }
                        //     else if (description.trim().toLowerCase().includes('each')) {
                        //         if (data[j - 3].description.trim().toLowerCase() === 'total') {

                        //             let last_row = row[row.length - 1];
                        //             let costper = parseFloat(extractWordAndNumberInQuotes(last_row.description).number)
                        //             if (costper == '' || (costper == null) || (costper == undefined)) {
                        //                 costper = 1;

                        //             }
                        //             worksheet.getCell("F" + excelRowIndex).value = { formula: `F${excelRowIndex - 1}/costper` };
                        //             // ((parseFloat(x_total) / costper)).toFixed(2),

                        //         }
                        //     }
                        //     else {
                        //         worksheet.getCell("F" + excelRowIndex).value = { formula: `F${excelRowIndex - 1}*15%` };
                        //         // ((parseFloat(x_total) / costper)).toFixed(2),

                        //     }
                        //     formulaIndex++;

                        // }

                        if (description && description.trim() === "say" && row.rate == "" && formulaIndex > 0) {
                            worksheet.getCell("F" + excelRowIndex).value = { formula: `ROUND(F${excelRowIndex - 1},1)` };
                            fomulaIndex = 0;
                            startIndex = 0;
                        }


                        // ======== end fomula =====
                    });

                    var isAbstractChecked = document.getElementById("abstract").checked;
                    if (isAbstractChecked) {
                        const columnTitles = [
                            { header: "Agt Item no.", key: "code" },
                            { header: "Description of item", key: "description" },
                            { header: "Qty", key: "quantity" },
                            { header: "Unit", key: "unit" },
                            { header: "Rate", key: "rate" },
                            { header: "Amount", key: "amount" },
                        ];

                        var total = 0;

                        const worksheetData = abstract_data.map(obj => {
                            const row = {};
                            columnTitles.forEach(column => {
                                row[column.key] = obj[column.key] === "0" ? "" : obj[column.key];
                            });
                            row["quantity"] = "";
                            row["unit"] = abstract_rate_data.get(obj.unit) || "";
                            row["rate"] = abstract_rate_data.get(obj.code) || "";
                            row["amount"] = "";
                            return row;
                        });


                        const aworksheet = workbook.addWorksheet('Abstract');

                        aworksheet.columns = columnTitles;
                        aworksheet.columns[1].width = 60;

                        aworksheet.columns[2].numFmt = '0.00'
                        aworksheet.columns[4].numFmt = '0.00'
                        aworksheet.columns[5].numFmt = '0.00'


                        const headerRow = aworksheet.getRow(1); // Assuming the header row is the first row (index 1)
                        headerRow.eachCell(cell => {
                            cell.font = { size: 12, bold: true };
                        });

                        // aworksheet.addRow({ code: "", description: "New Description", quantity: "", unit: "", rate: "", amount: "" }).commit();

                        worksheetData.push({ code: "", description: "Total", quantity: "", unit: "", rate: "", amount: "SUM(F3:F" + (worksheetData.length + 1) + ")" });

                        worksheetData.forEach((row, rowIndex) => {

                            aworksheet.addRow(row);
                            excel_row = aworksheet.lastRow;
                            if (rowIndex > 0 && rowIndex < worksheetData.length - 1) {
                                aworksheet.getCell("F" + getNumberFromString(excel_row._cells[1]._address)).value = { formula: 'ROUND(C' + getNumberFromString(excel_row._cells[1]._address) + "*E" + getNumberFromString(excel_row._cells[1]._address) + ",2)" };
                            }
                            else if (rowIndex == worksheetData.length - 1) {
                                aworksheet.getCell("F" + getNumberFromString(excel_row._cells[1]._address)).value = { formula: row['amount'] };
                            }

                            excel_row.eachCell((cell, cellNumber) => {
                                cell.border = {
                                    top: { style: 'thin' },
                                    left: { style: 'thin' },
                                    bottom: { style: 'thin' },
                                    right: { style: 'thin' },
                                };

                                if (cell.value && cell.value.length > 100) {
                                    cell.alignment = { vertical: 'center', horizontal: 'left', wrapText: true, shrinkToFit: true };
                                }

                            });
                        });

                    }

                    var isLabourStrengthChecked = document.getElementById("labourstrength").checked;
                    if (isLabourStrengthChecked) {
                        const columnTitles = [
                            { header: "Sl no.", key: "code" },
                            { header: "Description of item", key: "description" },
                            { header: "Qty", key: "quantity" },
                            { header: "Unit", key: "unit" },
                        ];
                        type_of_labour.forEach(labour => {
                            columnTitles.push({ header: labour, key: "rate" })
                        });
                        const worksheetData = abstract_data.map(obj => {
                            const row = {};
                            columnTitles.forEach(column => {
                                row[column.key] = obj[column.key] === "0" ? "" : obj[column.key];
                            });
                            row["quantity"] = "";
                            row["unit"] = "";
                            type_of_labour.forEach(labour => {
                                row[labour] = ""
                            });
                            return row;
                        });

                        const lworksheet = workbook.addWorksheet('Labour Strength');


                        lworksheet.columns = columnTitles;
                        lworksheet.columns[1].width = 60;
                        lworksheet.columns[2].numFmt = '0.00'
                        const headerRow = lworksheet.getRow(1);
                        headerRow.eachCell(cell => {
                            cell.font = { size: 12, bold: true };
                        });

                        // worksheet.mergeCells('E1:' + getCapitalAlphabetAfter('E', type_of_labour.length) + '1');
                        // lworksheet.addRow({ code: "", description: "", quantity: "", unit: "", [type_of_labour[0]]:"types of labour" }).commit();
                        let rowLength = worksheetData.length + 1
                        worksheetData.push({
                            code: "",
                            description: "Total",
                            quantity: "",
                            unit: "",
                            // type_of_labour.forEach(labour => {
                            //     row[labour] = "0"
                            // });
                            labour: `SUM(E2:E${rowLength})`,
                        })

                        worksheetData.forEach((row, rowIndex) => {
                            lworksheet.addRow(row);
                            excel_row = lworksheet.lastRow;
                            console.log(excel_row)
                            let excelRowIndex = getNumberFromString(excel_row._cells[1]._address);

                            if (rowIndex > 0 && rowIndex < worksheetData.length - 1) {
                                lworksheet.getCell("E" + excelRowIndex).value = { formula: 'C' + excelRowIndex + "*(mFactor.itemNo.code.quantity)/(mFactor.itemNo.costper)" };
                                // lworksheet.getCell("F" + excelRowIndex).value = { formula: 'C' + excelRowIndex + "*9.5/10" };
                                // lworksheet.getCell("G" + excelRowIndex).value = { formula: 'C' + excelRowIndex + "*0.33/10" };
                            }
                            else if (rowIndex == worksheetData.length - 1) {
                                lworksheet.getCell("E" + excelRowIndex).value = { formula: row['labour'] };
                                //     lworksheet.getCell("F" + excelRowIndex).value = { formula: row['unskilled'] };
                                //     lworksheet.getCell("G" + excelRowIndex).value = { formula: row['mason'] };
                                //     lworksheet.getCell("H" + excelRowIndex).value = { formula: row['blaster'] };
                                //     lworksheet.getCell("I" + excelRowIndex).value = { formula: row['unskilled_leveling'] };
                                //     lworksheet.getCell("J" + excelRowIndex).value = { formula: row['unskilled_removing'] };
                            }

                            excel_row.eachCell((cell, cellNumber) => {
                                cell.border = {
                                    top: { style: 'thin' },
                                    left: { style: 'thin' },
                                    bottom: { style: 'thin' },
                                    right: { style: 'thin' },
                                };

                                if (cell.value && cell.value.length > 100) {
                                    cell.alignment = { vertical: 'center', horizontal: 'left', wrapText: true, shrinkToFit: true };
                                }

                            });
                        });
                    }

                    var isMaterialStatementChecked = document.getElementById("materialstatement").checked;
                    if (isMaterialStatementChecked) {
                        const columnTitles = [
                            { header: "Sl no.", key: "code" },
                            { header: "Description of item", key: "description" },
                            { header: "Qty", key: "quantity" },
                            { header: "Unit", key: "unit" },
                        ];
                        type_of_material.forEach(labour => {
                            columnTitles.push({ header: labour, key: "rate" })
                        });
                        columnTitles.push({ header: "Remarks", key: "remarks" })
                        const worksheetData = abstract_data.map(obj => {
                            const row = {};
                            columnTitles.forEach(column => {
                                row[column.key] = obj[column.key] === "0" ? "" : obj[column.key];
                            });
                            row["quantity"] = "";
                            row["unit"] = "";
                            type_of_material.forEach(labour => {
                                row[labour] = "0"
                            });
                            row["remarks"] = "";
                            return row;
                        });

                        const mworksheet = workbook.addWorksheet('Material Statement');


                        mworksheet.columns = columnTitles;
                        mworksheet.columns[1].width = 60;
                        mworksheet.columns[2].numFmt = '0.00'
                        const headerRow = mworksheet.getRow(1);
                        headerRow.eachCell(cell => {
                            cell.font = { size: 12, bold: true };
                        });

                        // worksheet.mergeCells('E1:' + getCapitalAlphabetAfter('E', type_of_labour.length) + '1');
                        // lworksheet.addRow({ code: "", description: "", quantity: "", unit: "", [type_of_labour[0]]:"types of labour" }).commit();
                        let rowLength = worksheetData.length + 1

                        worksheetData.push({
                            code: '',
                            description: 'Total',
                            quantity: '',
                            unit: '',
                            // special_gelatin: `SUM(E3:E${rowLength})`,
                            // detonator: `SUM(F3:E${rowLength})`,
                            // fuse_coil: `SUM(G3:E${rowLength})`,
                            // manuals_means: `SUM(H3:E${rowLength})`,
                            // cost_of_haulage: `SUM(I3:E${rowLength})`,
                            // remarks: '',
                        })

                        worksheetData.forEach((row, rowIndex) => {
                            mworksheet.addRow(row);
                            excel_row = mworksheet.lastRow;

                            let excelRowIndex = getNumberFromString(excel_row._cells[1]._address);

                            if (rowIndex > 0 && rowIndex < worksheetData.length - 1) {
                                mworksheet.getCell("E" + excelRowIndex).value = { formula: 'C' + excelRowIndex + "*2/10" };
                            }
                            else if (rowIndex == worksheetData.length - 1) {
                                mworksheet.getCell("E" + excelRowIndex).value = { formula: row['special_gelatin'] };
                                mworksheet.getCell("F" + excelRowIndex).value = { formula: row['detonator'] };
                                mworksheet.getCell("G" + excelRowIndex).value = { formula: row['fuse_coil'] };
                                mworksheet.getCell("H" + excelRowIndex).value = { formula: row['manuals_means'] };
                                mworksheet.getCell("I" + excelRowIndex).value = { formula: row['cost_of_haulage'] };
                            }

                            excel_row.eachCell((cell, cellNumber) => {
                                cell.border = {
                                    top: { style: 'thin' },
                                    left: { style: 'thin' },
                                    bottom: { style: 'thin' },
                                    right: { style: 'thin' },
                                };

                                if (cell.value && cell.value.length > 100) {
                                    cell.alignment = { vertical: 'center', horizontal: 'left', wrapText: true, shrinkToFit: true };
                                }

                            });
                        });
                    }

                    const filename = 'Estimate.xlsx';
                    workbook.xlsx.writeBuffer()
                        .then(buffer => {
                            const blob = new Blob([buffer], { type: "application/octet-stream" });
                            const url = window.URL.createObjectURL(blob);

                            const a = document.createElement('a');
                            a.href = url;
                            a.download = filename;
                            a.click();

                            window.URL.revokeObjectURL(url);
                        })
                        .catch(error => {
                            console.error('Error creating Excel file:', error);
                        });
                } catch (error) {
                    console.error("Error occurred during processing:", error);
                }
            })();




        })
        .catch(function (error) {
            alert("data not exist")
            console.error("error : ", error);
        });
}

function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function delRow(t) {
    let i = t.parentNode.parentNode.parentNode.rowIndex;
    if (i > 1) {
        document.getElementById('inputItemTable').deleteRow(i);
    }
    let x = document.getElementById('inputItemTable').rows.length;
    for (let i = 1; i < x; i++) {
        document.getElementById('inputItemTable').rows[i].cells[0].innerHTML = i;
    }
}

const NONE_DOT = /^[^\.]*$/;
const ONE_DOT = /^[^\.]*\.[^\.]*$/;
const TWO_DOT = /^[^\.]*\.[^\.]*\.[^\.]*$/;
const THREE_DOT = /^[^\.]*\.[^\.]*\.[^\.]*\.[^\.]*$/;

async function searchItem(t) {
    let row = t.parentNode.parentNode.parentNode;
    let i = row.rowIndex;
    let rowt = document.getElementById('inputItemTable').rows[i];
    var ajaxCalls = [];

    var rowData = {
        state: $(row).find('select[name="state"]').val(),
        department: $(row).find('select[name="department"]').val(),
        sor: $(row).find('select[name="sor"]').val(),
        region: $(row).find('select[name="region"]').val(),
        lrate: $(row).find('select[name="lrate"]').val(),
        mrate: $(row).find('select[name="mrate"]').val(),
        itemNo: $(row).find('input[type="text"]').val()
    };

    var primary_table_name = null
    var lrate_table_name = null
    var mrate_table_name = null

    if (rowData.region == null) {
        rowData.region = ""
    }

    if (rowData.state != null && rowData.department != null) {
        primary_table_name = rowData.state.toLowerCase() + rowData.department.toLowerCase() + rowData.sor
    }
    if (rowData.lrate != null) {
        lrate_table_name = rowData.state.toLowerCase() + rowData.department.toLowerCase() + rowData.region.toLowerCase() + "lrate" + rowData.lrate.toLowerCase()
    }
    if (rowData.mrate != null) {
        mrate_table_name = rowData.state.toLowerCase() + rowData.department.toLowerCase() + rowData.region.toLowerCase() + "mrate" + rowData.mrate.toLowerCase()
    }

    if (primary_table_name == "biharwrd2022") {
        initSOR("");
        var modal = document.getElementById("itemPickModalBiharwrd");
        modal.style.display = "block";
        var span1 = document.getElementsByClassName("close")[1];
        span1.onclick = function () {
            modal.style.display = "none";
        }
    }
    else if (primary_table_name == "biharbcd2022") {
        initSORbiharBCD("");
        var modal = document.getElementById("itemPickModalBiharbcd");
        modal.style.display = "block";
        var span1 = document.getElementsByClassName("close")[2];
        span1.onclick = function () {
            modal.style.display = "none";
        }
    }

}

// excel data preview modal
function excelData() {

    var ajaxCalls = [];
    var sort_values = [];
    var isCpohChecked = document.getElementById("exCpoh").checked;
    console.log(isCpohChecked)
    $('#inputItemTable tbody tr').each(function (index, row) {
        var rowData = {
            state: $(row).find('select[name="state"]').val(),
            department: $(row).find('select[name="department"]').val(),
            sor: $(row).find('select[name="sor"]').val(),
            region: $(row).find('select[name="region"]').val(),
            lrate: $(row).find('select[name="lrate"]').val(),
            mrate: $(row).find('select[name="mrate"]').val(),
            itemNo: $(row).find('input[type="text"]').val()
        };

        var primary_table_name = null
        var lrate_table_name = null
        var mrate_table_name = null

        if (rowData.region == null) {
            rowData.region = ""
        }

        if (rowData.state != null && rowData.department != null) {
            primary_table_name = rowData.state.toLowerCase() + rowData.department.toLowerCase() + rowData.sor
        }
        if (rowData.lrate != null) {
            lrate_table_name = rowData.state.toLowerCase() + rowData.department.toLowerCase() + rowData.region.toLowerCase() + "lrate" + rowData.lrate.toLowerCase()
        }
        if (rowData.mrate != null) {
            mrate_table_name = rowData.state.toLowerCase() + rowData.department.toLowerCase() + rowData.region.toLowerCase() + "mrate" + rowData.mrate.toLowerCase()
        }
        sort_values.push([primary_table_name, mrate_table_name, lrate_table_name, rowData.itemNo])
        // ajaxCalls.push(getDataFromAPI(primary_table_name, mrate_table_name, lrate_table_name, rowData.itemNo))
    });

    sort_values.sort((a, b) => {
        let aParts = a[3].split('.').map(Number);
        let bParts = b[3].split('.').map(Number);
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            if (aParts[i] === undefined) return -1;
            if (bParts[i] === undefined) return 1;
            if (aParts[i] !== bParts[i]) return aParts[i] - bParts[i];
        }
        return 0;
    });

    for (item of sort_values) {
        ajaxCalls.push(getDataFromAPI(item[0], item[1], item[2], item[3]));
    }

    var isManualRateChecked = document.getElementById("manualrate").checked;
    if (isManualRateChecked) {
        var modal = document.getElementById("myModal");
        var span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";
        var data = `
            <div class="table-responsive">
                <table class='table table-sm table-bordered table-hover' id='manualratetable'>
                    <thead>
                        <tr>
                            <th>SOR</th>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                </table>
            </div>
            `;
        var modalDataContainer = document.getElementById("modalDataContainer");
        modalDataContainer.innerHTML = data;
        captureCodesFromData(ajaxCalls);

        var submitButton = document.createElement('button');
        submitButton.className = 'btn btn-sm btn-success';
        submitButton.textContent = 'UPDATE RATE';
        modalDataContainer.appendChild(submitButton)
        submitButton.addEventListener('click', function () {

            var table = document.getElementById("manualratetable");
            var inputFields = table.querySelectorAll('input[type="number"]');
            var rateValues = new Map();

            inputFields.forEach(function (inputField) {
                rateValues.set(inputField.id, inputField.value);
            });

            manualRates = rateValues;
            modal.style.display = "none";
            generateExcelPreivewData(isManualRateChecked, isCpohChecked, ajaxCalls)
        });

        span.onclick = function () {
            modal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    } else {
        generateExcelPreivewData(isManualRateChecked, isCpohChecked, ajaxCalls);
    }
}

function generateExcelPreivewData(isManualRateChecked, isCpohChecked, ajaxCalls) {
    var abstract_data = [];
    Promise.all(ajaxCalls)
        .then(function (responses) {
            xcell_data = [];
            xcell_data.push({
                item_no: 'Name of Work',
                description: nameOfWork,
            });
            abstract_data.push({
                code: 'Name of Work',
                description: nameOfWork,
                unit: '',
            });
            var abstract_rate_data = new Map()
            var type_of_labour = new Set()
            var type_of_material = new Set()
            if (isManualRateChecked) {
                var table = document.getElementById("manualratetable");
                var inputFields = table.querySelectorAll('input[type="number"]');
                var rateValues = new Map();

                inputFields.forEach(function (inputField) {
                    rateValues.set(inputField.id, inputField.value);
                });
            }


            async function processResponses(responses) {
                for (const response of responses) {
                    const data = response[0];
                    const itemNo = response[4];
                    const primary_table_name = response[1];
                    const mrate_table_name = response[2];
                    const lrate_table_name = response[3];
                    var lrate_table_default = "biharwrdlrateoct2023";
                    var mrate_table_default = "biharwrdmrateoct2023";

                    if (primary_table_name == "biharwrd2022") {
                        biharwrd22 = await handleBiharWRD2022(data, primary_table_name, mrate_table_name, lrate_table_name, lrate_table_default, mrate_table_default, itemNo, isManualRateChecked, isCpohChecked, manualRates);
                        xcell_data = xcell_data.concat(biharwrd22[0])
                        xcell_data = xcell_data.concat(biharwrd22[5])
                        abstract_rate_data = new Map([...abstract_rate_data, ...biharwrd22[1]])
                        type_of_labour = new Set([...type_of_labour, ...biharwrd22[2]])
                        type_of_material = new Set([...type_of_material, ...biharwrd22[3]])
                        abstract_data = abstract_data.concat({ ...biharwrd22[4][0], unit: xcell_data.unit })

                    }
                }
                // xcell_data.push(xcell_data_local);
                return [xcell_data, abstract_rate_data];
            }

            (async () => {
                try {
                    sheet_response = await processResponses(responses);
                    xcell_data = sheet_response[0]
                    abstract_rate_data = sheet_response[1]
                    const columnTitles = [
                        { header: "Item No.", key: "item_no" },
                        { header: "Description", key: "description" },
                        { header: "Unit", key: "unit" },
                        { header: "Quantity", key: "quantity" },
                        { header: "Rate", key: "rate" },
                        { header: "Amount", key: "amount" },
                        { header: "Code", key: "code" },
                    ];
                    var columnTitlesLength = columnTitles.length;

                    const worksheetData = xcell_data.map(obj => {
                        const row = {};
                        columnTitles.forEach(column => row[column.key] = obj[column.key] === "0" ? "" : obj[column.key]);
                        return row;
                    });

                    var tableWorkSheet = `<div class="table-responsive" style="display: flex; overflow: auto; height: calc(100vh - 200px);">
                                            <table class='table table-sm table-bordered table-hover' >
                                                <thead>
                                                    <tr>
                                                        <th>Item No.</th>
                                                        <th>Description</th>
                                                        <th>Unit</th>
                                                        <th>Quantity</th>
                                                        <th>Rate</th>
                                                        <th>Amount</th>
                                                        <th>Code</th>
                                                    </tr>
                                                    <tr>
                                                        <th>Name of Work</th>
                                                        <th colSpan="6">${worksheetData[0]['description'] || ""}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>`;
                    worksheetData.forEach((row, index) => {

                        if (index === 0) return;
                        else if (row['item_no'] != "") {
                            tableWorkSheet += `<tr>
                                                <td>${row['item_no']}</td>
                                                <td colSpan="6">${row['description']}</td>
                                            </tr>`;
                        } else {
                            tableWorkSheet += `<tr>
                                                <td>${row['item_no']}</td>
                                                <td>${row['description']}</td>
                                                <td>${row['unit']}</td>
                                                <td>${row['quantity']}</td>
                                                <td>${row['rate']}</td>
                                                <td>${row['amount']}</td>
                                                <td>${row['code']}</td>
                                            </tr>`;
                        }

                    });

                    tableWorkSheet += "</tbody></table></div>";
                    $("#pills-analysis").empty();
                    $("#pills-analysis").append(tableWorkSheet);

                    var isAbstractChecked = document.getElementById("abstract").checked;
                    if (isAbstractChecked) {
                        const columnTitles = [
                            { header: "Agt Item no.", key: "code" },
                            { header: "Description of item", key: "description" },
                            { header: "Qty", key: "quantity" },
                            { header: "Unit", key: "unit" },
                            { header: "Rate", key: "rate" },
                            { header: "Amount", key: "amount" },
                        ];

                        var total = 0;

                        const worksheetData = abstract_data.map(obj => {
                            const row = {};
                            columnTitles.forEach(column => {
                                row[column.key] = obj[column.key] === "0" ? "" : obj[column.key];
                            });
                            row["quantity"] = "";
                            row["unit"] = "";
                            row["rate"] = abstract_rate_data.get(obj.code) || "";
                            row["amount"] = "";
                            return row;
                        });


                        worksheetData.push({ code: "", description: "Total", quantity: "", unit: "", rate: "", amount: total });

                        var tableWorkSheet = `<div class="table-responsive" style="display: flex; overflow: auto; height: calc(100vh - 200px);">
                                            <table class='table table-sm table-bordered table-hover' >
                                                <thead>
                                                    <tr>
                                                        <th>Agt Item no.</th>
                                                        <th>Description of item</th>
                                                        <th>Qty</th>
                                                        <th>Unit</th>
                                                        <th>Rate</th>
                                                        <th>Amount</th>
                                                    </tr>
                                                    <tr>
                                                        <th>Name of Work</th>
                                                        <th colSpan="5">${worksheetData[0]['description'] || ""}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>`;

                        worksheetData.forEach((row, rowIndex) => {
                            if (rowIndex === 0) return;

                            tableWorkSheet += `<tr>
                                                <td>${row['code']}</td>
                                                <td>${row['description']}</td>
                                                <td>${row['quantity']}</td>
                                                <td>${row['unit']}</td>
                                                <td>${row['rate']}</td>
                                                <td>${row['amount']}</td>
                                            </tr>`;
                        });
                        tableWorkSheet += "</tbody></table></div>";

                        $("#tab_abstract").show();
                        $("#pills-abstract").empty();
                        $("#pills-abstract").append(tableWorkSheet);

                    } else {
                        $("#tab_abstract").hide();
                    }

                    var isLabourStrengthChecked = document.getElementById("labourstrength").checked;
                    if (isLabourStrengthChecked) {
                        const columnTitles = [
                            { header: "Sl no.", key: "code" },
                            { header: "Description of item", key: "description" },
                            { header: "Qty", key: "quantity" },
                            { header: "Unit", key: "unit" },
                            { header: "Hammer man", key: "hammer_man" },
                            { header: "Unskilled mazdoor for  all work", key: "unskilled" },
                            { header: "Mason Gr I", key: "mason" },
                            { header: "Blaster", key: "blaster" },
                        ];
                        type_of_labour.forEach(labour => {
                            columnTitles.push({ header: labour, key: "rate" })
                        });

                        var total = 0;

                        const worksheetData = abstract_data.map(obj => {
                            const row = {};
                            columnTitles.forEach(column => {
                                row[column.key] = obj[column.key] === "0" ? "" : obj[column.key];
                            });
                            row["quantity"] = "";
                            row["unit"] = "";
                            row["hammer_man"] = "";
                            row["unskilled"] = "";
                            row["mason"] = "";
                            row["blaster"] = "";
                            row["unskilled_leveling"] = "";
                            row["unskilled_removing"] = "";
                            type_of_labour.forEach(labour => {
                                row[labour] = "0"
                            });
                            return row;
                        });

                        worksheetData.push({
                            code: "",
                            description: "Total",
                            quantity: "",
                            unit: "",
                            hammer_man: total,
                            unskilled: total,
                            mason: total,
                            blaster: total,
                            unskilled_leveling: total,
                            unskilled_removing: total,
                        })

                        var tableWorkSheet = `<div class="table-responsive" style="display: flex; overflow: auto; height: calc(100vh - 200px);">
                                            <table class='table table-sm table-bordered table-hover' >
                                                <thead>
                                                    <tr>
                                                        <th>Sl no.</th>
                                                        <th>Description of item</th>
                                                        <th>Qty</th>
                                                        <th>Unit</th>
                                                        <th>Hammer man</th>
                                                        <th>Unskilled mazdoor for  all work</th>
                                                        <th>Mason Gr I</th>
                                                        <th>Blaster</th>
                                                    </tr>
                                                    <tr>
                                                        <th>Name of Work</th>
                                                        <th colSpan="7">${worksheetData[0]['description'] || ""}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>`;

                        worksheetData.forEach((row, rowIndex) => {

                            if (rowIndex === 0) return;

                            tableWorkSheet += `<tr>
                                                <td>${row['code']}</td>
                                                <td>${row['description']}</td>
                                                <td>${row['quantity']}</td>
                                                <td>${row['unit']}</td>
                                                <td>${row['hammer_man']}</td>
                                                <td>${row['unskilled']}</td>
                                                <td>${row['mason']}</td>
                                                <td>${row['blaster']}</td>
                                            </tr>`;

                        });
                        tableWorkSheet += "</tbody></table></div>";

                        $("#tab_labour_strength").show();
                        $("#pills-labour_strength").empty();
                        $("#pills-labour_strength").append(tableWorkSheet);
                    } else {
                        $("#tab_labour_strength").hide();
                    }

                    var isMaterialStatementChecked = document.getElementById("materialstatement").checked;
                    if (isMaterialStatementChecked) {
                        const columnTitles = [
                            { header: "Sl no.", key: "code" },
                            { header: "Description of item", key: "description" },
                            { header: "Qty", key: "quantity" },
                            { header: "Unit", key: "unit" },
                            { header: "Special Gelatin", key: "special_gelatin" },
                            { header: "Detonator", key: "detonator" },
                            { header: "Fuse coil", key: "fuse_coil" },
                            { header: "Loading and Unloading of Earth By manuals means Vide item no 4.1 b", key: "manuals_means" },
                            { header: "Cost of Haulage vide item no 4.6( b)", key: "cost_of_haulage" },
                        ];
                        type_of_material.forEach(labour => {
                            columnTitles.push({ header: labour, key: "rate" })
                        });
                        columnTitles.push({ header: "Remarks", key: "remarks" })
                        const worksheetData = abstract_data.map(obj => {
                            const row = {};
                            columnTitles.forEach(column => {
                                row[column.key] = obj[column.key] === "0" ? "" : obj[column.key];
                            });
                            row["quantity"] = "";
                            row["unit"] = "";
                            row["special_gelatin"] = "";
                            row["detonator"] = "";
                            row["fuse_coil"] = "";
                            row["manuals_means"] = "";
                            row["cost_of_haulage"] = "";
                            type_of_material.forEach(labour => {
                                row[labour] = "0"
                            });
                            row["remarks"] = "";
                            return row;
                        });

                        worksheetData.push({
                            code: '',
                            description: 'Total',
                            quantity: '',
                            unit: '',
                            special_gelatin: 0,
                            detonator: 0,
                            fuse_coil: 0,
                            manuals_means: 0,
                            cost_of_haulage: 0,
                            remarks: '',
                        })

                        var tableWorkSheet = `<div class="table-responsive" style="display: flex; overflow: auto; height: calc(100vh - 200px);">
                                            <table class='table table-sm table-bordered table-hover' >
                                                <thead>
                                                    <tr>
                                                        <th>Sl no.</th>
                                                        <th>Description of item</th>
                                                        <th>Qty</th>
                                                        <th>Unit</th>
                                                        <th>Special Gelatin</th>
                                                        <th>Detonator</th>
                                                        <th>Fuse coil</th>
                                                        <th>Loading and Unloading of Earth By manuals means Vide item no 4.1 b</th>
                                                        <th>Cost of Haulage vide item no 4.6( b)</th>
                                                    </tr>
                                                    <tr>
                                                        <th>Name of Work</th>
                                                        <th colSpan="8">${worksheetData[0]['description'] || ""}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>`;

                        worksheetData.forEach((row, rowIndex) => {
                            if (rowIndex === 0) return;

                            tableWorkSheet += `<tr>
                                                <td>${row['code']}</td>
                                                <td>${row['description']}</td>
                                                <td>${row['quantity']}</td>
                                                <td>${row['unit']}</td>
                                                <td>${row['special_gelatin']}</td>
                                                <td>${row['detonator']}</td>
                                                <td>${row['fuse_coil']}</td>
                                                <td>${row['manuals_means']}</td>
                                                <td>${row['cost_of_haulage']}</td>
                                            </tr>`;

                        });
                        tableWorkSheet += "</tbody></table></div>";

                        $("#tab_material_statement").show();
                        $("#pills-material_statement").empty();
                        $("#pills-material_statement").append(tableWorkSheet);
                    } else {
                        $("#tab_material_statement").hide();
                    }

                    $("#excelPreviewModal").modal("show");

                } catch (error) {
                    console.error("Error occurred during processing:", error);
                }
            })();




        })
        .catch(function (error) {
            alert("data not exist")
            console.error("error : ", error);
        });
}
