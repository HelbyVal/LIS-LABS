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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9522727272727273, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-9"], "isController": false}, {"data": [1.0, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-7"], "isController": false}, {"data": [1.0, 500, 1500, "/generate_204-1"], "isController": false}, {"data": [1.0, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-21"], "isController": false}, {"data": [1.0, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-12"], "isController": false}, {"data": [1.0, 500, 1500, "/-22"], "isController": false}, {"data": [1.0, 500, 1500, "/-20"], "isController": false}, {"data": [1.0, 500, 1500, "/-10"], "isController": false}, {"data": [1.0, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-15"], "isController": false}, {"data": [0.9, 500, 1500, "/catalog/-18"], "isController": false}, {"data": [1.0, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-17"], "isController": false}, {"data": [0.55, 500, 1500, "/catalog/-16"], "isController": false}, {"data": [1.0, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-19"], "isController": false}, {"data": [1.0, 500, 1500, "/delivery-payment/index.php-14"], "isController": false}, {"data": [0.7, 500, 1500, "/-2"], "isController": false}, {"data": [1.0, 500, 1500, "/upload/iblock/04b/ygy0pex9gp3ke59fpg53vugeaqft1py1.webp-13"], "isController": false}, {"data": [1.0, 500, 1500, "/catalog/syry-polutverdnye/syr-polutverdyy-so-vkusom-toplenogo-moloka-zolotoy-larets-245-gr/-11"], "isController": false}, {"data": [0.85, 500, 1500, "/-8"], "isController": false}, {"data": [1.0, 500, 1500, "/generate_204-4"], "isController": false}, {"data": [0.95, 500, 1500, "/company/-5"], "isController": false}, {"data": [1.0, 500, 1500, "/bitrix/templates/aspro_max/js/setTheme.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "/company/-6"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 220, 0, 0.0, 207.8227272727275, 42, 1715, 130.5, 480.40000000000003, 588.95, 1200.6099999999979, 33.257747543461825, 1997.5335707199547, 24.94921579743008], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/bitrix/templates/aspro_max/js/setTheme.php-9", 10, 0, 0.0, 101.69999999999999, 64, 175, 94.5, 172.20000000000002, 175.0, 175.0, 4.432624113475177, 78.90417220744682, 2.631870567375887], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-7", 10, 0, 0.0, 113.4, 82, 173, 98.5, 171.5, 173.0, 173.0, 4.692632566870014, 83.53252580947913, 2.822911778507743], "isController": false}, {"data": ["/generate_204-1", 10, 0, 0.0, 131.0, 112, 183, 121.5, 179.60000000000002, 183.0, 183.0, 10.01001001001001, 1.2414758508508508, 3.3529623373373374], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-21", 10, 0, 0.0, 81.7, 61, 100, 85.0, 99.10000000000001, 100.0, 100.0, 4.547521600727603, 80.94943724420192, 2.7000909504320147], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-12", 10, 0, 0.0, 83.49999999999999, 61, 98, 86.0, 97.4, 98.0, 98.0, 4.177109440267335, 74.35581140350877, 2.851366697994987], "isController": false}, {"data": ["/-22", 10, 0, 0.0, 187.4, 171, 218, 184.5, 215.60000000000002, 218.0, 218.0, 4.3725404459991255, 54.844638172278096, 5.615127623524268], "isController": false}, {"data": ["/-20", 10, 0, 0.0, 298.5, 214, 336, 309.0, 335.9, 336.0, 336.0, 4.1288191577208915, 837.614832782824, 3.3707937654830715], "isController": false}, {"data": ["/-10", 10, 0, 0.0, 191.4, 167, 209, 193.0, 208.5, 209.0, 209.0, 4.3763676148796495, 54.88494939824945, 5.299507658643326], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-15", 10, 0, 0.0, 82.7, 68, 96, 81.5, 95.9, 96.0, 96.0, 4.17536534446764, 74.32476513569938, 2.5851383089770357], "isController": false}, {"data": ["/catalog/-18", 10, 0, 0.0, 437.79999999999995, 313, 549, 436.5, 545.6, 549.0, 549.0, 3.9856516540454363, 415.8984686379036, 3.5185831008369868], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-17", 10, 0, 0.0, 86.39999999999999, 69, 103, 84.5, 103.0, 103.0, 103.0, 4.719207173194904, 84.00557456347333, 3.1154141104294477], "isController": false}, {"data": ["/catalog/-16", 10, 0, 0.0, 650.5, 366, 913, 655.0, 901.4000000000001, 913.0, 913.0, 3.4940600978336827, 424.95072829315166, 2.8901063504542277], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-19", 10, 0, 0.0, 86.9, 63, 115, 86.0, 114.0, 115.0, 115.0, 4.614674665436087, 82.14481425934473, 3.114004095523766], "isController": false}, {"data": ["/delivery-payment/index.php-14", 10, 0, 0.0, 128.9, 107, 159, 127.5, 157.8, 159.0, 159.0, 4.083299305839118, 338.30374004695796, 3.1063380461412824], "isController": false}, {"data": ["/-2", 10, 0, 0.0, 669.6, 382, 1715, 492.5, 1669.0000000000002, 1715.0, 1715.0, 4.178854993731718, 848.2741002402843, 3.3504296385290435], "isController": false}, {"data": ["/upload/iblock/04b/ygy0pex9gp3ke59fpg53vugeaqft1py1.webp-13", 10, 0, 0.0, 60.300000000000004, 42, 97, 59.5, 94.10000000000001, 97.0, 97.0, 4.191114836546522, 151.14207879295893, 3.0614784157585917], "isController": false}, {"data": ["/catalog/syry-polutverdnye/syr-polutverdyy-so-vkusom-toplenogo-moloka-zolotoy-larets-245-gr/-11", 10, 0, 0.0, 165.9, 108, 312, 152.0, 300.50000000000006, 312.0, 312.0, 4.154549231408392, 442.69805515164103, 3.4242573743248856], "isController": false}, {"data": ["/-8", 10, 0, 0.0, 445.90000000000003, 236, 613, 470.5, 607.1, 613.0, 613.0, 3.855050115651504, 782.4547031611411, 2.8649347050886664], "isController": false}, {"data": ["/generate_204-4", 10, 0, 0.0, 76.10000000000001, 53, 127, 65.0, 124.30000000000001, 127.0, 127.0, 5.1894135962636225, 0.6436089128178516, 1.7382508432797092], "isController": false}, {"data": ["/company/-5", 10, 0, 0.0, 241.9, 116, 996, 155.5, 918.9000000000003, 996.0, 996.0, 4.782400765184122, 388.5326996652319, 3.5541083811573406], "isController": false}, {"data": ["/bitrix/templates/aspro_max/js/setTheme.php-3", 10, 0, 0.0, 90.0, 73, 139, 84.0, 135.60000000000002, 139.0, 139.0, 5.117707267144319, 91.09918756397134, 3.0386386898669397], "isController": false}, {"data": ["/company/-6", 10, 0, 0.0, 160.6, 132, 207, 147.5, 206.6, 207.0, 207.0, 4.6685340802987865, 56.565855508870214, 5.553002450980393], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 220, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
