import React, { useState } from 'react'
import csvtojson from 'csvtojson'

function CSVReader() {
    const [csv, setCSV] = useState(null)
    const [csvArray, setCSVArray] = useState(null)

    const dateRangeOverlaps = (a_start, a_end, b_start, b_end) => {
        let p = 0
        if (a_start <= b_start && b_start <= a_end){
            p = (b_start+a_end)
            return [true, p]
        } 
        if (a_start <= b_end   && b_end   <= a_end) {
            p = (a_start+b_end)
            return [true, p]
        } 
        return [false, p]
    }
    

    const submit = () => {
        const file = csv
        const reader = new FileReader()

        reader.onload = function(e){
            const text = e.target.result
            
            csvtojson().fromString(text).then((json) => {
                setCSVArray(json)

                json.forEach((employee) => {
                    if(employee.DateFrom === 'NULL'){
                        employee.DateFrom = new Date().getTime()
                    }
                    if(employee.DateTo === 'NULL'){
                        employee.DateTo = new Date().getTime()
                    }
                    employee.DateFrom = new Date(employee.DateTo).getTime()
                    employee.DateTo = new Date(employee.DateTo).getTime()
                })


                for(var i = 0; i < json.length; i++){
                    for(var k = i ; k < json.length; k++){
                        if(json[i].ProjectID === json[k].ProjectID && json[i].EmpID !== json[k].EmpID ){

                            if(dateRangeOverlaps(json[i].DateFrom , json[i].DateTo, json[k].DateFrom , json[k].DateTo)[0]){
                                console.log(json[i].EmpID , json[k].EmpID)
                            }
                        }
                    }
                }
            })
        }

        reader.readAsText(file)
        
    }
  return (
    <form id='csv'>
        <input
            type='file'
            accept=".csv"
            id='csvFile'
            onChange={(e) =>{
                setCSV((e.target.files[0]))
            }}
        >
        </input>
        <button
            onClick={(e) => {
                e.preventDefault()
                if(csv){
                    submit()
                }
            }}
        >
            Submit
        </button>
        <br/>
        <br/>
            
    </form>
  )
}

export default CSVReader