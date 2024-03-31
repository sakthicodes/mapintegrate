async function handleBiharWRD2022(data, primary_table_name, lrate_table_name, mrate_table_name, lrate_table_default, mrate_table_default, itemNo, isManualRateChecked, isCpohChecked, manualRates) {
    console.log(isCpohChecked)
    console.log(data)
    let xcell_data = [];
    let xcell_data_nested = [];
    var abstract_data = [];
    var abstract_rate_data = new Map()
    var type_of_labour = new Set()
    var type_of_material = new Set()
    var mFactor = new Set()
    var x_total = 0;
    var promiseDataNested = [];
    var promiseSameData = [];
    var pretotal = 0;
    var unit = "";

    mainLoop: for (let i = 0; i < data.length; i++) {
        if (data[i].item_no.trim() === itemNo.trim()) {

            var firstLine = data[i];
            const itemPrimaryData = null;
            // const itemPrimaryData = await getItemData(primary_table_name, extractItemNumber(itemNo));
            if (itemPrimaryData) {
                xcell_data.push({
                    item_no: itemPrimaryData[0],
                    description: itemPrimaryData[1],
                });
            }
            xcell_data.push({
                item_no: data[i].item_no,
                description: data[i].description,
            });
            if (itemPrimaryData) {
                abstract_data.push({
                    code: itemPrimaryData[0],
                    description: itemPrimaryData[1],
                });
            }
            abstract_data.push({
                code: itemNo,
                description: data[i].description,
            });
            if (data[i].item_no != null && data[i].item_no.trim() != '' && data[i + 1].item_no != null && data[i + 1].item_no.trim() != '') {
                console.log("single")
                console.log(data[i].item_no)
                promiseSameData.push(getDataFromNestedItem(primary_table_name, data[i].code))
                var promiseSame = await Promise.all(promiseSameData);
                console.log(promiseSame)
                var dataSame = promiseSame[0][0];
                console.log(dataSame)
                return await handleBiharWRD2022(dataSame, primary_table_name, mrate_table_name, lrate_table_name, data[i].code, isManualRateChecked, isCpohChecked, manualRates);
            }
            for (let j = i + 1; j < data.length; j++) {
                if (data[j].item_no.trim() === '') {
                    if (data[j].code.trim().toLowerCase().includes("unit :-") && data[j].code.trim().toLowerCase().includes("unit:-")) {
                       const tableName = "biharwrd2022itemsearch";
                        var unit = getAbstractUnit(data[i].item_no.trim(), tableName);
                        abstract_rate_data.set(itemNo, unit)
                    }
                    else if (data[j].description.trim().toLowerCase() != 'total' &&
                        data[j].description.trim().toLowerCase() != 'say' &&
                        data[j].code != null && data[j].code.trim() != '') {
                        if (checkDotNumbernAlpaOptional(data[j].code)) {
                            // const data = response[0];
                            promiseDataNested.push(getDataFromNestedItem(primary_table_name, data[j].code))
                            var promisedData = await Promise.all(promiseDataNested);
                            var dataNested = promisedData[0][0];
                            let nestedItem = await handleNestedBiharWRD2022(dataNested, primary_table_name, mrate_table_name, lrate_table_name, data[j].code, isManualRateChecked, false, manualRates);
                            var myRate = data[j].rate
                            if (nestedItem[1] != null && nestedItem[1] != undefined) {
                                myRate = nestedItem[1].get(data[j].code)
                                xcell_data_nested = nestedItem[0]
                            }
                            xcell_data.push({
                                item_no: data[j].item_no,
                                description: data[j].description,
                                unit: data[j].unit,
                                quantity: data[j].quantity,
                                rate: myRate,
                                amount: (myRate * data[j].quantity).toFixed(2),
                                code: data[j].code,
                                index: data[j].index1,
                            });
                            x_total = (parseFloat(x_total) + parseFloat(myRate * data[j].quantity)).toFixed(2)
                        }
                        else if (data[j].code.trim().includes("SI")) {
                            var myRate = data[j].rate
                            if (lrate_table_name != null && lrate_table_name.trim() != '') {
                                const res = await getLabourRate(lrate_table_name, data[j].code.trim());
                                if (res != null) {
                                    myRate = res[2]
                                }
                            }
                            if (isManualRateChecked) {
                                myRate = manualRates.get(data[j].code.trim())
                            }
                            xcell_data.push({
                                item_no: data[j].item_no,
                                description: data[j].description,
                                unit: data[j].unit,
                                quantity: data[j].quantity,
                                rate: myRate,
                                amount: (myRate * data[j].quantity).toFixed(2),
                                code: data[j].code,
                                index: data[j].index1,
                            });
                            x_total = (parseFloat(x_total) + parseFloat(myRate * data[j].quantity)).toFixed(2)
                            type_of_labour.add(data[j].code)
                            mFactor.add(data[i].item_no, data[j].code, data[j].quantity)
                        } else if (!data[j].code.trim().includes("SI")) {
                            var myRate = data[j].rate
                            if (mrate_table_name != null && mrate_table_name.trim() != '') {
                                const res = await getMaterialRate(mrate_table_name, data[j].code.trim());
                                if (res != null) {
                                    myRate = res[3]
                                }
                            }
                            if (isManualRateChecked) {
                                myRate = manualRates.get(data[j].code.trim())
                            }
                            xcell_data.push({
                                item_no: data[j].item_no,
                                description: data[j].description,
                                unit: data[j].unit,
                                quantity: data[j].quantity,
                                rate: myRate,
                                amount: (myRate * data[j].quantity).toFixed(2),
                                code: data[j].code,
                                index: data[j].index1,
                            });
                            x_total = (parseFloat(x_total) + parseFloat(myRate * data[j].quantity)).toFixed(2)
                            type_of_material.add(data[j].code)
                            mFactor.add(data[i].item_no, data[j].code, quantity)
                        } else {
                            xcell_data.push({
                                item_no: data[j].item_no,
                                description: data[j].description,
                                unit: data[j].unit,
                                quantity: data[j].quantity,
                                rate: data[j].rate,
                                amount: data[j].amount,
                                code: data[j].code,
                                index: data[j].index1,
                            });
                            x_total = (parseFloat(x_total) + parseFloat(data[j].rate * data[j].quantity)).toFixed(2)
                        }
                    }
                    else if (data[j].description.trim().toLowerCase() === 'total') {
                        data[j].amount = parseFloat(x_total).toFixed(2);
                        pretotal = 1;
                        console.log('hi total')
                        xcell_data.push({
                            item_no: data[j].item_no,
                            description: data[j].description,
                            unit: data[j].unit,
                            quantity: data[j].quantity,
                            rate: data[j].rate,
                            amount: data[j].amount,
                            code: data[j].code,
                            index: data[j].index1,
                        });
                    }
                    else if (data[j].description.trim().toLowerCase() != 'total' &&
                        data[j].description.trim().toLowerCase() != 'say' &&
                        data[j].description.trim().toLowerCase().includes('add') && pretotal > 0
                    ) {
                        if (isCpohChecked) {
                            console.log(isCpohChecked)
                        }
                        else {
                            console.log("Not entered in cpoh condition")
                            let numberfromDesc = parseFloat(extractWordAndNumberInQuotes(data[j].description).number)
                            xcell_data.push({
                                item_no: data[j].item_no,
                                description: data[j].description,
                                unit: data[j].unit,
                                quantity: data[j].quantity,
                                rate: data[j].rate,
                                amount: (parseFloat(x_total) * numberfromDesc / 100).toFixed(2),
                                code: data[j].code,
                                index: data[j].index1,
                            });
                            x_total = (parseFloat(x_total) + (parseFloat(x_total) * numberfromDesc / 100)).toFixed(2)
                        }
                    }
                    else if (data[j].description.trim().toLowerCase() != 'total' &&
                        data[j].description.trim().toLowerCase() != 'say' &&
                        data[j].description.trim().toLowerCase().includes('cost') && pretotal > 0
                    ) {
                        console.log('hi cost')
                        xcell_data.push({
                            item_no: data[j].item_no,
                            description: data[j].description,
                            unit: data[j].unit,
                            quantity: data[j].quantity,
                            rate: data[j].rate,
                            amount: (parseFloat(x_total)).toFixed(2),
                            code: data[j].code,
                            index: data[j].index1,
                        });
                    }
                    else if (data[j].description.trim().toLowerCase() != 'total' &&
                        data[j].description.trim().toLowerCase() != 'say' &&
                        data[j].description.trim().toLowerCase().includes('rate') && pretotal > 0
                    ) {
                        if (data[j].description.trim().toLowerCase().includes('per')) {
                            let last_item = xcell_data[xcell_data.length - 1];
                            let costper = parseFloat(extractWordAndNumberInQuotes(last_item.description).number)
                            if (costper == '' || (costper == null) || (costper == undefined)) {
                                costper = 1
                            }
                            xcell_data.push({
                                item_no: data[j].item_no,
                                description: data[j].description,
                                unit: data[j].unit,
                                quantity: data[j].quantity,
                                rate: data[j].rate,
                                amount: ((parseFloat(x_total) / costper)).toFixed(2),
                                code: data[j].code,
                                index: data[j].index1,
                            });
                            mFactor.add(data[i].item_no, costper)

                        }
                        else if (data[j].description.trim().toLowerCase().includes('each')) {
                            if (data[j - 3].description.trim().toLowerCase() === 'total') {

                                let last_item = xcell_data[xcell_data.length - 1];
                                let costper = parseFloat(extractWordAndNumberInQuotes(last_item.description).number)
                                if (costper == '' || (costper == null) || (costper == undefined)) {
                                    costper = 1
                                }
                                xcell_data.push({
                                    item_no: data[j].item_no,
                                    description: data[j].description,
                                    unit: data[j].unit,
                                    quantity: data[j].quantity,
                                    rate: data[j].rate,
                                    amount: ((parseFloat(x_total) / costper)).toFixed(2),
                                    code: data[j].code,
                                    index: data[j].index1,
                                });
                            }
                        }
                        else {
                            xcell_data.push({
                                item_no: data[j].item_no,
                                description: data[j].description,
                                unit: data[j].unit,
                                quantity: data[j].quantity,
                                rate: data[j].rate,
                                amount: (parseFloat(x_total)).toFixed(2),
                                code: data[j].code,
                                index: data[j].index1,
                            });
                        }
                    }
                    else if (
                        data[j].description.trim().toLowerCase() === 'say'
                    ) {
                        let last_item = xcell_data[xcell_data.length - 1];
                        xcell_data.push({
                            item_no: data[j].item_no,
                            description: data[j].description,
                            unit: data[j].unit,
                            quantity: data[j].quantity,
                            rate: data[j].rate,
                            amount: (parseFloat(last_item.amount)).toFixed(1),
                            code: data[j].code,
                            index: data[j].index1,
                        });
                        abstract_rate_data.set(itemNo, last_item.amount)
                    } else {
                        xcell_data.push({
                            item_no: data[j].item_no,
                            description: data[j].description,
                            unit: data[j].unit,
                            quantity: data[j].quantity,
                            rate: data[j].rate,
                            amount: data[j].amount,
                            code: data[j].code,
                            index: data[j].index1,
                        });
                    }
                } else {
                    break mainLoop;
                }
            }
        }
    }
    console.log(type_of_labour)
    console.log(type_of_material)
    var labourName = getLabourName(type_of_labour, lrate_table_default);
    var materialName = getMaterialName(type_of_material, mrate_table_default);
    console.log(labourName)
    console.log(materialName)
    console.log(xcell_data)
    return [xcell_data, abstract_rate_data, type_of_labour, type_of_material, abstract_data, xcell_data_nested, mFactor];

}

async function handleNestedBiharWRD2022(data, primary_table_name, mrate_table_name, lrate_table_name, itemNo, isManualRateChecked, isCpohChecked, manualRates) {
    console.log(isCpohChecked)
    console.log("entered local handler")
    console.log(data)
    let xcell_data_nested = [];
    var abstract_data = [];
    var abstract_rate_data = new Map()
    var type_of_labour = new Set()
    var type_of_material = new Set()
    var x_total = 0;
    var promiseDataNested = [];
    mainLoop: for (let i = 0; i < data.length; i++) {
        if (data[i].item_no.trim() === itemNo.trim()) {

            var firstLine = data[i];
            const itemPrimaryData = null;
            // const itemPrimaryData = await getItemData(primary_table_name, extractItemNumber(itemNo));
            console.log("local handler nested nested")
            // let xcell_data_nested = [];
            if (itemPrimaryData) {
                xcell_data_nested.push({
                    item_no: itemPrimaryData[0],
                    description: itemPrimaryData[1],
                });
            }
            xcell_data_nested.push({
                item_no: data[i].item_no,
                description: data[i].description,
            });
            // if (itemPrimaryData) {
            //     abstract_data.push({
            //         code: itemPrimaryData[0],
            //         description: itemPrimaryData[1],
            //     });
            // }
            // abstract_data.push({
            //     code: itemNo,
            //     description: data[i].description,
            // });
            if (data[i].item_no != null && data[i].item_no.trim() != '' && data[i + 1].item_no != null && data[i + 1].item_no.trim() != '') {
                return await handleBiharWRD2022(data, primary_table_name, mrate_table_name, lrate_table_name, data[i].code, isManualRateChecked, manualRates);
            }
            for (let j = i + 1; j < data.length; j++) {
                if (data[j].item_no.trim() === '') {
                    if (data[j].description.trim().toLowerCase() != 'total' &&
                        data[j].description.trim().toLowerCase() != 'say' &&
                        data[j].code != null && data[j].code.trim() != '') {
                        if (checkDotNumbernAlpaOptional(data[j].code)) {
                            promiseDataNested.push(getDataFromNestedItem(primary_table_name, data[j].code))
                            var promisedData = await Promise.all(promiseDataNested);
                            var dataNested = promisedData[0][0];
                            let nestedItem = await handleNestedBiharWRD2022(dataNested, primary_table_name, mrate_table_name, lrate_table_name, data[j].code, isManualRateChecked, false, manualRates);
                            var myRate = data[j].rate
                            if (nestedItem[1] != null && nestedItem[1] != undefined) {
                                myRate = nestedItem[1].get(data[j].code)
                                xcell_data_nested.push(nestedItem[0]);
                            }
                            xcell_data_nested.push({
                                item_no: data[j].item_no,
                                description: data[j].description,
                                unit: data[j].unit,
                                quantity: data[j].quantity,
                                rate: myRate,
                                amount: (myRate * data[j].quantity).toFixed(2),
                                code: data[j].code,
                                index: data[j].index1,
                            });
                            x_total = (parseFloat(x_total) + parseFloat(myRate * data[j].quantity)).toFixed(2)
                        }
                        else if (data[j].code.trim().includes("SI")) {
                            var myRate = data[j].rate
                            if (lrate_table_name != null && lrate_table_name.trim() != '') {
                                const res = await getLabourRate(lrate_table_name, data[j].code.trim());
                                if (res != null) {
                                    myRate = res[2]
                                }
                            }
                            if (isManualRateChecked) {
                                myRate = manualRates.get(data[j].code.trim())
                            }
                            xcell_data_nested.push({
                                item_no: data[j].item_no,
                                description: data[j].description,
                                unit: data[j].unit,
                                quantity: data[j].quantity,
                                rate: myRate,
                                amount: (myRate * data[j].quantity).toFixed(2),
                                code: data[j].code,
                                index: data[j].index1,
                            });
                            x_total = (parseFloat(x_total) + parseFloat(myRate * data[j].quantity)).toFixed(2)
                            type_of_labour.add(data[j].code)
                        } else if (!data[j].code.trim().includes("SI")) {
                            var myRate = data[j].rate
                            if (mrate_table_name != null && mrate_table_name.trim() != '') {
                                const res = await getMaterialRate(mrate_table_name, data[j].code.trim());
                                if (res != null) {
                                    myRate = res[3]
                                }
                            }
                            if (isManualRateChecked) {
                                myRate = manualRates.get(data[j].code.trim())
                            }
                            xcell_data_nested.push({
                                item_no: data[j].item_no,
                                description: data[j].description,
                                unit: data[j].unit,
                                quantity: data[j].quantity,
                                rate: myRate,
                                amount: (myRate * data[j].quantity).toFixed(2),
                                code: data[j].code,
                                index: data[j].index1,
                            });
                            x_total = (parseFloat(x_total) + parseFloat(myRate * data[j].quantity)).toFixed(2)
                            type_of_material.add(data[j].code)
                        } else {
                            xcell_data_nested.push({
                                item_no: data[j].item_no,
                                description: data[j].description,
                                unit: data[j].unit,
                                quantity: data[j].quantity,
                                rate: data[j].rate,
                                amount: data[j].amount,
                                code: data[j].code,
                                index: data[j].index1,
                            });
                            x_total = (parseFloat(x_total) + parseFloat(data[j].rate * data[j].quantity)).toFixed(2)
                        }
                    }
                    else if (data[j].description.trim().toLowerCase() === 'total') {
                        data[j].amount = parseFloat(x_total).toFixed(2);
                        xcell_data_nested.push({
                            item_no: data[j].item_no,
                            description: data[j].description,
                            unit: data[j].unit,
                            quantity: data[j].quantity,
                            rate: data[j].rate,
                            amount: data[j].amount,
                            code: data[j].code,
                            index: data[j].index1,
                        });
                    }
                    else if (data[j].description.trim().toLowerCase() != 'total' &&
                        data[j].description.trim().toLowerCase() != 'say' &&
                        data[j].description.trim().toLowerCase().includes('add')
                    ) {
                        // let numberfromDesc = parseFloat(extractWordAndNumberInQuotes(data[j].description).number)
                        // xcell_data_nested.push({
                        //     item_no: data[j].item_no,
                        //     description: data[j].description,
                        //     unit: data[j].unit,
                        //     quantity: data[j].quantity,
                        //     rate: data[j].rate,
                        //     amount: (parseFloat(x_total) * numberfromDesc / 100).toFixed(2),
                        //     code: data[j].code,
                        //     index: data[j].index1,
                        // }); 
                        // x_total = (parseFloat(x_total) + (parseFloat(x_total) * numberfromDesc / 100)).toFixed(2)
                    }
                    else if (data[j].description.trim().toLowerCase() != 'total' &&
                        data[j].description.trim().toLowerCase() != 'say' &&
                        data[j].description.trim().toLowerCase().includes('cost')
                    ) {
                        xcell_data_nested.push({
                            item_no: data[j].item_no,
                            description: data[j].description,
                            unit: data[j].unit,
                            quantity: data[j].quantity,
                            rate: data[j].rate,
                            amount: (parseFloat(x_total)).toFixed(2),
                            code: data[j].code,
                            index: data[j].index1,
                        });
                    }
                    else if (data[j].description.trim().toLowerCase() != 'total' &&
                        data[j].description.trim().toLowerCase() != 'say' &&
                        data[j].description.trim().toLowerCase().includes('rate')
                    ) {
                        if (data[j].description.trim().toLowerCase().includes('per')) {
                            let last_item = xcell_data_nested[xcell_data_nested.length - 1];
                            let costper = parseFloat(extractWordAndNumberInQuotes(last_item.description).number)
                            if (costper == '' || (costper == null) || (costper == undefined)) {
                                costper = 1
                            }
                            xcell_data_nested.push({
                                item_no: data[j].item_no,
                                description: data[j].description,
                                unit: data[j].unit,
                                quantity: data[j].quantity,
                                rate: data[j].rate,
                                amount: ((parseFloat(x_total) / costper)).toFixed(2),
                                code: data[j].code,
                                index: data[j].index1,
                            });

                        }
                        if (data[j].description.trim().toLowerCase().includes('each')) {
                            xcell_data_nested.push({
                                item_no: data[j].item_no,
                                description: data[j].description,
                                unit: data[j].unit,
                                quantity: data[j].quantity,
                                rate: data[j].rate,
                                amount: (parseFloat(x_total)).toFixed(2),
                                code: data[j].code,
                                index: data[j].index1,
                            });
                        }
                    }
                    else if (
                        data[j].description.trim().toLowerCase() === 'say'
                    ) {
                        let last_item = xcell_data_nested[xcell_data_nested.length - 1];
                        xcell_data_nested.push({
                            item_no: data[j].item_no,
                            description: data[j].description,
                            unit: data[j].unit,
                            quantity: data[j].quantity,
                            rate: data[j].rate,
                            amount: last_item.amount,
                            code: data[j].code,
                            index: data[j].index1,
                        });
                        abstract_rate_data.set(itemNo, last_item.amount)
                    } else {
                        xcell_data_nested.push({
                            item_no: data[j].item_no,
                            description: data[j].description,
                            unit: data[j].unit,
                            quantity: data[j].quantity,
                            rate: data[j].rate,
                            amount: data[j].amount,
                            code: data[j].code,
                            index: data[j].index1,
                        });
                    }
                } else {
                    break mainLoop;
                }
            }

        }

    }
    console.log(xcell_data_nested)
    return [xcell_data_nested, abstract_rate_data, type_of_labour, type_of_material, abstract_data];

}

async function captureCodesFromDataBiharWRD(ajaxCalls, data, primary_table_name, mrate_table_name, lrate_table_name, itemNo) {
    Promise.all(ajaxCalls)
        .then(function (responses) {
            async function processResponses(responses) {
                for (const response of responses) {
                    const sor = primary_table_name;
                    var table = document.getElementById("manualratetable");
                    var promiseDataNested = [];
                    mainLoop: for (let i = 0; i < data.length; i++) {
                        if (data[i].item_no.trim() === itemNo.trim()) {
                            if (data[i].item_no != null && data[i].item_no.trim() != '' && data[i + 1].item_no != null && data[i + 1].item_no.trim() != '') {
                                console.log("single")
                                console.log(data[i].item_no)
                                promiseDataNested.push(getDataFromNestedItem(primary_table_name, data[j].code))
                                var promisedData = await Promise.all(promiseDataNested);
                                var dataNested = promisedData[0][0];
                                console.log(promiseDataNested);
                                console.log(dataNested);
                                console.log(response);
                                await captureCodesFromLocalDatabiharwrd(sor, table, dataNested, data[i].code, primary_table_name, mrate_table_name, lrate_table_name);
                                continue;
                            }
                            for (let j = i + 1; j < data.length; j++) {
                                if (data[j].item_no.trim() === '') {
                                    if (data[j].code != null && data[j].code.trim() != '' && checkDotNumbernAlpaOptional(data[j].code)) {
                                        console.log("local nested filed created " + data[j].code)
                                        promiseDataNested.push(getDataFromNestedItem(primary_table_name, data[j].code))
                                        var promisedData = await Promise.all(promiseDataNested);
                                        var dataNested = promisedData[0][0];
                                        console.log(promiseDataNested);
                                        console.log(dataNested);
                                        console.log(response);
                                        await captureCodesFromLocalDatabiharwrd(sor, table, dataNested, data[j].code, primary_table_name, mrate_table_name, lrate_table_name);
                                    }
                                    else if (data[j].code != null && data[j].code.trim() != '' && data[j].code.trim().toLowerCase().includes('si')) {
                                        if (mrate_table_name != null && mrate_table_name.trim() != '') {
                                            const res = await getLabourRate(lrate_table_name, data[j].code.trim());
                                            console.log(res)
                                            if (res != null) {
                                                await createInputFieldLocalbiharwrd(sor, table, data[j].code, data[j].description, res[2])
                                            }

                                        } else {
                                            await createInputFieldLocalbiharwrd(sor, table, data[j].code, data[j].description, data[j].rate)
                                        }
                                    }
                                    else if (data[j].code != null && data[j].code.trim() != '' && !data[j].code.trim().toLowerCase().includes('si')) {
                                        if (mrate_table_name != null && mrate_table_name.trim() != '') {
                                            const res = await getMaterialRate(mrate_table_name, data[j].code.trim());
                                            if (res != null) {
                                                await createInputFieldLocalbiharwrd(sor, table, data[j].code, data[j].description, res[3])
                                            }

                                        } else {
                                            await createInputFieldLocalbiharwrd(sor, table, data[j].code, data[j].description, data[j].rate)
                                        }
                                    }
                                } else {
                                    break mainLoop;
                                }
                            }
                        }
                    }
                }
            }
            (async () => {
                try {
                    console.log(responses)

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

async function captureCodesFromLocalDatabiharwrd(sor, table, data, itemNo, primary_table_name, mrate_table_name, lrate_table_name) {
    console.log("entered in local capture")
    // async function processResponses(response) {
    // console.log(response)
    // console.log(response)
    // const data = response[0];
    // const primary_table_name = response[1];
    // const mrate_table_name = response[2];
    // const lrate_table_name = response[3];

    if (primary_table_name == "biharwrd2022") {
        mainLoop: for (let i = 0; i < data.length; i++) {
            if (data[i].item_no.trim() === itemNo.trim()) {
                if (data[i].item_no != null && data[i].item_no.trim() != '' && data[i + 1].item_no != null && data[i + 1].item_no.trim() != '') {
                    console.log("single")
                    console.log(data[i].item_no)
                    await captureCodesFromLocalDatabiharwrd(sor, table, response, data[i].code);
                    continue;
                }
                for (let j = i + 1; j < data.length; j++) {
                    if (data[j].item_no.trim() === '') {
                        if (data[j].code != null && data[j].code.trim() != '' && checkDotNumbernAlpaOptional(data[j].code)) {
                            console.log("local nested filed created " + data[j].code)
                            await captureCodesFromLocalDatabiharwrd(sor, table, response, data[j].code);
                        }
                        else if (data[j].code != null && data[j].code.trim() != '' && data[j].code.trim().toLowerCase().includes('si')) {
                            if (mrate_table_name != null && mrate_table_name.trim() != '') {
                                const res = await getLabourRate(lrate_table_name, data[j].code.trim());
                                if (res != null) {
                                    await createInputFieldLocalbiharwrd(sor, table, data[j].code, data[j].description, res[2])
                                }

                            } else {
                                await createInputFieldLocalbiharwrd(sor, table, data[j].code, data[j].description, data[j].rate)
                            }
                        }
                        else if (data[j].code != null && data[j].code.trim() != '' && !data[j].code.trim().toLowerCase().includes('si')) {
                            if (mrate_table_name != null && mrate_table_name.trim() != '') {
                                const res = await getMaterialRate(mrate_table_name, data[j].code.trim());
                                if (res != null) {
                                    await createInputFieldLocalbiharwrd(sor, table, data[j].code, data[j].description, res[3])
                                }

                            } else {
                                await createInputFieldLocalbiharwrd(sor, table, data[j].code, data[j].description, data[j].rate)
                            }
                        }
                    } else {
                        break mainLoop;
                    }
                }
            }
        }
    }
    // }
    // (async () => {
    //     try {
    //         await processResponses(response);
    //     } catch (error) {
    //         console.error("Error occurred during processing:", error);
    //     }
    // })();
}

async function createInputFieldLocalbiharwrd(sor, table, code, description, value) {
    const inputElement = document.createElement('input');
    inputElement.name = code
    inputElement.id = code
    inputElement.type = 'number';
    inputElement.value = value;
    inputElement.className = 'form-control';
    var rowI = table.rows.length;

    var codeExist = false;
    for (let i = 0; i < rowI; i++) {
        if ((table.rows[i].cells[0].innerHTML) === sor && (table.rows[i].cells[1].innerHTML) === code) {
            codeExist = true;
            break;
        }
    }
    if (codeExist == false) {
        var newRow = table.insertRow();
        var sorCell = newRow.insertCell(0);
        var codeCell = newRow.insertCell(1);
        var descriptionCell = newRow.insertCell(2);
        var rateCell = newRow.insertCell(3);
        sorCell.innerHTML = sor;
        codeCell.innerHTML = code;
        descriptionCell.innerHTML = description;
        rateCell.appendChild(inputElement);
        sortTableByCode(table);
    }
}

function sortTableByCode(table) {
    var rows, switching, i, x, y, shouldSwitch;
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[1];
            y = rows[i + 1].getElementsByTagName("TD")[1];

            if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

function collapseChildBiharwrd(head_item_no) {
    $("#item_seach_header_item .child_item").addClass("d-none");
    $("#item_seach_header_item .child_item_" + head_item_no).removeClass("d-none");
}

function selectedHeadBiharwrd(head_item_no) {
    var td = $("#items_tbody td:contains('" + head_item_no + ".1'):first");

    var table = $("#sor_table");
    var tableHeight = table.height();
    var tdOffset = td.offset().top - table.offset().top;
    var scrollTop = tdOffset - tableHeight + td.outerHeight();
    table.closest("div").scrollTop(tdOffset + 30);
}

function initSOR(head_item_no) {
    var itemSearch = getItemSearchData("biharwrd2022itemsearch", head_item_no);
    itemSearch.then(function (response) {

        var tableHtmlArr = [];
        const convertedResponse = [...response];
        convertedResponse.reverse();
        var sum = 0;
        // console.log("entered in init")

        convertedResponse.forEach(function (row, index) {
            // if(row['item_no'] != "" && !row['item_no'].startsWith(`${head_item_no}.`)) {
            //     sum = 0;
            //     return;
            // } 
            if (!TWO_DOT.test(row['item_no']) && !THREE_DOT.test(row['item_no'])) {
                sum = 0;
                return;
            }

            if (row['item_no'] != '') {
                if (row['rate'] === "0" && sum != 0) {

                    tableHtmlArr.push(`
                        <tr>
                            <td><input type="checkbox" class="form-check-input" name="pickedItem" ><span style="display: inline;"></span></td>
                            <td>${row['item_no']}</td>
                            <td>${row['description']}</td>
                            <td>${row['unit']}</td>
                            <td>${sum.toFixed(1)}</td>
                        </tr>`);
                } else if (row['rate'] === "0" && sum == 0) {
                    tableHtmlArr.push(`
                        <tr>
                            <td></td>
                            <td style="font-weight: bold;">${row['item_no']}</td>
                            <td style="font-weight: bold;">${row['description']}</td>
                            <td style="font-weight: bold;">${row['unit']}</td>
                            <td style="font-weight: bold;">${row['rate']}</td>
                        </tr>`);
                } else {

                    tableHtmlArr.push(`
                        <tr>
                            <td><input type="checkbox" class="form-check-input" name="pickedItem" id="pickedItem" onClick="addToList()" ><span style="display: inline;"></span></td>
                            <td>${row['item_no']}</td>
                            <td>${row['description']}</td>
                            <td>${row['unit']}</td>
                            <td>${row['rate']}</td>
                        </tr>`);
                }

                sum = 0;
            } else {
                sum += Number(row['rate']);
            }

        });
        tableHtmlArr.reverse();

        $("#items_tbody").empty();
        $("#items_tbody").append(tableHtmlArr.join(""));
    })
}

function addToList() {
    const tdItemNo = $('#items_tbody tr').find('input[type="checkbox"]:checked').closest('td').next();

    var selectedItem = "";

    for (var td of tdItemNo) {
        selectedItem += `<tr>
                <td>${td.innerHTML}</td>
            </tr>`
    }

    $("#selected_items_body").empty();
    $("#selected_items_body").append(selectedItem);
}

function saveList() {
    $("#selected_items_body td").each(function (index, element) {
        setTimeout(() => {
            var lastTR = $("#listBody tr:last");
            $(lastTR[0]).find("input").val(element.innerHTML);

            if ($("#selected_items_body td").length > index + 1) {
                $("#add_new_row").trigger("click");
            }
        }, 1000 * index);
    })
    var modal = document.getElementById("itemPickModalBiharwrd");
    modal.style.display = 'none';
    // $("#pickedItem").each(function(index, element) {
    //     console.log("entered in save")
    //     console.log($("#pickedItem").value)

    //     $("#pickedItem").checked = false;

    // })

}

// $(document).ready(function () {
//     initSOR("");
// })
