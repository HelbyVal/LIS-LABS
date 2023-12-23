/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5670454545454545, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.995, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-9"], "isController": false}, {"data": [0.975, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-7"], "isController": false}, {"data": [0.945, 500, 1500, "/generate_204-1"], "isController": false}, {"data": [0.665, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-21"], "isController": false}, {"data": [0.9, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-12"], "isController": false}, {"data": [0.32, 500, 1500, "/-22"], "isController": false}, {"data": [0.595, 500, 1500, "/-20"], "isController": false}, {"data": [0.525, 500, 1500, "/-10"], "isController": false}, {"data": [0.82, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-15"], "isController": false}, {"data": [0.0, 500, 1500, "/catalog/-18"], "isController": false}, {"data": [0.625, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-17"], "isController": false}, {"data": [0.0, 500, 1500, "/catalog/-16"], "isController": false}, {"data": [0.625, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-19"], "isController": false}, {"data": [0.52, 500, 1500, "/delivery-payment/index.php-14"], "isController": false}, {"data": [0.0, 500, 1500, "/-2"], "isController": false}, {"data": [0.67, 500, 1500, "/upload/iblock/04b/ygy0pex9gp3ke59fpg53vugeaqft1py1.webp-13"], "isController": false}, {"data": [0.165, 500, 1500, "/catalog/syry-polutverdnye/syr-polutverdyy-so-vkusom-toplenogo-moloka-zolotoy-larets-245-gr/-11"], "isController": false}, {"data": [0.0, 500, 1500, "/-8"], "isController": false}, {"data": [1.0, 500, 1500, "/generate_204-4"], "isController": false}, {"data": [0.245, 500, 1500, "/company/-5"], "isController": false}, {"data": [0.93, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-3"], "isController": false}, {"data": [0.955, 500, 1500, "/company/-6"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2200, 0, 0.0, 1227.2481818181814, 50, 8116, 711.0, 3198.1000000000017, 3767.0, 5758.619999999992, 73.44349858120513, 4410.335751022367, 55.095664329828075], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/bitrix/templates/aspro_max/js/setTheme.php-9", 100, 0, 0.0, 434.87000000000006, 351, 501, 440.0, 484.0, 489.84999999999997, 500.96, 10.833062506770665, 192.83697595060124, 6.4321308633950816], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-7", 100, 0, 0.0, 403.8400000000001, 286, 883, 383.5, 477.5, 512.4499999999996, 882.1099999999996, 11.325028312570781, 201.5943516421291, 6.812712344280861], "isController": false}, {"data": ["/generate_204-1", 100, 0, 0.0, 232.82999999999996, 99, 659, 179.0, 548.8, 579.95, 658.9, 65.44502617801047, 8.116717113874346, 21.921527323298427], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-21", 100, 0, 0.0, 645.8700000000001, 72, 1365, 736.0, 1072.7, 1230.0499999999997, 1364.4399999999996, 8.56898029134533, 152.5345437017995, 5.087832047986289], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-12", 100, 0, 0.0, 507.2399999999999, 243, 1446, 458.0, 697.8000000000009, 1238.6499999999999, 1444.7199999999993, 10.766580534022395, 191.65354489664082, 7.349452923126615], "isController": false}, {"data": ["/-22", 100, 0, 0.0, 1398.1399999999999, 194, 2849, 1639.5, 2193.1, 2308.75, 2844.649999999998, 9.38350380031904, 117.73181652904195, 12.050104977948767], "isController": false}, {"data": ["/-20", 100, 0, 0.0, 900.5999999999999, 283, 1557, 927.0, 1351.8, 1433.5, 1556.87, 8.134049129656743, 1650.1381835143159, 6.640688547258825], "isController": false}, {"data": ["/-10", 100, 0, 0.0, 652.4399999999999, 454, 1367, 575.5, 1010.0000000000002, 1176.6999999999998, 1366.4999999999998, 10.040160642570282, 125.93646068649598, 12.158007028112449], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-15", 100, 0, 0.0, 576.28, 220, 1355, 468.5, 1117.9, 1217.95, 1354.93, 10.611205432937181, 188.88774671052633, 6.569828363752123], "isController": false}, {"data": ["/catalog/-18", 100, 0, 0.0, 3399.75, 1994, 4686, 3478.5, 4156.4, 4383.949999999999, 4684.259999999999, 6.937699458859442, 723.9292229993409, 6.124687803524352], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-17", 100, 0, 0.0, 761.09, 262, 1370, 795.0, 1139.4, 1213.0499999999997, 1369.2199999999996, 8.426729586247577, 150.0023700176961, 5.5629582034212515], "isController": false}, {"data": ["/catalog/-16", 100, 0, 0.0, 2925.110000000002, 1879, 4403, 2787.5, 3797.0, 4074.8499999999995, 4402.86, 7.562580352416245, 919.7327366378657, 6.255376521969295], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-19", 100, 0, 0.0, 736.4199999999998, 94, 1347, 789.5, 1117.9, 1247.4499999999996, 1346.1699999999996, 8.109642364771712, 144.35796975103398, 5.472424681696538], "isController": false}, {"data": ["/delivery-payment/index.php-14", 100, 0, 0.0, 1010.3299999999994, 408, 1537, 1138.0, 1334.7, 1345.95, 1536.95, 10.49097775912715, 869.2049641995384, 7.9809293694922365], "isController": false}, {"data": ["/-2", 100, 0, 0.0, 4349.170000000002, 2398, 8116, 3904.5, 6533.3, 7829.649999999995, 8114.289999999999, 10.767739851405189, 2184.2574802142776, 8.633119548831699], "isController": false}, {"data": ["/upload/iblock/04b/ygy0pex9gp3ke59fpg53vugeaqft1py1.webp-13", 100, 0, 0.0, 659.1099999999999, 50, 942, 780.0, 886.7, 902.9, 941.8499999999999, 11.556685542586386, 416.76297237952156, 8.441797642436148], "isController": false}, {"data": ["/catalog/syry-polutverdnye/syr-polutverdyy-so-vkusom-toplenogo-moloka-zolotoy-larets-245-gr/-11", 100, 0, 0.0, 1583.4299999999998, 475, 2181, 1652.0, 2103.1, 2143.45, 2180.85, 9.98801438274071, 1064.2931607071514, 8.23230872952457], "isController": false}, {"data": ["/-8", 100, 0, 0.0, 3200.7999999999993, 2177, 4266, 3207.5, 3856.0, 4168.949999999996, 4265.96, 8.803591865481117, 1785.987003009728, 6.5425130953429], "isController": false}, {"data": ["/generate_204-4", 100, 0, 0.0, 320.8900000000001, 212, 462, 318.5, 397.5, 435.95, 461.99, 13.439053890606102, 1.6667576602607177, 4.501558090310442], "isController": false}, {"data": ["/company/-5", 100, 0, 0.0, 1515.8300000000004, 834, 2225, 1519.0, 2059.8, 2180.1499999999996, 2224.73, 10.869565217391305, 883.0681046195652, 8.077870244565219], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-3", 100, 0, 0.0, 364.68999999999994, 210, 819, 315.0, 641.0, 681.3999999999999, 818.7599999999999, 13.867702121758425, 246.85593190958258, 8.233948134794064], "isController": false}, {"data": ["/company/-6", 100, 0, 0.0, 420.7300000000001, 318, 571, 415.0, 499.70000000000005, 509.0, 570.6499999999999, 11.483693155718878, 138.99575103353237, 13.659314710610932], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
