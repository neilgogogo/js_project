


//获取对比色
function getContrastColor(hexColor) {
    let c = color(hexColor); // 创建颜色
    let r = red(c); // 获取红色分量
    let g = green(c); // 获取绿色分量
    let b = blue(c); // 获取蓝色分量
    let contrastR = 255 - r;
    let contrastG = 255 - g;
    let contrastB = 255 - b;
    return color(contrastR, contrastG, contrastB);
}
//绘制波浪形状的圆
function drawWaveCircle(i, j, k, radius) {
    push();
    rotate(rotateSpeedPressed * frameCount / (50.0 / (j + 50))); // 根据圆的索引改变旋转速度
    // 绘制波浪形状的圆
    beginShape();
    noFill();
    stroke(getContrastColor(concentricCircleColors[i][j][k])); // 设置描边颜色
    strokeWeight(1); // 设置描边宽度
    for (let angle = 0; angle < 360; angle += 0.5) {
        let r = radius * 0.85 + 12 * sin(80 * angle); // 使用度来计算sin函数
        let x = r * cos(angle);
        let y = r * sin(angle);
        vertex(x, y);
    }
    endShape(CLOSE);
    beginShape();
    // strokeWeight(1); // 设置描边宽度
    for (let angle = 0; angle < 360; angle += 0.5) {
        let r = 38 + 8 * sin(60 * angle); // 使用度来计算sin函数
        let x = r * cos(angle);
        let y = r * sin(angle);
        vertex(x, y);
    }
    endShape(CLOSE);
    pop();
}

//绘制虚线环
function drawDottedCircle(i, j, k, radius) {
    for (let n = 0; n < dottedCircles && k < concentricCircles - 1; n++) {
        push();
        rotate(rotateSpeedPressed * frameCount / (50.0 / (k + 50))); // 根据圆的索引改变旋转速度
        stroke(getContrastColor(concentricCircleColors[i][j][k])); // 设置描边颜色
        strokeWeight(8 - k); // 设置描边宽度
        noFill(); // 不填充
        // 设置虚线样式，根据圆的索引改变虚线的间隔
        drawingContext.setLineDash([5, 10 + k]);
        ellipse(0, 0, radius * 2 - 10 - 20 * n); // 绘制同心圆，根据圆的索引改变半径
        pop();
        drawingContext.setLineDash([]); // 重置虚线样式
    }
}

//绘制小椭圆和连线
function drawSmallEllipses() {
    let smallEllipses = [];
    for (let k = 0; k < smallEllipseCount; k++) {
        let angle = map(k, 0, smallEllipseCount, 0, 360);
        let x = (sideLength / 2 + smallEllipseDistance) * cos(angle + smallEllipseDistance);
        let y = (sideLength / 2 + smallEllipseDistance) * sin(angle + smallEllipseDistance * 1.5);
        smallEllipses.push({ x, y });
    }
    // 绘制小椭圆之间曲线
    stroke('#E8670D');
    strokeWeight(3);
    noFill();
    beginShape();
    drawingContext.setLineDash([3, 4]);
    for (let l = 0; l < smallEllipseCount; l++) {
        curveVertex(smallEllipses[l].x, smallEllipses[l].y);
    }
    endShape(CLOSE);
    // 绘制小椭圆
    for (let l = 0; l < smallEllipseCount; l++) {
        let ellipseRadius = smallEllipseDiameter / 2; // 小椭圆的半径
        // 绘制渐变小椭圆
        for (let i = 0; i <= ellipseRadius; i++) {
            let t = map(i, 0, ellipseRadius, 0, 1); // 将半径映射到0和1之间
            let gradientColor = lerpColor(color(255), color(0), t); // 获取插值颜色
            fill(gradientColor); // 设置填充颜色为插值颜色
            noStroke(); // 不描边
            ellipse(smallEllipses[l].x, smallEllipses[l].y, smallEllipseDiameter - i, smallEllipseDiameter - i); // 绘制一个小椭圆
        }
    }
}

//绘制连接两个大圆圆心的渐变半弧线
function drawGradientArc2() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            push();
            translate((j + 0.5 * (i % 2)) * (sideLength + gap * 4), i * (sideLength + gap) + sideLength / 2); // 将原点移动到每个大圆的中心
            if (!(i % 2 == 0 && j % 2 != 0) && !(i % 2 != 0 && j % 2 == 0)) {
                let arcStartAngle = 180; // 弧线的开始角度
                let arcEndAngle = 360; // 弧线的结束角度
                for (let i = arcStartAngle; i <= arcEndAngle; i++) {
                    let t = map(i, arcStartAngle, arcEndAngle, 0, 1); // 将角度映射到0和1之间
                    let gradientColor = lerpColor(color(0, 255, 0), color(255, 0, 0), t); // 获取插值颜色
                    stroke(gradientColor); // 设置描边颜色为插值颜色
                    strokeWeight(5); // 设置描边宽度
                    noFill(); // 不填充
                    arc(sideLength - gap * 8, 0, sideLength + gap * 4, sideLength * 1, i, i + 1); // 绘制一个小段的弧线
                }
            }
            pop();
        }
    }
}

//绘制大圆
function drawConcentricCircles() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            push();
            translate((j + 0.5 * (i % 2)) * (sideLength + gap * 4), i * (sideLength + gap) + sideLength / 2); // 将原点移动到每个大圆的中心
            rotate(frameCount * rotationSpeed * rotateSpeedPressed); // 使每个大圆自旋
            // 绘制同心圆
            for (let k = 0; k < concentricCircles; k++) {
                let radius = sideLength / 2 - k * (sideLength / (1.6 * concentricCircles));
                fill(concentricCircleColors[i][j][k]); // 设置填充颜色为随机色
                noStroke(); // 不描边
                ellipse(0, 0, radius * 2, radius * 2); // 绘制同心圆
                if (i % 2 == 0 && j % 2 != 0) {
                    drawWaveCircle(i, j, k, radius);
                } else {
                    drawDottedCircle(i, j, k, radius);
                }
            }
            drawSmallEllipses();
            // 放开此处后，半弧线会随着旋转而旋转，不会连接两个大圆的圆心
            // drawGradientArc(i, j);
            pop();
        }
    }
    drawGradientArc2();
}

function setup() {
    // createCanvas(800, 800);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    angleMode(DEGREES); // 将角度模式更改为度数
    genRandomColors(); // 生成随机色值
    // 新增start
    bgColor = color(255,0,0);
    setInterval(changeColor, 2000);
    timer = setTimeout(() => {
        genRandomColors(); // 每5秒随机生成颜色
        timer = setTimeout(arguments.callee, 5000);
      }, 5000);
    // 结束start
}

function draw() {
    background(bgColor);
    // draw the text background
    drawConcentricCircles();
    // set the color of the rect
    fill(255,255,255);
    // fill the rect
    rect(0,0,400,80);
    // set the text color
    fill(0);
    textSize(20);
    textAlign(LEFT,TOP);
    text("des des des des des des des des des", 10,10)
    text("des des des des des des des des des", 10,40)    
}

function changeColor(){
    let r = random(255);
    let g = random(255);
    let b = random(255);
    bgColor = color(r,g,b);
}

function mousePressed() {
    clearTimeout(timer);
    genRandomColors(); // 点击鼠标时立即随机生成颜色
    timer = setTimeout(() => {
      genRandomColors(); // 每5秒随机生成颜色
      timer = setTimeout(arguments.callee, 5000);
    }, 5000);
}

// key pressed: p5js.org/reference/#/p5/keyPressed
//  if keyboard pressed
function keyPressed(){
    if(keyCode == LEFT_ARROW){// if press left arrow
        // console.log("LEFT_ARROW");
        rotateSpeedPressed = -400;
        // console.log(rotateSpeedPressed);
    }else if(keyCode==RIGHT_ARROW){// if press right arrow
        // console.log("RIGHT_ARROW");
        rotateSpeedPressed = 400;
        // console.log(rotateSpeedPressed);
    }else if(keyCode==DOWN_ARROW){// if press down arrow
        // console.log("DOWN_ARROW");
        rotateSpeedPressed = 1;
        // console.log(rotateSpeedPressed);
    }else if(keyCode==UP_ARROW){// if press up arrow
        // console.log("UP_ARROW");
        rotateSpeedPressed = 0;
        // console.log(rotateSpeedPressed);
    }
}

// window resize
// https://p5js.org/reference/#/p5/windowResized
// resize the window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }