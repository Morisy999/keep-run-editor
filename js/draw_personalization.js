var drawingActions = [];
var same_suofang;
function inpt_drawbtn_onClick() {
    return new Promise((resolve, reject) => {
        try {
            const placement = mapPlacement(current_img_width, current_img_height, frameWidth, frameHeight);
            draw_suofang = current_img_width / placement.w;
            const surface = document.createElement('canvas');
            surface.id = 'drawpic_canvas';
            surface.width = current_img_width;
            surface.height = current_img_height;
            surface.style.width = placement.w + 'px';
            surface.style.height = placement.h + 'px';
            surface.style.position = 'absolute';
            surface.style.left = placement.x + 'px';
            surface.style.top = placement.y + 'px';
            const wrap = document.getElementById('drawpic_canvas_wrap');
            wrap.style.position = 'relative';
            wrap.replaceChildren(surface);
            same_suofang = draw_suofang;
            document.getElementById("drawpic_overlay").style.display = "flex";
            document.getElementById("body").style.overflow = "hidden";
            document.getElementById("body").style.height = "100%";

            start_draw();

            resolve("Success");  // 如果执行成功，调用 resolve() 方法
        } catch (error) {
            reject(error);  // 如果有错误发生，调用 reject() 方法
        }
    });
}

function inpt_colorchange_checkbox_onchange() {
    bs = document.getElementById("inpt_colorchange_checkbox").checked;

    if (bs) {
        document.getElementById("bs_prop_inpt_wrap").style.display = "list-item";
        document.getElementById("inpt_bs_range_wrap").style.display = "list-item";
    } else {
        document.getElementById("bs_prop_inpt_wrap").style.display = "none";
        document.getElementById("inpt_bs_range_wrap").style.display = "none";
    }
}

function start_draw() {

    drawingActions = [];
    // if (bs) {
    //     handlePointerDown = (e) => {
    //         ctx.beginPath();
    //         ctx.lineJoin = "round";
    //         ctx.lineCap = "round";
    //         ctx.lineWidth = String(Math.floor(5 * draw_suofang));
    //         bs_pres_color = new Array(38, 201, 154);

    //         ctx.moveTo(bs_pres_x, bs_pres_y);
    //         if (drawdown == false) {
    //             draw_start_x = e.offsetX * draw_suofang;
    //             draw_start_y = e.offsetY * draw_suofang;
    //             ctx.moveTo(draw_start_x, draw_start_y);
    //             ctx.strokeStyle = "rgb(38, 201, 154)".toString();
    //         }
    //         drawdown = true;
    //         ctx.lineTo(e.offsetX * draw_suofang, e.offsetY * draw_suofang);
    //         ctx.stroke();
    //         bs_pres_x = e.offsetX * draw_suofang;
    //         bs_pres_y = e.offsetY * draw_suofang;
    //         // 保存操作
    //         drawingActions.push({
    //             action: "down",
    //             x: e.offsetX,
    //             y: e.offsetY,
    //             // ... 你可能还需要存储其他相关的数据，例如颜色，线宽等 ...
    //         });
    //     }
    if (bs) {
        handlePointerDown = (e) => {
            ctx.beginPath();
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.lineWidth = String(Math.floor(5 * draw_suofang));
            bs_pres_color = new Array(38, 201, 154);
            if (drawdown == false) {
                draw_start_x = e.offsetX * draw_suofang;
                draw_start_y = e.offsetY * draw_suofang;
                ctx.strokeStyle = "rgb(38, 201, 154)".toString();
            }
            drawdown = true;
            bs_pres_x = e.offsetX * draw_suofang;
            bs_pres_y = e.offsetY * draw_suofang;
            ctx.moveTo(e.offsetX * draw_suofang, e.offsetY * draw_suofang);
            drawingActions.push({
                action: "down",
                x: e.offsetX,
                y: e.offsetY,
            });
        }
        handlePointerMove = (e) => {
            if (drawdown) {
                if (is_bs) {
                    if (bs_now >= bs_range) {
                        is_bs = false;
                        ctx.beginPath();
                        ctx.lineJoin = "round";
                        ctx.lineCap = "round";
                        ctx.lineWidth = String(Math.floor(5 * draw_suofang));
                        ctx.moveTo(bs_pres_x, bs_pres_y);
                        ctx.lineTo(e.offsetX * draw_suofang, e.offsetY * draw_suofang);
                        var gradient = ctx.createLinearGradient(bs_pres_x, bs_pres_y, e.offsetX * draw_suofang, e.offsetY * draw_suofang);
                        gradient.addColorStop(0, "rgb(" + String(bs_pres_color[0]) + "," + String(bs_pres_color[1]) + " ," + String(bs_pres_color[2]) + " )");
                        gradient.addColorStop(1, "rgb(38, 201, 154)");
                        ctx.strokeStyle = gradient;
                        ctx.stroke();
                        bs_pres_color = new Array(38, 201, 154);
                    }
                }
                if (Math.random() < bs_prob && is_bs == false) {
                    is_bs = true;
                    rg = 2 * Math.random() - 1;
                    if (rg > 0) {
                        bs_max = new Array(Math.floor(193 * Math.pow(Math.abs(rg), 0.5)), Math.floor(-110 * Math.pow(Math.abs(rg), 0.5)), Math.floor(-66 * Math.pow(Math.abs(rg), 0.5)));
                    } else {
                        bs_max = new Array(Math.floor(27 * Math.pow(Math.abs(rg), 0.5)), Math.floor(16 * Math.pow(Math.abs(rg), 0.5)), Math.floor(94 * Math.pow(Math.abs(rg), 0.5)));
                    }
                    bs_range = bs_range_min + Math.floor((bs_range_max - bs_range_min) * Math.random());
                    bs_now = 0;
                }
                if (is_bs) {
                    ctx.beginPath();
                    ctx.lineJoin = "round";
                    ctx.lineCap = "round";
                    ctx.lineWidth = String(Math.floor(5 * draw_suofang));
                    ctx.moveTo(bs_pres_x, bs_pres_y);
                    var bs_now_color = new Array(Math.floor(38 + (4 * bs_max[0] * bs_now / bs_range) * (1 - bs_now / bs_range)), Math.floor(201 + (4 * bs_max[1] * bs_now / bs_range) * (1 - bs_now / bs_range)), Math.floor(154 + (4 * bs_max[2] * bs_now / bs_range) * (1 - bs_now / bs_range)))
                    var gradient = ctx.createLinearGradient(bs_pres_x, bs_pres_y, e.offsetX * draw_suofang, e.offsetY * draw_suofang);
                    gradient.addColorStop(0, "rgb(" + String(bs_pres_color[0]) + "," + String(bs_pres_color[1]) + " ," + String(bs_pres_color[2]) + " )");
                    gradient.addColorStop(1, "rgb(" + String(bs_now_color[0]) + "," + String(bs_now_color[1]) + " ," + String(bs_now_color[2]) + " )");
                    ctx.strokeStyle = gradient;
                    ctx.lineTo(e.offsetX * draw_suofang, e.offsetY * draw_suofang);
                    ctx.stroke();
                    bs_pres_color = bs_now_color;
                    bs_now += 1
                } else {
                    ctx.lineTo(e.offsetX * draw_suofang, e.offsetY * draw_suofang);
                    ctx.strokeStyle = "rgb(38, 201, 154)".toString();
                    ctx.stroke();
                }
                bs_pres_x = e.offsetX * draw_suofang;
                bs_pres_y = e.offsetY * draw_suofang;
                drawingActions.push({
                    action: "move",
                    x: e.offsetX,
                    y: e.offsetY,
                });
            }
        }
        handlePointerUp = (e) => {
            draw_end_x = e.offsetX * draw_suofang;
            draw_end_y = e.offsetY * draw_suofang;
            for (const [x,y,color] of [[draw_start_x,draw_start_y,'#24bf89'],[draw_end_x,draw_end_y,'#fb6472']]) {
                ctx.beginPath();
                ctx.arc(x,y,6*draw_suofang,0,Math.PI*2);
                ctx.fillStyle = color;
                ctx.fill();
            }
            convasData = ctx.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            drawdown = false;
            restorePointer();
            drawingActions.push({
                action: "up",
                x: e.offsetX,
                y: e.offsetY,
            });
        }
    } else {
        handlePointerDown = (e) => {
            drawingActions = [];
            ctx.beginPath();
            if (drawdown == false) {
                draw_start_x = e.offsetX * draw_suofang;
                draw_start_y = e.offsetY * draw_suofang;
            }
            drawdown = true;
            ctx.moveTo(e.offsetX * draw_suofang, e.offsetY * draw_suofang);
            drawingActions.push({
                action: "down",
                x: e.offsetX,
                y: e.offsetY,
                //... 其他需要保存的参数 ...
            });
        }
        handlePointerMove = (e) => {
            if (drawdown) {
                ctx.lineTo(e.offsetX * draw_suofang, e.offsetY * draw_suofang);
                ctx.strokeStyle = "rgb(38, 201, 154)".toString();
                ctx.lineJoin = "round";
                ctx.lineCap = "round";
                ctx.lineWidth = String(parseInt(5 * draw_suofang));
                ctx.stroke();
                drawingActions.push({
                    action: "move",
                    x: e.offsetX,
                    y: e.offsetY,
                    //... 其他需要保存的参数 ...
                });
            }
        }
        handlePointerUp = (e) => {
            draw_end_x = e.offsetX * draw_suofang;
            draw_end_y = e.offsetY * draw_suofang;
            drawingActions.push({
                action: "up",
                x: e.offsetX,
                y: e.offsetY,
                //... 其他需要保存的参数 ...
            });
            for (const [x,y,color] of [[draw_start_x,draw_start_y,'#24bf89'],[draw_end_x,draw_end_y,'#fb6472']]) {
                ctx.beginPath();
                ctx.arc(x,y,6*draw_suofang,0,Math.PI*2);
                ctx.fillStyle = color;
                ctx.fill();
            }
            convasData = ctx.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            drawdown = false;
            restorePointer();
        }
    }
    canvas = document.getElementById('drawpic_canvas');
    ctx = canvas.getContext('2d');
    function enableDrawing() {
        drawdown = false;
        is_bs = false;
        convasData = null;
        canvas.addEventListener('pointerdown', handlePointerDown);
        canvas.addEventListener('pointermove', handlePointerMove);
        canvas.addEventListener('pointerup', handlePointerUp);
    }
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if (bgSRC) {
        const image = new Image();
        image.onload = () => {
            ctx.drawImage(image,0,0,canvas.width,canvas.height);
            enableDrawing();
        };
        image.src = bgSRC;
    } else {
        enableDrawing();
    }
}


var handlePointerDown, handlePointerMove, handlePointerUp;

function restorePointer() {
    canvas.removeEventListener('pointerdown', handlePointerDown);
    canvas.removeEventListener('pointermove', handlePointerMove);
    canvas.removeEventListener('pointerup', handlePointerUp);
}
//取消按钮
function drawpic_hidebtn_onClick() {
    restorePointer();
    document.getElementById("body").style.overflow = "";
    document.getElementById("body").style.height = "";
    
    document.getElementById("drawpic_overlay").style.display = "none";
}
//重置按钮
function drawpic_initbtn_onClick() {
    ctx.clearRect(0, 0, current_img_width, current_img_height);
    start_draw();
}

//确定按钮
function drawpic_yesbtn_onClick() {
    return new Promise((resolve, reject) => {
        try {

            document.getElementById("body").style.overflow = "";
            document.getElementById("body").style.height = "";
            
            setbgImg(canvas.toDataURL());
            document.getElementById("drawpic_overlay").style.display = "none";

            resolve("Success");  // 如果执行成功，调用 resolve() 方法
        } catch (error) {
            reject(error);  // 如果有错误发生，调用 reject() 方法
        }
    });
}
//获取当前使用的背景图片的尺寸
function getNaturalSize() {
    const img = document.getElementById("bg-img")
    current_img_width = img.naturalWidth;
    current_img_height = img.naturalHeight;
}
/*----- 以上为[绘制自定义轨迹]用到的方法 -----*/