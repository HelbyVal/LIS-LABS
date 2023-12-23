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

    var data = {"OkPercent": 97.64545454545454, "KoPercent": 2.3545454545454545};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.21197727272727274, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.092, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-9"], "isController": false}, {"data": [0.1365, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-7"], "isController": false}, {"data": [0.9965, 500, 1500, "/generate_204-1"], "isController": false}, {"data": [0.1275, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-21"], "isController": false}, {"data": [0.0645, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-12"], "isController": false}, {"data": [0.076, 500, 1500, "/-22"], "isController": false}, {"data": [0.1085, 500, 1500, "/-20"], "isController": false}, {"data": [0.007, 500, 1500, "/-10"], "isController": false}, {"data": [0.055, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-15"], "isController": false}, {"data": [0.0255, 500, 1500, "/catalog/-18"], "isController": false}, {"data": [0.0635, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-17"], "isController": false}, {"data": [0.013, 500, 1500, "/catalog/-16"], "isController": false}, {"data": [0.1, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-19"], "isController": false}, {"data": [0.076, 500, 1500, "/delivery-payment/index.php-14"], "isController": false}, {"data": [0.0395, 500, 1500, "/-2"], "isController": false}, {"data": [1.0, 500, 1500, "/upload/iblock/04b/ygy0pex9gp3ke59fpg53vugeaqft1py1.webp-13"], "isController": false}, {"data": [0.0875, 500, 1500, "/catalog/syry-polutverdnye/syr-polutverdyy-so-vkusom-toplenogo-moloka-zolotoy-larets-245-gr/-11"], "isController": false}, {"data": [0.096, 500, 1500, "/-8"], "isController": false}, {"data": [0.9995, 500, 1500, "/generate_204-4"], "isController": false}, {"data": [0.158, 500, 1500, "/company/-5"], "isController": false}, {"data": [0.2355, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-3"], "isController": false}, {"data": [0.106, 500, 1500, "/company/-6"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22000, 518, 2.3545454545454545, 7193.231590909089, 33, 175239, 2755.0, 16133.600000000006, 33432.0, 127250.98000000001, 83.96786320871739, 4917.345260288449, 62.98952802069617], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/bitrix/templates/aspro_max/js/setTheme.php-9", 1000, 28, 2.8, 8562.078000000003, 59, 127385, 2615.5, 16994.5, 38463.64999999999, 127206.40000000002, 3.955883981834581, 68.58761096254568, 2.348806114214282], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-7", 1000, 43, 4.3, 10148.803000000007, 162, 175239, 2292.0, 18581.09999999997, 62522.799999999836, 127304.9, 4.28294872453787, 73.19676482114406, 2.576461342104812], "isController": false}, {"data": ["/generate_204-1", 1000, 1, 0.1, 137.31699999999984, 68, 21024, 95.0, 147.89999999999998, 278.6999999999996, 429.98, 46.71805652884839, 5.9079636037140855, 15.633075289067975], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-21", 1000, 12, 1.2, 5821.2630000000045, 56, 140845, 2357.0, 9202.8, 17828.69999999999, 126979.24000000008, 4.261430221210843, 75.01182546886386, 2.530224193843938], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-12", 1000, 24, 2.4, 7632.6150000000025, 56, 127385, 2678.0, 16970.1, 33220.9, 110185.63000000018, 4.001904906735606, 69.65002841352484, 2.7317690720783094], "isController": false}, {"data": ["/-22", 1000, 4, 0.4, 5610.745999999999, 157, 127370, 3477.0, 9770.5, 17619.1, 66536.59, 4.38973854717213, 54.85930853661481, 5.63721307571421], "isController": false}, {"data": ["/-20", 1000, 6, 0.6, 5192.651999999997, 121, 127399, 2427.0, 9182.4, 17513.35, 65491.89, 4.2378448016476735, 854.5999835386216, 3.4598029825951713], "isController": false}, {"data": ["/-10", 1000, 31, 3.1, 10191.594000000006, 153, 169307, 3651.0, 18500.8, 35960.899999999965, 127320.99, 3.970223325062035, 48.41297301488834, 4.8076923076923075], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-15", 1000, 23, 2.3, 8383.394999999999, 56, 169305, 2806.5, 17137.8, 33388.55, 127297.98, 4.037141703673799, 70.33000479410578, 2.4995584376261606], "isController": false}, {"data": ["/catalog/-18", 1000, 20, 2.0, 8863.462999999998, 224, 139339, 5244.0, 11742.3, 20872.749999999985, 127268.64, 4.148947204646821, 424.3756968934758, 3.6627424541022715], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-17", 1000, 20, 2.0, 7641.917000000004, 56, 150771, 2648.0, 16838.6, 33013.649999999994, 127254.91, 4.135084955320407, 72.24122638349606, 2.7298021775357375], "isController": false}, {"data": ["/catalog/-16", 1000, 17, 1.7, 9811.878000000012, 238, 146736, 5394.0, 15789.099999999995, 35736.6, 127003.85000000024, 4.071893348969404, 486.88164402566713, 3.3680602212666844], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-19", 1000, 19, 1.9, 6182.285999999999, 57, 137626, 2431.5, 9027.3, 17595.049999999996, 127018.31000000019, 4.220370886193479, 73.80093328226684, 2.8479260569918883], "isController": false}, {"data": ["/delivery-payment/index.php-14", 1000, 27, 2.7, 7584.540000000007, 74, 127387, 2393.5, 15975.099999999997, 32926.149999999994, 127269.82, 4.0170483532110275, 323.9778722460623, 3.0559381515150297], "isController": false}, {"data": ["/-2", 1000, 35, 3.5, 8259.069000000001, 740, 148991, 3653.0, 9109.4, 32652.699999999997, 127455.9300000001, 6.525753887717879, 1270.4104678802394, 5.232074161930057], "isController": false}, {"data": ["/upload/iblock/04b/ygy0pex9gp3ke59fpg53vugeaqft1py1.webp-13", 1000, 0, 0.0, 78.67900000000002, 33, 355, 69.0, 139.0, 172.0, 189.97000000000003, 4.001760774740886, 144.3134979390932, 2.9231611909240067], "isController": false}, {"data": ["/catalog/syry-polutverdnye/syr-polutverdyy-so-vkusom-toplenogo-moloka-zolotoy-larets-245-gr/-11", 1000, 31, 3.1, 8230.500000000011, 112, 155268, 2485.0, 16597.699999999997, 37483.44999999998, 127312.85, 3.9886721710342625, 412.00860649505404, 3.287538390969646], "isController": false}, {"data": ["/-8", 1000, 28, 2.8, 8150.046999999999, 286, 137632, 2563.0, 16844.899999999998, 33765.54999999999, 127278.84, 4.292969404007057, 846.6087235418929, 3.190380582470089], "isController": false}, {"data": ["/generate_204-4", 1000, 0, 0.0, 46.98300000000004, 34, 715, 38.0, 72.89999999999998, 74.0, 279.98, 5.8979304162169495, 0.7314816043550318, 1.9755763015257948], "isController": false}, {"data": ["/company/-5", 1000, 43, 4.3, 10426.717999999999, 570, 127436, 2155.0, 21614.199999999997, 65313.0, 127270.98, 4.9243133045096865, 383.15220067561575, 3.6595726804022175], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-3", 1000, 63, 6.3, 10928.470999999996, 135, 127392, 1864.0, 28473.3, 77484.54999999965, 127290.0, 5.89532265100869, 98.80445620070036, 3.5003478240364094], "isController": false}, {"data": ["/company/-6", 1000, 43, 4.3, 10366.081, 565, 147604, 2815.5, 18825.899999999994, 64968.09999999999, 127250.94, 4.268050653225153, 49.67249463426007, 5.076646187136949], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gstatic.com:80 [www.gstatic.com/64.233.162.94] failed: Connection timed out: connect", 1, 0.19305019305019305, 0.004545454545454545], "isController": false}, {"data": ["502/Bad Gateway", 517, 99.8069498069498, 2.35], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22000, 518, "502/Bad Gateway", 517, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gstatic.com:80 [www.gstatic.com/64.233.162.94] failed: Connection timed out: connect", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/bitrix/templates/aspro_max/js/setTheme.php-9", 1000, 28, "502/Bad Gateway", 28, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-7", 1000, 43, "502/Bad Gateway", 43, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/generate_204-1", 1000, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to www.gstatic.com:80 [www.gstatic.com/64.233.162.94] failed: Connection timed out: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-21", 1000, 12, "502/Bad Gateway", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-12", 1000, 24, "502/Bad Gateway", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/-22", 1000, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/-20", 1000, 6, "502/Bad Gateway", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/-10", 1000, 31, "502/Bad Gateway", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-15", 1000, 23, "502/Bad Gateway", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/catalog/-18", 1000, 20, "502/Bad Gateway", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-17", 1000, 20, "502/Bad Gateway", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/catalog/-16", 1000, 17, "502/Bad Gateway", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-19", 1000, 19, "502/Bad Gateway", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/delivery-payment/index.php-14", 1000, 27, "502/Bad Gateway", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/-2", 1000, 35, "502/Bad Gateway", 35, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/catalog/syry-polutverdnye/syr-polutverdyy-so-vkusom-toplenogo-moloka-zolotoy-larets-245-gr/-11", 1000, 31, "502/Bad Gateway", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/-8", 1000, 28, "502/Bad Gateway", 28, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/company/-5", 1000, 43, "502/Bad Gateway", 43, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-3", 1000, 63, "502/Bad Gateway", 63, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/company/-6", 1000, 43, "502/Bad Gateway", 43, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
