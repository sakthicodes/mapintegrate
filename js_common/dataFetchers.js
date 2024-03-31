function getDataFromAPI(primary_table_name, mrate_table_name, lrate_table_name, itemNo) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "selData.php",
            type: "GET",
            dataType: "json",
            data: {
                tableName: primary_table_name,
                itemNumber: itemNo,
            },
            success: function (data) {
                resolve([data, primary_table_name, mrate_table_name, lrate_table_name, itemNo])
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

function getDataFromNestedItem(primary_table_name, itemNo) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "selData.php",
            type: "GET",
            dataType: "json",
            data: {
                tableName: primary_table_name,
                itemNumber: itemNo,
            },
            success: function (data) {
                resolve([data])
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

function getItemData(primary_table_name, item_no) {
    if (!item_no) {
        return null;
    }
    else {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "selCodeData.php",
                type: "GET",
                dataType: "json",
                data: {
                    tableName: primary_table_name,
                    item_no: item_no
                },
                success: function (data) {
                    resolve(data)
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    }
}

function getLabourRate(lrate_table_name, code) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "selSpecificLabourRate.php",
            type: "GET",
            dataType: "json",
            data: {
                tableName: lrate_table_name,
                code: code
            },
            success: function (data) {
                resolve(data)
            },
            error: function (error) {
                console.log(error)
                reject(error);
            }
        });
    });
}

function getMaterialRate(mrate_table_name, code) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "selSpecificMaterialRate.php",
            type: "GET",
            dataType: "json",
            data: {
                tableName: mrate_table_name,
                code: code
            },
            success: function (data) {
                resolve(data)
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

function getSayValue(data, itemNo) {
    var sayValue = 0;
    upperloop: for (let i = 0; i < data.length; i++) {
        if (data[i].item_no.trim() === itemNo) {
            for (let j = i + 1; j < data.length; j++) {
                if (data[j].item_no.trim() === '') {
                    if (data[j].description.trim().toLowerCase().includes('say')) {
                        sayValue = data[j].amount
                    }
                } else {
                    break upperloop;
                }
            }
        }
    }
    return sayValue;
}

function getItemSearchData(primary_table_name, itemNo) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "itemSearch.php",
            type: "GET",
            dataType: "json",
            data: {
                tableName: primary_table_name,
                itemNumber: itemNo,
            },
            success: function (data) {
                resolve(data)
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

function getLabourName(type_of_labour, lrate_table_default) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "selLabourName.php",
            type: "GET",
            dataType: "json",
            data: {
                tableName: lrate_table_default,
                labour: type_of_labour
            },
            success: function (data) {
                console.log(data)
                resolve(data)
            },
            error: function (error) {
                console.log(error)
                reject(error);
            }
        });
    });
}

function getMaterialName(type_of_material, mrate_table_default) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "selMaterialName.php",
            type: "GET",
            dataType: "json",
            data: {
                tableName: mrate_table_default,
                material: type_of_material
            },
            success: function (data) {
                console.log(data)
                resolve(data)
            },
            error: function (error) {
                console.log(error)
                reject(error);
            }
        });
    });
}

function getAbstractUnit(itemNo, tableName) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "selUnit.php",
            type: "GET",
            dataType: "json",
            data: {
                tableName: tableName,
                itemNo: itemNo
            },
            success: function (data) {
                console.log(data)
                resolve(data)
            },
            error: function (error) {
                console.log(error)
                reject(error);
            }
        });
    });
}