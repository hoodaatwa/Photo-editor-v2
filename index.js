
function openNav() {
  document.getElementById("sidebar").style.width = "250px";
  // document.getElementById("main").style.marginLeft = "250px"; // إذا كان لديك عنصر رئيسي يحتاج إلى التحرك
}

function closeNav() {
  document.getElementById("sidebar").style.width = "0";
  // document.getElementById("main").style.marginLeft= "0"; // إذا كان لديك عنصر رئيسي يحتاج إلى العودة
}

function selectTool(toolName) {
  // هنا يمكنك إضافة كود للتعامل مع اختيار الأداة
  console.log("Selected tool: " + toolName);
}

document.querySelectorAll('.accordion-header').forEach(button => {
  button.addEventListener('click', () => {
    const accordionContent = button.nextElementSibling;

    if (accordionContent.style.display === 'block') {
      accordionContent.style.display = 'none';
    } else {
      document.querySelectorAll('.accordion-content').forEach(content => {
        content.style.display = 'none'; // اغلق جميع الأقسام الأخرى
      });
      accordionContent.style.display = 'block'; // فتح القسم الحالي فقط
    }
  });
});

var canvas = new fabric.Canvas('imageCanvas');
document.getElementById('imageLoader').addEventListener('change', function (e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function () {
            var image = new fabric.Image(imgObj);
            image.set({
                angle: 0,
                padding: 10,
                cornersize: 10,
                height: imgObj.height,
                width: imgObj.width,
            });
            canvas.clear();
            canvas.add(image);
            canvas.sendToBack(img);
            canvas.setActiveObject(image);
        }
    }
    reader.readAsDataURL(e.target.files[0]);
});


// Enable drawing
var drawingModeEl = document.createElement('button');
drawingModeEl.textContent = 'Toggle Drawing Mode';
drawingModeEl.onclick = function() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
        drawingModeEl.textContent = 'Cancel Drawing Mode';
    } else {
        drawingModeEl.textContent = 'Enable Drawing Mode';
    }
};
document.body.appendChild(drawingModeEl);


document.addEventListener('DOMContentLoaded', function() {
    // إضافة التحكمات إلى الصفحة
    const controls = document.createElement('div');
    controls.innerHTML = `
        
        
    `;
    document.body.appendChild(controls);

    // تطبيق التغييرات على الرسم
    document.getElementById('strokeColor').addEventListener('change', function(e) {
        canvas.freeDrawingBrush.color = e.target.value;
    });

    document.getElementById('lineWidth').addEventListener('input', function(e) {
        canvas.freeDrawingBrush.width = parseInt(e.target.value, 10);
    });

    
});


// تطبيق الأبيض والأسود
document.getElementById('grayscale').addEventListener('click', function() {
    var obj = canvas.getActiveObject();
    if (!obj) return alert('الرجاء اختيار صورة');
    obj.filters.push(new fabric.Image.filters.Grayscale());
    obj.applyFilters();
    canvas.renderAll();
});

// زيادة السطوع
document.getElementById('brightness').addEventListener('click', function() {
    var obj = canvas.getActiveObject();
    if (!obj) return alert('الرجاء اختيار صورة');
    var filter = new fabric.Image.filters.Brightness({
        brightness: 0.05 // قيمة زيادة السطوع، قد تحتاج لتعديلها
    });
    obj.filters.push(filter);
    obj.applyFilters();
    canvas.renderAll();
});

// زيادة التباين
document.getElementById('contrast').addEventListener('click', function() {
    var obj = canvas.getActiveObject();
    if (!obj) return alert('الرجاء اختيار صورة');
    var filter = new fabric.Image.filters.Contrast({
        contrast: 10 // قيمة زيادة التباين، قد تحتاج لتعديلها
    });
    obj.filters.push(filter);
    obj.applyFilters();
    canvas.renderAll();
});

let state = [];
let mods = 0;

function updateState() {
    // Save the current state
    state.push(JSON.stringify(canvas));
}

canvas.on('object:modified', function() {
    updateState();
    mods = 0;
});


// تحميل الخطوط من Google Fonts
const googleFontsApiKey = 'AIzaSyDtlPDPq48xcOYSGnS4bv3UKLWZk-YSSlg'; // استبدل بمفتاح API الخاص بك
fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${googleFontsApiKey}`)
    .then(response => response.json())
    .then(data => {
        const fontFamilySelect = document.getElementById('fontFamily');
        data.items.forEach(font => {
            const option = document.createElement('option');
            option.value = font.family;
            option.textContent = font.family;
            fontFamilySelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error loading Google Fonts:', error));

document.getElementById('addText').addEventListener('click', function() {
    var fontFamily = document.getElementById('fontFamily').value;
    var textColor = document.getElementById('textColor').value;
    var backgroundColor = document.getElementById('backgroundColor').value;

    // استخدام WebFont لتحميل الخط المختار
    WebFont.load({
        google: {
            families: [fontFamily]
        },
        active: function() {
            // إضافة نص بالخط المحمل
            var text = new fabric.IText('اكتب هنا...', {
                left: 100,
                top: 100,
                fontFamily: fontFamily,
                fill: textColor,
                backgroundColor: backgroundColor
            });
            canvas.add(text);
        }
    });
});



document.getElementById('undo').addEventListener('click', function() {
    if (mods < state.length) {
        canvas.clear().renderAll();
        canvas.loadFromJSON(state[state.length - 1 - mods - 1]);
        canvas.renderAll();
        mods += 1;
    }
});

document.getElementById('redo').addEventListener('click', function() {
    if (mods > 0) {
        canvas.clear().renderAll();
        canvas.loadFromJSON(state[state.length - 1 - mods + 1]);
        canvas.renderAll();
        mods -= 1;
    }
});

document.getElementById('saturation').addEventListener('click', function() {
    var obj = canvas.getActiveObject();
    if (!obj) return alert('الرجاء اختيار صورة');
    var filter = new fabric.Image.filters.Saturation({
        saturation: 0.3 // زيادة التشبع، قد تحتاج لتعديلها
    });
    obj.filters.push(filter);
    obj.applyFilters();
    canvas.renderAll();
});

updateState();


document.getElementById('resize').addEventListener('click', function() {
    var obj = canvas.getActiveObject();
    if (!obj) return alert('الرجاء اختيار صورة');
    // تغيير حجم إلى 50% من الحجم الأصلي كمثال
    obj.scaleX /= 2;
    obj.scaleY /= 2;
    obj.setCoords();
    canvas.renderAll();
    updateState();
});


document.getElementById('blur').addEventListener('click', function() {
    var obj = canvas.getActiveObject();
    if (!obj) return alert('الرجاء اختيار صورة');
    var filter = new fabric.Image.filters.Blur({
        blur: 0.5 // قيمة الضبابية، قد تحتاج لتعديلها
    });
    obj.filters.push(filter);
    obj.applyFilters();
    canvas.renderAll();
});


document.getElementById('exportImage').addEventListener('click', function() {
    var imageData = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "edited-image.png";
    link.href = imageData;
    link.click();
});


var cropper;
document.getElementById('imageLoader').addEventListener('change', function (e) {
    var files = e.target.files;
    var done = function (url) {
        document.getElementById('image').src = url;
        document.getElementById('image').style.display = 'block';
        if (cropper) {
            cropper.destroy();
        }
        cropper = new Cropper(document.getElementById('image'), {
            viewMode: 1,
            autoCropArea: 1,
            movable: false,
            rotatable: false,
            scalable: false,
            zoomable: true,
            autoCrop: true,
            autoCropArea: 1,
            resizable: false,
            crop: function(event) {
                // Handle the crop event here
            }
        });
    };
    var reader;
    var file;
    var url;

    if (files && files.length > 0) {
        file = files[0];
        if (URL) {
            done(URL.createObjectURL(file));
        } else if (FileReader) {
            reader = new FileReader();
            reader.onload = function (e) {
                done(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
});

document.getElementById('size800x600').addEventListener('click', function() {
    canvas.setWidth(800);
    canvas.setHeight(600);
    canvas.renderAll();
});

document.getElementById('size1024x768').addEventListener('click', function() {
    canvas.setWidth(1024);
    canvas.setHeight(768);
    canvas.renderAll();
});

document.getElementById('customSize').addEventListener('click', function() {
    var width = document.getElementById('customWidth').value;
    var height = document.getElementById('customHeight').value;
    if (width > 0 && height > 0) {
        canvas.setWidth(width);
        canvas.setHeight(height);
        canvas.renderAll();
    } else {
        alert('الرجاء إدخال قيم صحيحة للعرض والارتفاع.');
    }
});


document.getElementById('cropImage').addEventListener('click', function() {
    if (!cropper) {
        alert('الرجاء تحميل صورة أولاً.');
        return;
    }
    // الحصول على الصورة المقصوصة كـ Blob
    cropper.getCroppedCanvas().toBlob(function(blob) {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
            var base64data = reader.result;
            var imgObj = new Image();
            imgObj.src = base64data;
            imgObj.onload = function() {
                var image = new fabric.Image(imgObj);
                image.set({
                    angle: 0,
                    padding: 10,
                    cornersize: 10,
                    height: imgObj.height,
                    width: imgObj.width,
                });
                canvas.clear();
                canvas.add(image);
                canvas.setActiveObject(image);
            }
        };
    });
});



canvas.on('mouse:down', function(options) {
    if (!options.target) {
        canvas.discardActiveObject().requestRenderAll();
    }
});


// زيادة حجم زوايا التحكم للتحديد والتدوير
fabric.Object.prototype.cornerSize = 20; // حجم زوايا التحكم
fabric.Object.prototype.rotatingPointOffset = 40; // مسافة نقطة التدوير من العنصر
fabric.Object.prototype.padding = 5; // إضافة هامش حول العناصر لتسهيل التحديد

// جعل خط التحديد أكثر وضوحًا
fabric.Object.prototype.borderOpacityWhenMoving = 1;
fabric.Object.prototype.borderColor = 'blue'; // لون الحدود
fabric.Object.prototype.cornerColor = 'blue'; // لون زوايا التحكم
fabric.Object.prototype.cornerStrokeColor = 'blue'; // لون حدود زوايا التحكم

// تغيير مؤشر الفأرة لتحسين التوجيه
fabric.Object.prototype.hoverCursor = 'pointer'; // مؤشر الفأرة عند التحويم

// تعديلات أخرى قد تكون مفيدة
fabric.Object.prototype.transparentCorners = false; // جعل زوايا التحكم غير شفافة
fabric.Object.prototype.hasBorders = true; // إظهار الحدود حول العناصر
fabric.Object.prototype.hasControls = true; // إظهار عناصر التحكم للتحديد والتدوير والتغيير في الحجم



fabric.Object.prototype.borderOpacityWhenMoving = 0.4;
fabric.Object.prototype.borderScaleFactor = .8; // تكبير حجم الحدود قليلاً للتأكيد عليها
 
WebFont.load({
    google: {
      families: ['Font Awesome 5 Free:900']
    },
    active: function() {
      // الخط جاهز للاستخدام، يمكنك الآن إنشاء canvas أو رسم الأيقونات
    }
  });


function renderIcon(ctx, icon, left, top, size) {
  ctx.font = `900 24px 'Font Awesome 5 Free'`;
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, left, top);
}

fabric.Object.prototype.controls.deleteControl = new fabric.Control({
  x: 0.5,
  y: -0.5,
  offsetY: -10,offsetX: 24,
  cursorStyle: 'pointer',
  mouseUpHandler: function(eventData, transform) {
    var target = transform.target;
    var canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
  },
  render: function(ctx, left, top, styleOverride, fabricObject) {
    renderIcon(ctx, '\uf1f8', left, top, '20px'); // \uf1f8 is FontAwesome's trash icon
  },
  cornerSize: 24
});

fabric.Object.prototype.controls.clone = new fabric.Control({
  x: 0.5,
  y: -0.5,
  offsetY: 20,offsetX: 24,
  cursorStyle: 'pointer',
  mouseUpHandler: function(eventData, transform) {
    var target = transform.target;
    target.clone(function(cloned) {
      cloned.set({left: target.left + 10, top: target.top + 10});
      target.canvas.add(cloned);
    });
  },
  render: function(ctx, left, top, styleOverride, fabricObject) {
    renderIcon(ctx, '\uf0c5', left, top, '20px'); // \uf0c5 is FontAwesome's copy icon
  },
  cornerSize: 24
});

fabric.Object.prototype.controls.deselectControl = new fabric.Control({
  x: -0.5,
  y: -0.5,
  offsetY: -10,
  offsetX: -24, // يمكنك تعديل هذه القيم لتغيير موقع الزر
  cursorStyle: 'pointer',
  mouseUpHandler: function(eventData, transform) {
    var canvas = transform.target.canvas;
    canvas.discardActiveObject(); // هذا يلغي تحديد الكائن
    canvas.requestRenderAll(); // يعيد رسم الـ canvas لتحديث العرض
  },
  render: function(ctx, left, top, styleOverride, fabricObject) {
    renderIcon(ctx, '\uf410', left, top, '20px'); // \uf00d هو أيقونة FontAwesome لـ "إغلاق"
  },
  cornerSize: 24
});

fabric.Object.prototype.controls.flipHorizontal = new fabric.Control({
  x: 0.5,
  y: -0.5,
  offsetY: 50, // يمكن تعديل هذه القيمة لتغيير موقع الزر
  offsetX: 24,
  cursorStyle: 'pointer',
  mouseUpHandler: function(eventData, transform) {
    var target = transform.target;
    target.set('flipX', !target.flipX); // قلب العنصر أفقياً
    target.canvas.requestRenderAll(); // يعيد رسم الـ canvas
  },
  render: function(ctx, left, top, styleOverride, fabricObject) {
    renderIcon(ctx, '\uf074', left, top, '20px'); // استخدم أيقونة FontAwesome للقلب الأفقي
  },
  cornerSize: 24
});

        
document.getElementById('applyFilters').addEventListener('click', function() {
    var distanceValue = parseFloat(document.getElementById('distance').value);
    var colorValue = document.getElementById('color').value;

    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
        

        // إضافة فلتر RemoveColor الجديد
        activeObject.filters.push(
            new fabric.Image.filters.RemoveColor({
                distance: distanceValue,
                color: colorValue
            })
        );

        // تطبيق الفلاتر وإعادة رسم الصورة
        activeObject.applyFilters();
        canvas.renderAll();
    }
});

document.getElementById('applyVintage').addEventListener('click', function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
        

        // إضافة فلتر Vintage
        activeObject.filters.push(new fabric.Image.filters.Vintage());

        // تطبيق الفلاتر وإعادة رسم الصورة
        activeObject.applyFilters();
        canvas.renderAll();
    }
});


document.getElementById('applyEmboss').addEventListener('click', function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
        

        // إضافة فلتر Emboss
        activeObject.filters.push(new fabric.Image.filters.Convolute({
            matrix: [ 1,  1,  1,
                      1, 0.7, -1,
                     -1, -1, -1 ]
        }));

        // تطبيق الفلاتر وإعادة رسم الصورة
        activeObject.applyFilters();
        canvas.renderAll();
    }
});

document.getElementById('applySharpen').addEventListener('click', function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
        

        // إضافة فلتر Sharpen
        activeObject.filters.push(new fabric.Image.filters.Convolute({
            matrix: [  0, -1,  0, 
                      -1,  5, -1, 
                       0, -1,  0 ]
        }));

        // تطبيق الفلاتر وإعادة رسم الصورة
        activeObject.applyFilters();
        canvas.renderAll();
    }
});

document.getElementById('applyNoise').addEventListener('click', function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'image') {
        

        // إضافة فلتر Noise
        var noiseFilter = new fabric.Image.filters.Noise({
            noise: 100 // قيمة الضوضاء, يمكن تعديلها لزيادة أو تقليل تأثير الضوضاء
        });

        activeObject.filters.push(noiseFilter);

        // تطبيق الفلاتر وإعادة رسم الصورة
        activeObject.applyFilters();
        canvas.renderAll();
    }
});
document.getElementById('updateTextProperties').addEventListener('click', function() {
    var fontFamily = document.getElementById('fontFamily').value;
    var textColor = document.getElementById('textColor').value;
    var backgroundColor = document.getElementById('backgroundColor').value;
    var activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.type === 'i-text') {
        // تحديث خصائص النص
        WebFont.load({
            google: {
                families: [fontFamily]
            },
            active: function() {
                activeObject.set({
                    fontFamily: fontFamily,
                    fill: textColor,
                    backgroundColor: backgroundColor
                });
                canvas.requestRenderAll();
            }
        });
    }
});

document.getElementById('toggleBackground').addEventListener('change', function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject && (activeObject.type === 'i-text' || activeObject.type === 'text')) {
        // تحقق من حالة زر التحقق
        if (this.checked) {
            // إذا تم التحقق منه، إظهار الخلفية بلون افتراضي أو آخر معروف
            activeObject.set('backgroundColor', activeObject.__originalBackgroundColor || '');
        } else {
            // إذا لم يتم التحقق منه، إخفاء الخلفية بإزالة اللون
            // حفظ اللون الأصلي لاستخدامه عند إعادة تحديد الخيار
            activeObject.__originalBackgroundColor = activeObject.get('backgroundColor');
            activeObject.set('backgroundColor', '');
        }
        canvas.requestRenderAll();
    }
});

document.getElementById('addLayerBtn').addEventListener('click', function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'; // تأكد من قبول الصور فقط
    input.onchange = function(e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(event) {
                var imgElement = document.getElementById('imageToCrop');
                imgElement.src = event.target.result;
                imgElement.style.display = 'block'; // عرض الصورة للقص
                var cropper = new Cropper(imgElement, {
                    viewMode: 1,
            autoCropArea: 1,
            movable: false,
            rotatable: false,
            scalable: false,
            zoomable: true,
            autoCrop: true,
            autoCropArea: 1,
            resizable: false, // يمكنك تغييره حسب الحاجة
                });

                // إظهار زر تأكيد القص
                document.getElementById('confirmCrop').style.display = 'block';
                document.getElementById('confirmCrop').onclick = function() {
                    // الحصول على الصورة المقصوصة كـ URL
                    cropper.getCroppedCanvas().toBlob(function(blob) {
                        var newImgUrl = URL.createObjectURL(blob);

                        // إضافة الصورة المقصوصة إلى القماش
                        fabric.Image.fromURL(newImgUrl, function(myImg) {
                            // i.e., إضافة الصورة إلى قماش Fabric.js هنا
                            canvas.add(myImg);
                        });
                    });

                    // إخفاء عناصر القص بعد الإضافة
                    
                    imgElement.style.display = 'none';
                    document.getElementById('confirmCrop').style.display = 'none';
                    cropper.destroy();
                };
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
});

function toggleNavButtons() {
  // حدد حالة عرض الأزرار بناءً على حجم الـ canvas
  const showButtons = canvas.getWidth() > window.innerWidth || canvas.getHeight() > window.innerHeight;

  // حصل على جميع أزرار التنقل
  const buttons = document.querySelectorAll('.canvas-nav-btn');
  buttons.forEach(button => {
    button.style.display = showButtons ? 'block' : 'none';
  });
}

// تحديث الحالة عند تحميل الصفحة أو تغيير حجم النافذة
window.onload = toggleNavButtons;
window.onresize = toggleNavButtons;

// مثال بسيط على كيفية تحريك الـ canvas
document.getElementById('moveUp').onclick = function() { scrollCanvas(0, -60); };
document.getElementById('moveDown').onclick = function() { scrollCanvas(0, 60); };
document.getElementById('moveLeft').onclick = function() { scrollCanvas(-60, 0); };
document.getElementById('moveRight').onclick = function() { scrollCanvas(60, 0); };

function scrollCanvas(deltaX, deltaY) {
  window.scrollBy(deltaX, deltaY);
}

