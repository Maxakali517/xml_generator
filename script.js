
vuetify = Vuetify.createVuetify({
    theme: {
        defaultTheme: 'dark'
    },
});

const appObject = {
    data() {
        return {
            internnalObject: {
                TransactionType: {
                    DataFrom: "FromTravelAgency",
                    DataClassification: "NewBookReport",
                    DataID: "123456789-0",
                    SystemDate: "2024-01-01"
                },
                AccommodationInformation: {
                    AccommodationName: "山田テクニカルホテル",			
                    AccommodationCode: "12345"
                },
                SalesOfficeInformation: {
                    SalesOfficeCompanyName: "山田トラベル",
                    SalesOfficeName: "大阪支店"
                },
                BasicInformation: {
                    TravelAgencyBookingNumber: "000001",
                    TravelAgencyBookingDate: "2024-01-01",
                    GuestOrGroupNameSingleByte: "ﾆｯｺｳ ﾀﾛｳ",
                    GuestOrGroupNameKanjiName: "山田　太郎",
                    CheckInDate: "2025-01-01",
                    CheckInTime: "15:00",
                    CheckOutDate: "2025-01-03",
                    CheckOutTime: "10:00",
                    Nights: 2,
                    TotalRoomCount: 2,
                    PackagePlanName: "山田プラン",	
                    PackagePlanCode: "12345",
                    MealCondition: "1night2meals",
                    SpecificMealCondition: "IncludingBreakfastAndDinner"
                },
                BasicRateInformation: {
                    RoomRateOrPersonalRate: "PersonalRate",
                    TaxServiceFee: "IncludingServiceWithOutTax",
                    Payment: ""
                },
                RisaplsInformation: {
                    RisaplsCommonInformation: {
                        Basic: {
                            SalesOfficeCompanyCode: "99",
                            TelegramDiv: "",
                            RisaplsDataID: "",
                            RisaplsTelegramNumber: "",
                            TelegramData: "",
                            Version: "2.0",
                            AccommodationId: "12345"                
                        },
                        Allotment: {
                            AssignDiv: "0",
                            GenderDiv: "0",
                            HandleDiv: "0",
                            RsvUserDiv: "0",
                            UseDiv: "0"
                        },
                        RoomAndRoomRateInformation: [
                            {
                                RoomInformation: {
                                    RoomTypeCode: "ABC",
                                    RoomPaxMaleCount: 1,
                                    RoomPaxFemaleCount: 0,
                                    RoomChildA70Count: 0,
                                    RoomChildB50Count: 0,
                                    RoomChildC30Count: 0,
                                    RoomChildDNoneCount: 0
                                },
                                RoomRateInformation: {
                                    RoomDate: "2025-01-01",
                                    PerPaxRate: 0,
                                    PerPaxMaleRate: 0,
                                    PerPaxFemaleRate: 0,
                                    PerChildA70Rate: 0,
                                    PerChildB50Rate: 0,
                                    PerChildC30Rate: 0,
                                    PerChildDRate: 0,
                                    TotalPerRoomRate: 10000,
                                }
                            },
                            {
                                RoomInformation: {
                                    RoomTypeCode: "ABC",
                                    RoomPaxMaleCount: 1,
                                },
                                RoomRateInformation: {
                                    RoomDate: "2025-01-01",
                                    TotalPerRoomRate: 10000,
            
                                }
                            },
                            {
                                RoomInformation: {
                                    RoomTypeCode: "ABC",
                                    RoomPaxMaleCount: 1,
                                },
                                RoomRateInformation: {
                                    RoomDate: "2025-01-02",
                                    TotalPerRoomRate: 10000,
            
                                }
                            },
                            {
                                RoomInformation: {
                                    RoomTypeCode: "ABC",
                                    RoomPaxMaleCount: 1,
                                },
                                RoomRateInformation: {
                                    RoomDate: "2025-01-02",
                                    TotalPerRoomRate: 10000,
            
                                }
                            }
                        ],
                        BasicRateInformation: {
                            PointsDiscountList: "*"
                        },
                    },
                    AgentNativeInformation: {
                        Extendmytrip: {
                            SettlementDiv: "0"
                        }
                    }
                }
            },
            displayTagName: false,
            updateRARRIsIsActive: true,
            renderKey: 0,
            outputFileName: "test.xml",
            tagsPersonalRate: [
                "PerPaxRate",
                "PerPaxMaleRate",
                "PerPaxFemaleRate",
                "PerChildA70Rate",
                "PerChildB50Rate",
                "PerChildC30Rate",
                "PerChildDRate",
                "PerChildOtherRate2",
                "PerChildOtherRate"
            ],
            tagsRoomRate: [
                "TotalPerRoomRate"
            ]
        }
    },
    methods:{
        getRARRIsAtCiDate() {
            let RARRIsAtCiDate = [];
            for (let i = 0 ; i < this.internnalObject.BasicInformation.TotalRoomCount ; i++) {
                RARRIsAtCiDate.push(JSON.parse(JSON.stringify(this.internnalObject.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation[i])));
            }
            console.log(RARRIsAtCiDate);
            return RARRIsAtCiDate;
        },
        updateRARRIs(ciOrCo, newDate, oldDate) {
            console.log(`updateRARRIsが\n・処理区分 : ${ciOrCo}, \n・更新後日付 : ${newDate}, \n・更新前日付 : ${oldDate}\nで呼び出されました。`)
            const diffDate = daysBetween(stringToDate(newDate), stringToDate(oldDate));

            if (ciOrCo === "ci" && diffDate > 0) {
                // C/I日が未来日に変更されたパターン（＝削除）
                for (let i = 0 ; i < diffDate*this.internnalObject.BasicInformation.TotalRoomCount ; i++) {
                    this.internnalObject.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation.shift();
                }
            } else if (ciOrCo === "ci" && diffDate < 0) {
                // C/I日が過去日に変更されたパターン（＝追加）
                const RARRIsAtCiDate = this.getRARRIsAtCiDate();
                let copiedRARRIs = [];
                for (let i = 0 ; i > diffDate ; i--) {
                    copiedRARRIs = copiedRARRIs.concat(RARRIsAtCiDate);
                }
                console.log(copiedRARRIs);
                

                let RoomDates = [];
                for (let i = 0 ; i > diffDate ; i--) {
                    for (let j = 0 ; j < this.internnalObject.BasicInformation.TotalRoomCount ; j++) {
                        tmpDate = stringToDate(newDate);
                        tmpDate.setDate(tmpDate.getDate() - i);
                        RoomDates.push(dateToString(tmpDate));
                    }
                }
                console.log(RoomDates);

                let processedRARRIs = copiedRARRIs.map((value, index) => {
                    return structuredClone({
                        ...value, 
                        RoomRateInformation: {
                            ...value.RoomRateInformation,
                            RoomDate: RoomDates[index]
                        },
                    });
                })
                console.log(processedRARRIs);


                this.internnalObject.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation = processedRARRIs.concat(this.internnalObject.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation);
                
            } else if (ciOrCo === "co" && diffDate > 0) {
                // C/O日が未来日に変更されたパターン（＝追加）
                const RARRIsAtCiDate = this.getRARRIsAtCiDate();
                let copiedRARRIs = [];
                for (let i = 0 ; i < diffDate ; i++) {
                    copiedRARRIs = copiedRARRIs.concat(RARRIsAtCiDate);
                }

                let RoomDates = [];
                for (let i = 0 ; i < diffDate ; i++) {
                    for (let j = 0 ; j < this.internnalObject.BasicInformation.TotalRoomCount ; j++) {
                        tmpDate = stringToDate(oldDate);
                        tmpDate.setDate(tmpDate.getDate() + i);
                        RoomDates.push(dateToString(tmpDate));
                    }
                }

                let processedRARRIs = copiedRARRIs.map((value, index) => {
                    return structuredClone({
                        ...value, 
                        RoomRateInformation: {
                            ...value.RoomRateInformation,
                            RoomDate: RoomDates[index]
                        },
                    });
                })
                
                this.internnalObject.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation = this.internnalObject.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation.concat(processedRARRIs);


            } else if (ciOrCo === "co" && diffDate < 0) {
                // C/O日が過去日に変更されたパターン（＝削除）
                for (let i = 0 ; i > diffDate*this.internnalObject.BasicInformation.TotalRoomCount ; i--) {
                    this.internnalObject.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation.pop();
                }
            }

        },
        readXml(e) {
            let self = this; // このメソッド内でのthisをVueインスタンスに固定
            const reader = new FileReader();
            reader.onload = function(e) {
                self.updateRARRIsIsActive = false;
                // 先頭1行目を削除する処理
                const firstRowEndPos = e.target.result.indexOf('\n', 0);
                const outputString = e.target.result.substr(firstRowEndPos + 1);
                // outputStringをinternnalObjectに落とし込む
                const xotree = new XML.ObjTree()
                const tmpObj = {...xotree.parseXML( outputString ).AllotmentBookingReport}
                // tmpObjのRARRIsが配列ではないなら配列にする
                if (Array.isArray(tmpObj.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation) === false) {
                    tmpObj.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation = [tmpObj.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation];
                }
                async function processItems(tmpObj) {
                    for (const key in tmpObj) {
                        await processItem(key,tmpObj);
                    }
                    // `for...in` ループが完了した後に次の処理を実行
                    self.updateRARRIsIsActive = true;
                }
                async function processItem(key,tmpObj) {
                    self.internnalObject[key] = tmpObj[key];
                }
                processItems(tmpObj); 
            }
            reader.readAsText(e.target.files[0]);     
        },
        writeXml() {
            const xmlElement = document.getElementById("formattedXml");
            let outputString = xmlElement.innerText;
            let blob = new Blob([outputString],{type:"text/plain"});
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = this.outputFileName;
            link.click();
        },
        bulkUpdate(perDayOrRoom, index) {
            console.log(`bulkUpdateが引数${perDayOrRoom}, ${index}で呼び出されました`);
            let RARRIs = this.internnalObject.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation;
            if (perDayOrRoom === "perDay") {
                let slicedRARRIs = JSON.parse(JSON.stringify(RARRIs)).slice(index, index + this.TotalRoomCount);
                slicedRARRIs = slicedRARRIs.map((value) => {
                    delete value.RoomRateInformation.RoomDate;
                    return value;
                })
                for (let i = index ; i < RARRIs.length ; i = i + this.TotalRoomCount ) {
                    for (let j = 0 ; j < this.TotalRoomCount ; j++) {
                        Object.assign(RARRIs[i + j].RoomInformation, slicedRARRIs[j].RoomInformation);
                        Object.assign(RARRIs[i + j].RoomRateInformation, slicedRARRIs[j].RoomRateInformation);
                    }
                }
            }else if (perDayOrRoom === "perRoom") {
                let slicedRARRIs = JSON.parse(JSON.stringify(RARRIs)).slice(index);
                slicedRARRIs = slicedRARRIs.map((value) => {
                    delete value.RoomRateInformation.RoomDate;
                    return value;
                })
                for (let i = index ; i < RARRIs.length ; i++ ) {
                    Object.assign(RARRIs[i].RoomInformation, slicedRARRIs[0].RoomInformation);
                    Object.assign(RARRIs[i].RoomRateInformation, slicedRARRIs[0].RoomRateInformation);
                }
            }else {
                console.error("関数「bulkUpdate()」を呼び出しましたが、引数が不正です");
            }
            // tableタグの強制再描画
            this.renderKey += 1;
        },
        decreaseNights(delta) {
            const alertMeaage = "これ以上減らせません！"
            const minValue = 1
            if ((this.internnalObject.BasicInformation.Nights - delta) >= minValue) {
                this.internnalObject.BasicInformation.Nights -= delta
            }else {
                alert(alertMeaage);
            }
        },
        increaseNights(delta) {
            const alertMeaage = "'泊数の最大値に達しました。。。。。'"
            const maxValue = 100
            if ((this.internnalObject.BasicInformation.Nights + delta) <= maxValue) {
                this.internnalObject.BasicInformation.Nights += delta
            }else {
                alert(alertMeaage);
            }
        },
        decreaseTotalRoomCount(delta) {
            const alertMeaage = "これ以上減らせません！"
            const minValue = 1
            if ((this.internnalObject.BasicInformation.TotalRoomCount - delta) >= minValue) {
                this.internnalObject.BasicInformation.TotalRoomCount -= delta
            }else {
                alert(alertMeaage);
            }
        },
        increaseTotalRoomCount(delta) {
            const alertMeaage = "これ以上長くできません"
            const maxValue = 300
            if ((this.internnalObject.BasicInformation.TotalRoomCount + delta) <= maxValue) {
                this.internnalObject.BasicInformation.TotalRoomCount += delta
            }else {
                alert(alertMeaage);
            }
        },
        updateCiDate(date) {
            console.log("updateCiDate has been called.");
            this.internnalObject.BasicInformation.CheckInDate = dateToString(date);
        },
        updateCoDate(date) {
            console.log("updateCoDate has been called.");
            this.internnalObject.BasicInformation.CheckOutDate = dateToString(date);
        }
    },
    computed:{
        xmlString() {
            return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + "\n" + formatXml(objectToXml(removeEmptyStringProperties(this.internnalObject), 'AllotmentBookingReport'));
        },
        ciDate() {
            return stringToDate(this.internnalObject.BasicInformation.CheckInDate);
        },
        coDate() {
            return stringToDate(this.internnalObject.BasicInformation.CheckOutDate);
        },
        ciDateTomorrow() {
            tmpdate = stringToDate(this.internnalObject.BasicInformation.CheckInDate);
            tmpdate.setDate(stringToDate(this.internnalObject.BasicInformation.CheckInDate).getDate() + 1);
            return dateToString(tmpdate);
        },
        coDateYesterday() {
            tmpdate = stringToDate(this.internnalObject.BasicInformation.CheckOutDate);
            tmpdate.setDate(stringToDate(this.internnalObject.BasicInformation.CheckOutDate).getDate() - 1);
            return dateToString(tmpdate);
        },
        RoomRateOrPersonalRate() {
            return this.internnalObject.BasicRateInformation.RoomRateOrPersonalRate;
        },
        Nights() {
            return parseInt(this.internnalObject.BasicInformation.Nights);
        },
        TotalRoomCount() {
            return parseInt(this.internnalObject.BasicInformation.TotalRoomCount);
        }
    },
    watch: {
        // チェックイン日変更時の各種データ同期処理
        "internnalObject.BasicInformation.CheckInDate": function(newValue, oldValue) {
            if (this.updateRARRIsIsActive === true) {
                if (isNaN(stringToDate(newValue)) === false) {
                    // 更新後泊数の計算
                    let daysNewDateToCoDate = daysBetween(stringToDate(this.internnalObject.BasicInformation.CheckOutDate), stringToDate(newValue));
                    // 泊数変更処理
                    this.internnalObject.BasicInformation.Nights = daysNewDateToCoDate;
    
                    this.updateRARRIs("ci", newValue, oldValue);
                }
            }
        },
        // チェックアウト日変更時の各種データ同期処理
        "internnalObject.BasicInformation.CheckOutDate": function(newValue, oldValue) {
            if (this.updateRARRIsIsActive === true) {
                if (isNaN(stringToDate(newValue)) === false) {
                    // 更新後泊数の計算
                    let daysCiDateToNewDate = daysBetween(stringToDate(newValue), stringToDate(this.internnalObject.BasicInformation.CheckInDate));
                    // 泊数変更処理(チェックアウト日変更時のみ動作させる)
                    if (this.internnalObject.BasicInformation.Nights != daysCiDateToNewDate) {
                        this.internnalObject.BasicInformation.Nights = daysCiDateToNewDate; 
                    }
                    this.updateRARRIs("co", newValue, oldValue);
                }
            }
        },
        // 泊数変更時の各種データ同期処理
        "internnalObject.BasicInformation.Nights": function(newValue, oldValue) {
            if (this.updateRARRIsIsActive === true && isNaN(newValue) === false && newValue> 0) {
                let ciDate = stringToDate(this.internnalObject.BasicInformation.CheckInDate);
                ciDate.setDate(ciDate.getDate() + newValue);
                if (this.internnalObject.BasicInformation.CheckOutDate != dateToString(ciDate)) {
                    let updatedCheckOutDate = stringToDate(this.internnalObject.BasicInformation.CheckOutDate);
                    updatedCheckOutDate.setDate(updatedCheckOutDate.getDate() + (newValue - oldValue));
                    this.internnalObject.BasicInformation.CheckOutDate = dateToString(updatedCheckOutDate);
                }
            }
        },
        // 総部屋数変更時の各種データ同期処理
        "internnalObject.BasicInformation.TotalRoomCount": function(newValue, oldValue) {
            const diffRoomCount = newValue - oldValue;
            if (isNaN(newValue) === false && newValue > 0) {
                if (diffRoomCount > 0) {
                    // 室数増加時の処理
                    let additionalRARRIs = [];
                    for (let i = 0 ; i < this.Nights ; i++ ) {
                        let additionalArrayOneDay = [];
                        for (let j = 0 ; j < diffRoomCount ; j++ ) {
                            additionalArrayOneDay.push(JSON.parse(JSON.stringify(this.internnalObject.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation[oldValue * i])));
                        }
                        additionalRARRIs.push(additionalArrayOneDay);
                    }
                    for (let i = 0 ; i < this.Nights ; i++ ) {
                        this.internnalObject.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation.splice(oldValue * i + diffRoomCount * i, 0, ...additionalRARRIs[i]);
                    }
                }else {
                    // 室数減少時の処理
                    for (let i = 0 ; i < this.Nights ; i++ ) {
                        this.internnalObject.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation.splice(oldValue * i + diffRoomCount * i, -diffRoomCount);
                    }
                }
            }
        },
        // RoomRateOrPersonalRate切替時の不要タグ削除処理
        "internnalObject.BasicRateInformation.RoomRateOrPersonalRate": function(newValue, oldValue) {
            if (newValue === "RoomRate") {
                this.internnalObject.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation.forEach((value) => {
                    for (tag of this.tagsPersonalRate) {
                        delete value.RoomRateInformation[tag];
                    }
                })
            }
            else if (newValue === "PersonalRate") {
                this.internnalObject.RisaplsInformation.RisaplsCommonInformation.RoomAndRoomRateInformation.forEach((value) => {
                    for (tag of this.tagsRoomRate) {
                        delete value.RoomRateInformation[tag];
                    }
                })
            }
        }
    }
}

app = Vue.createApp(appObject);
app.use(vuetify);
app.mount("#app");
