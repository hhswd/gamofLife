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
    // 监听stop按钮，若其按下，则停止循环
    // 更新棋盘
    controller.reNew();
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
          td.setAttribute("class", "dead");
          td.setAttribute("onclick", "controller.changeCellOnClick(id)");

          // 父元素中加入tr
          tr.appendChild(td);
        }

        table.appendChild(tr);
      }

      grid.appendChild(table);

      },

    // 更新棋盘(通过改变td的属性，不改变html表格结构)
    reNew: function(){
        // 测试：
        // 测试3子繁衍：
        status[0][0] = 1;
        this.changeCellClass(0,0);
        status[0][1] = 1;
        this.changeCellClass(0,1);
        status[0][2] = 1;
        this.changeCellClass(0,2);
        // 结果预测：[0][0]熄灭，[0][1]维持点亮，[0][2]熄灭，[1][1]点亮
        // 演变多次
        for(var k=0;k<30;k++){
        for(var i=0;i<row;i++){
          for(var j=0;j<col;j++){
            // 根据生存规则改变status的值(dead=0，live=1)
            var isStatusChanged = this.createNewStatus(i,j);
            // 绘制新的棋盘(通过改变td的属性)
            if(isStatusChanged){
              this.changeCellClass(i,j);
            }
          }
        }
        console.log(this.getstatus());
        console.log(this.getNewStatus());
        // 更新旧状态数组
        this.coverOldStatus();
      }
    },

    /**
     * 判断格子的新状态，给newStatus数组赋值，
     * 若状态改变，返回true, 否则，false.
     * @param  {int} i 数组行坐标
     * @param  {int} j 数组列坐标
     * @return {[type]}     [description]
     */
    createNewStatus: function(i, j){

      // 是否修改了格子状态(即在新状态数组中更改数值)
      var isStatusChanged = false;
      // 生存逻辑
      var sum = this.calStatus(i-1, j-1)+this.calStatus(i-1,j)+this.calStatus(i-1,j+1)+
                this.calStatus(i,j-1)+this.calStatus(i,j+1)+
                this.calStatus(i+1,j-1)+this.calStatus(i+1,j)+this.calStatus(i+1,j+1);
      // 判断新状态数组取值:
      switch (sum) {
        case 2:
          // 维持现状
          newStatus[i][j] = status[i][j];
          break;
        case 3:
          // 新状态下生存
          newStatus[i][j] = 1;
          if(status[i][j]===0){
            isStatusChanged = true;
          }
        break;
        default:
          // 取值为0，1，>3, 则新状态下死亡
          newStatus[i][j] = 0;
          if(status[i][j] ===1){
            isStatusChanged = true;
          }
          break;
      }
      // 测试：让第12行,第12列全亮
      /*
      if(i == 11 || j == 11){
       newStatus[i][j] = 1;
       isStatusChanged = true;
       return isStatusChanged;
      }
      */
      return isStatusChanged;
    },

    // 计算现状态数组在对应坐标下的取值，若超出边界，则返回0
    calStatus: function(i, j){
      if(i>=0 && i<row && j>=0 && j<col){
        return status[i][j];
      }
      return 0;
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









