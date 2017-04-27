window.onload = init;

function init(){
  // 初始化棋盘
  controller.init();
  // 绑定start按钮
  var startButton = document.getElementById("start");
  startButton.setAttribute("onclick", "start()");
}




// 点击格子，改变格子状态后，点击start按钮：
// 格子： td-> onclick="controller.changeGridStatus(id)";
// start: onclick="start()";
// stop: onclick="stop()" ???????
var controller = control();

// 开始演化
function start(){
  //while(controller.proceed){
    // 监听stop按钮，若其按下，则停止循环
    // 更新棋盘
    controller.reNew();
  //}
}

// 让演化停止
function stop(){
}

// 返回控制棋盘状态的对象
function control(){
  // 棋盘的行数和列数
  var row = 25;
  var col = 25;
  // 保存格子状态的数组
  var status = new Array(row);
  var newStatus = new Array(row);
  return {
    // 是否继续进行演化的标记
    proceed: true,
    // 获取所有格子的状态：
    getstatus: function(){
      return status;
    },

    getNewStatus: function(){
      return newStatus;
    },

    // 初始化status数组创建棋盘
    init: function(){
      for(var i=0;i<row;i++){
        status[i] = new Array(col);
        newStatus[i] = new Array(col);
        for(var j=0;j<col;j++){
          status[i][j] = 0;
          newStatus[i][j] = 0;
        }
      }
      // 绘制棋盘
      this.createGrid();
    },

    // 创建棋盘, 格子id为i+"_"+j
    createGrid: function(){
      // 获取棋盘节点
      var grid = document.getElementById("gridContainer");
      // 删除原棋盘

      var table = document.createElement("table");
      // 添加<tr>
      for(var i=0;i<row;i++){
        var tr = document.createElement("tr");
        tr.setAttribute("class", i);
        // 添加<td>
        for(var j=0;j<col;j++){
          var td = document.createElement("td");
          // td的属性
          td.setAttribute("id", i+"_"+j);
          if(status[i][j] === 0){
            td.setAttribute("class", "dead");
          } else{
            td.setAttribute("class", "live");
          }
          td.setAttribute("onclick", "controller.changeCellOnClick(id)");

          // 父元素中加入tr
          tr.appendChild(td);
        }

        table.appendChild(tr);
      }

      grid.appendChild(table);

      },

    // 更新棋盘(通过改变td的属性，不改变表格结构)
    reNew: function(){
        // 根据生存规则改变status的值(dead=0，live=1)
        // 绘制新的棋盘(通过改变td的属性)
        // 测试：
        for(var i=0;i<row;i++){
          for(var j=0;j<col;j++){
            var isStatusChanged = this.createNewStatus(i,j);
            if(isStatusChanged){
              this.changeCellClass(i,j);
            }
          }
        }
        console.log(this.getstatus());
        console.log(this.getNewStatus());
        // 更新旧状态数组
        this.coverOldStatus();
    },

    /**
     * 判断格子的新状态，给newStatus数组赋值，
     * 若状态改变，返回true, 否则，false.
     * @param  {[type]} row [description]
     * @param  {[type]} col [description]
     * @return {[type]}     [description]
     */
    createNewStatus: function(row, col){
      // 生存逻辑
      // 测试：让第11行,第11列全亮
      var isStatusChanged = false;
      if(row == 11 || col == 11){
       newStatus[row][col] = 1;
       isStatusChanged = true;
       return isStatusChanged;
      }
    },

    // 更新旧状态数组
    coverOldStatus: function(){
     for (var i=0;i<row;i++) {
        for(var j=0;j<col;j++){
          status[i][j] = newStatus[i][j];
        }
      }
    },

    // 根据id，改变td的class属性
    changeCellClass: function(i,j){
      var cellid = i+"_"+j;
      // 找到dom中对应的格子
      var cell = document.getElementById(cellid);
      // 改变格子状态(与旧状态相反)
      if(cell.getAttribute("class") == "dead"){
        cell.setAttribute("class", "live");
      } else{
        cell.setAttribute("class", "dead");
      }
    },

    // 点击格子后,改变其状态:
    changeCellOnClick: function(id){
      // 绘制格子的新状态
      var cell = document.getElementById(id);
      if(cell.getAttribute("class") == "dead"){
        cell.setAttribute("class", "live");
        // 更改ids数值(id值转换为数组索引)

        } else {
        cell.setAttribute("class", "dead");
        // 更改ids数值

      }
    }

    //
  };

}

// 遍历每个单元格：
// 单元格i_j, 若其为dead,则判断其相邻格子是否有3个live
// 单元格i_j, 若其为live, 则判断其









