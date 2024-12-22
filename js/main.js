// 获取DOM元素
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const previewContainer = document.getElementById('previewContainer');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

// 当前处理的图片文件
let currentFile = null;

// 绑定上传区域的点击事件
uploadArea.addEventListener('click', () => {
    imageInput.click();
});

// 处理拖放
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#0071e3';
    uploadArea.style.backgroundColor = 'rgba(0, 113, 227, 0.05)';
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#e5e5e5';
    uploadArea.style.backgroundColor = 'white';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#e5e5e5';
    uploadArea.style.backgroundColor = 'white';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
    }
});

// 处理文件选择
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

// 处理图片上传
function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件！');
        return;
    }
    
    currentFile = file;
    
    // 显示原始图片大小
    originalSize.textContent = formatFileSize(file.size);
    
    // 预览原始图片
    const reader = new FileReader();
    reader.onload = (e) => {
        originalPreview.src = e.target.result;
        // 压缩图片
        compressImage(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // 显示预览区域
    previewContainer.style.display = 'block';
    uploadArea.style.display = 'none';
}

// 压缩图片
function compressImage(imageData) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 计算新的尺寸，强制缩小大图片
        let width = img.width;
        let height = img.height;
        
        // 计算缩放比例
        let scale = 1;
        
        // 根据原图大小决定缩放比例
        const maxDimension = Math.max(width, height);
        if (maxDimension > 2000) {
            scale = 2000 / maxDimension;
        } else if (maxDimension > 1600) {
            scale = 0.8;
        } else if (maxDimension > 1200) {
            scale = 0.9;
        }
        
        // 应用缩放
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        
        // 设置 canvas 尺寸
        canvas.width = width;
        canvas.height = height;
        
        // 优化绘图质量
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // 获取压缩后的图片，根据图片类型使用不同的压缩参数
        let quality = qualitySlider.value / 100;
        // JPEG 格式可以使用更低的质量而不明显损失视觉效果
        if (currentFile.type === 'image/jpeg') {
            quality = Math.min(quality, 0.9); // JPEG 最高质量限制在 90%
        } else if (currentFile.type === 'image/png') {
            quality = Math.min(quality, 0.8); // PNG 最高质量限制在 80%
        }
        
        // 尝试不同的格式和质量参数来获得最佳压缩效果
        let compressedDataUrl;
        if (currentFile.type === 'image/png' && quality < 0.8) {
            // 对于 PNG，如果要求质量较低，转换为 JPEG 可能获得更好的压缩效果
            compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        } else {
            compressedDataUrl = canvas.toDataURL(currentFile.type, quality);
        }
        
        // 显示压缩后的图片
        compressedPreview.src = compressedDataUrl;
        
        // 转换为 Blob 并计算大小
        fetch(compressedDataUrl)
            .then(res => res.blob())
            .then(blob => {
                const compressedSize = blob.size;
                // 如果压缩后反而变大，尝试使用更激进的压缩参数
                if (compressedSize >= currentFile.size) {
                    // 降低质量重试
                    const newQuality = quality * 0.8;
                    const retryDataUrl = canvas.toDataURL('image/jpeg', newQuality);
                    return fetch(retryDataUrl).then(res => res.blob());
                }
                return blob;
            })
            .then(finalBlob => {
                document.getElementById('compressedSize').textContent = formatFileSize(finalBlob.size);
                // 保存最终的 blob 用于下载
                window._compressedBlob = finalBlob;
            });
    };
    img.src = imageData;
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 监听质量滑块变化
qualitySlider.addEventListener('input', (e) => {
    const value = e.target.value;
    qualityValue.textContent = value + '%';
    if (currentFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            compressImage(e.target.result);
        };
        reader.readAsDataURL(currentFile);
    }
});

// 下载压缩后的图片
downloadBtn.addEventListener('click', () => {
    if (window._compressedBlob) {
        const url = window.URL.createObjectURL(window._compressedBlob);
        const link = document.createElement('a');
        // 确保文件扩展名正确
        const extension = window._compressedBlob.type === 'image/jpeg' ? '.jpg' : '.png';
        const baseName = currentFile.name.replace(/\.[^/.]+$/, '');
        link.download = 'compressed_' + baseName + extension;
        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
    }
});

// 重置
resetBtn.addEventListener('click', () => {
    previewContainer.style.display = 'none';
    uploadArea.style.display = 'block';
    imageInput.value = '';
    currentFile = null;
    originalPreview.src = '';
    compressedPreview.src = '';
    originalSize.textContent = '0 KB';
    compressedSize.textContent = '0 KB';
    qualitySlider.value = 80;
    qualityValue.textContent = '80%';
}); 