var chessBoard = [];
var me = true;
var over = false;
//赢法数组
var win = [];

//赢法统计数组,统计每种赢法的落子数目
var myWin = [];
var computerWin = [];


for(var i=0;i<15;i++)
{
    chessBoard[i]=[];
    for(var j=0;j<15;j++)
    {
        chessBoard[i][j]=0;
    }
}

for(var i=0;i<15;i++)
{
    win[i]=[];
    for(var j=0;j<15;j++)
    {
        win[i][j]=[];
    }
}

var count =0;
//竖线赢法统计
for(var i=0;i<15;i++)
{
    for(var j=0;j<11;j++)
    {
        for(var k=0;k<5;k++)
        {
            win[i][j+k][count]=true;
        }
        count++;
    }
}
//横线赢法
for(var i=0;i<15;i++)
{
    for(var j=0;j<11;j++)
    {
        for(var k=0;k<5;k++)
        {
            win[j+k][i][count]=true;
        }
        count++;
    }
}

//斜线赢法
for(var i=0;i<11;i++)
{
    for(var j=0;j<11;j++)
    {
        for(var k=0;k<5;k++)
        {
            win[j+k][i+k][count]=true;
        }
        count++;
    }
}

//反斜线赢法
for(var i=0;i<11;i++)
{
    for(var j=14;j>3;j--)
    {
        for(var k=0;k<5;k++)
        {
            win[i+k][j-k][count]=true;
        }
        count++;
    }
}

//五子棋共有赢法
console.log(count);

for(var i=0;i<count;i++)
{
    myWin[i]=0;
    computerWin[i]=0;
}



var chess =document.getElementById('chess');
var context = chess.getContext('2d');
context.strokeStyle="$BFBFBF";

var logo = new Image();
var drawChessBoard = function(){
    for(var i=0;i<15;i++)
    {
        context.moveTo(15+i*30,15);
        context.lineTo(15+i*30,435);
        context.stroke();
        context.moveTo(15,15+i*30);
        context.lineTo(435,15+i*30);
        context.stroke();
    }
}
logo.onload= function()
{

    context.drawImage(logo, 0, 0, 450, 450);
    drawChessBoard();
}
logo.src = "images/clock.jpg";
var onestep = function (i,j,me) {
    context.beginPath();
    context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
    context.closePath();
    var gradient = context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
    if (me) {
        gradient.addColorStop(0, "#0A0A0A");
        gradient.addColorStop(1, "#636766");
    }
    else {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
    }
    context.fillStyle=gradient;

    context.fill();
}

chess.onclick = function (e) {
    //游戏没有结束
    if(over)
    {
        return;
    }
    //不是我的回合
    if(!me)
    {
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x/30);
    var j = Math.floor(y/30);
    //判断是否在该点位下过旗
    if (chessBoard[i][j] == 0)
    {
    onestep(i,j,me);
    chessBoard[i][j]=1;
    //更新统计并计算是否胜利
    for(var k=0;k<count;k++)
    {
        //  console.log( win[i][j][k]);
        //这个地方如果数组是没有的就会被返回是undefine
        if(win[i][j][k]){
            myWin[k]++;
            //这个地方是6看有没有bug
            computerWin[k] = 6;
            if(myWin[k]==5)
            {
                window.alert("你赢了");
                over = true;
            }
        }
    }
    //未能结束就进行ai
    if(!over)
    {
        me=!me;
        computerAI();
    }
    }
}

var computerAI = function () {
    //初始化ai落子得分统计
    var myScore =[];
    var computerScore = [];
    var max = 0;
    var u=0,v=0;
    for(var i=0;i<15;i++)
    {
        myScore[i]=[];
        computerScore[i]=[];
        for(var j = 0;j<15;j++)
        {
            myScore[i][j]=0;
            computerScore[i][j]=0;
        }
    }
    //开始遍历棋盘对于落子加权得分
    for(var i=0;i<15;i++)
    {
        for(var j=0;j<15;j++)
        {
            if(chessBoard[i][j]==0){
            for(var k=0;k<count;k++)
            {
            
                    if(win[i][j][k])
                    {
                        if(myWin[k]==1){
                            myScore[i][j]+=200;
                        }
                         else if(myWin[k]==2){
                            myScore[i][j]+=400;
                        }   
                        else if(myWin[k]==3)
                        {
                            myScore[i][j]+=2000;
                        }
                        else if(myWin[k]==4)
                        {
                            myScore[i][j]+=10000;
                        }                    
                    
                    if(computerWin[k]==1)
                    {
                        //220
                        computerScore[i][j]+=220;
                    }else if(computerWin[k] == 2)
                    {
                        //420
                        computerScore[i][j]+=420;
                    }
                    else if(computerWin[i][j]==3)
                    {
                        //2100
                        computerScore[i][j]+=2100;
                    }
                    else if(computerWin[k]==4)
                    {
                        //20000
                        computerScore[i][j]+=20000;
                    }
                    }
            
            }
        if(myScore[i][j]>max){
            max = myScore[i][j];
            u=i;
            v=j;
        }
        else if(myScore[i][j] == max)
        {
            if(computerScore[i][j]>computerScore[u][v])
            {
                u = i;
                v = j;
            }
        }
        if(computerScore[i][j]>max){
            max = computerScore[i][j];
            u=i;
            v=j;
        }else if(computerScore[i][j]==max)
        {
            if(myScore[i][j]>myScore[u][v]){
                u=i;
                v=j;
            }
        }
        }

        // if(myScore[i][j]+computerScore[i][j]>max)
        // {
        //     max=myScore[i][j]+computerScore[i][j];
        //     u=i;
        //     j=v;
        // }
        } 
    }
    onestep(u,v,false);
    chessBoard[u][v]=2;
    for(var k=0;k<count;k++)
    {
        //  console.log( win[i][j][k]);
        //这个地方如果数组是没有的就会被返回是undefine
        if(win[u][v][k]){
            computerWin[k]++;
            //这个地方是6看有没有bug
            myWin[k] = 6;
            if(computerWin[k]==5)
            {
                window.alert("计算机赢了");
                over = true;
            }
        }
    }
    //未能结束就进行ai
    if(!over)
    {
        me=!me;
    }
}