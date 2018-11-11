// var printModule = function( ) {

//     var savePrint = function(callback)  {
//         my.namespace.print();
//         callback();    
//     }

//     var printDoc = function()  {
//         savePrint(function() {
//             my.namespace.printReport();
//         });
//     };
    
//     return {
//         // public functions
//         save: function(apiurl) {
//             savePrint(apiurl);
//         },
//         print: function() {
//             printDoc();
//         }
//     };

// }

// function save() {
//     printModule.save();
// }

    
// function printReport() {
//     // console.log('printreport');
//     let printContents, popupWin;
//     printContents = document.getElementById('print-section').innerHTML;

//     alert('555');
    
//     popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
//     // console.log("popupWin " + popupWin);
//     popupWin.document.open(); 
//     // <link rel="stylesheet" href="assets/demo/default/base/style.bundle.css" type="text/css" media="print" />
//     popupWin.document.write(`
//       <html>
//         <head>
//           <title>Non PO</title>
//           <style @media="print">
//             @page {
//                 margin: 2cm;
//             }

//             header nav, footer {
//                 display: none;
//                 }

//             body {
//                 font: 16pt Poppins, Georgia, "Times New Roman", Times, serif;
//                 line-height: 1;
//                 min-width: 992px ; }

//             .m--font-deleted {
//                 color: #f4516c !important ; 
//                 text-decoration: line-through; }

//             .table {
//                 font: 16pt Poppins, Georgia, "Times New Roman", Times, serif;
//                 border-collapse: collapse; 
//                 background-color: #000; }
//             .table td,
//             .table th {
//                 background-color: #fff ; }
            
//             .table-bordered {
//                 border-collapse: collapse; 
//                 border: 1px solid #000000; }
//             .table-bordered th,
//             .table-bordered td {
//                 //font: 16pt Poppins, Georgia, "Times New Roman", Times, serif;
//                 border: 1px solid #000000; }
//             .table-bordered thead th,
//             .table-bordered thead td {
//                 border-bottom-width: 2px; }

//             .table-underline {
//                 padding: 0px 0px 0px 5px;
//                 border-bottom: solid black;
//                 border-bottom-width: 1px; }

//             .table-display {
//                 width: 100%;
//                 max-width: 100%;
//                 border: 5px;
//                 text-align: left;
//                 background-color: transparent; }
//             .table-display-caption {
//                 //font: 16pt Poppins, Georgia, "Times New Roman", Times, serif;
//                 color: #888888;
//                 padding: 5px;
//                 text-align: left;
//                 vertical-align: middle; }

              
//           </style>
//         </head>
//         <body onload="window.print();window.close();">`+printContents+`</body>
//       </html>`
//     );
//     popupWin.document.close();
// }
