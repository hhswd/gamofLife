window.onload = init;

function init(){
  createGrid(24,24);
}

function createGrid(row, col){
  // 获取Dom的表格节点
  var grid = document.getElementById("gridContainer");
  // 创造新的html元素
  var table = document.createElement("table");
  // 添加子元素
  for(var i=0;i<row;i++){
    var tr = document.createElement("tr");
    tr.setAttribute("class", i);

    for(var j=0;j<col;j++){
      var td = document.createElement("td");
      td.setAttribute("id", i+"_"+j);
      tr.appendChild(td);
    }

    table.appendChild(tr);
  }

  grid.appendChild(table);
}
