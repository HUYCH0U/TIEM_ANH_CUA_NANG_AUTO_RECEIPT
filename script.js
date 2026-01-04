window.onload = updateUI;

function updateUI() {
    const pkg = document.getElementById('package');
    const groupContainer = document.getElementById('group-qty-container');
    groupContainer.style.display = pkg.value === "360000" ? "block" : "none";
    generateMakeupInputs();
}

function generateMakeupInputs() {
    const pkg = document.getElementById('package');
    const container = document.getElementById('makeup-list-container');
    const selectedOption = pkg.options[pkg.selectedIndex];
    let count = selectedOption.getAttribute('data-count');

    if (count === "group") {
        count = parseInt(document.getElementById('group-qty').value) || 3;
    } else {
        count = parseInt(count);
    }

    container.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        container.innerHTML += `
            <label>Makeup Khách ${i}:</label>
            <select class="makeup-item" onchange="toggleMakeupTimeField()">
                <option value="0" data-name="Không">Không Makeup</option>
                <option value="250000" data-name="Cơ bản">Makeup cơ bản (250k)</option>
                <option value="300000" data-name="Chuyên nghiệp">Makeup chuyên nghiệp (300k)</option>
            </select>
        `;
    }
    toggleMakeupTimeField();
}

function toggleMakeupTimeField() {
    const makeupSelects = document.querySelectorAll('.makeup-item');
    const makeupTimeInputGroup = document.getElementById('makeup-time-input-group');
    let hasMakeup = false;
    makeupSelects.forEach(select => {
        if (parseInt(select.value) > 0) hasMakeup = true;
    });
    makeupTimeInputGroup.style.display = hasMakeup ? 'block' : 'none';
    if (!hasMakeup) document.getElementById('makeup-time').value = "";
}

function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + " <span style='text-decoration: underline;'>đ</span>";
}

function generateInvoice() {
    const pkg = document.getElementById('package');
    const travel = document.getElementById('travel');
    const location = document.getElementById('location').value || "Chưa xác định";
    const date = document.getElementById('date').value;
    const mTime = document.getElementById('makeup-time').value;
    const sTime = document.getElementById('shoot-time').value;
    const deposit = document.getElementById('deposit').value || 0;
    const groupQty = parseInt(document.getElementById('group-qty').value) || 3;

    let pkgPrice = parseInt(pkg.value);
    let pkgName = pkg.options[pkg.selectedIndex].getAttribute('data-name');
    if (pkg.value === "360000") {
        pkgPrice = pkgPrice * groupQty;
        pkgName = `Nhóm (${groupQty} người)`;
    }

    let totalMakeupPrice = 0;
    let makeupDetails = [];
    document.querySelectorAll('.makeup-item').forEach((select, index) => {
        totalMakeupPrice += parseInt(select.value);
        let mName = select.options[select.selectedIndex].getAttribute('data-name');
        if (mName !== "Không") makeupDetails.push(`K${index + 1}: ${mName}`);
    });

    document.getElementById('res-package').innerText = pkgName;
    document.getElementById('res-makeup').innerText = makeupDetails.length > 0 ? makeupDetails.join(' | ') : "Không";
    document.getElementById('res-travel').innerText = travel.options[travel.selectedIndex].getAttribute('data-name');
    document.getElementById('res-location').innerText = location;
    document.getElementById('res-package-price').innerHTML = formatCurrency(pkgPrice);
    document.getElementById('res-makeup-price').innerHTML = formatCurrency(totalMakeupPrice);
    document.getElementById('res-travel-price').innerHTML = formatCurrency(parseInt(travel.value));
    document.getElementById('res-date').innerText = date ? date.split('-').reverse().join('/') : "Chưa chọn";
    document.getElementById('res-shoot-time').innerText = sTime || "Chưa chọn";
    document.getElementById('res-deposit').innerHTML = formatCurrency(parseInt(deposit));
    
    const mRow = document.getElementById('res-makeup-time-row');
    if (mTime) {
        mRow.style.display = 'flex';
        document.getElementById('res-makeup-time').innerText = mTime;
    } else {
        mRow.style.display = 'none';
    }

    const total = pkgPrice + totalMakeupPrice + parseInt(travel.value);
    document.getElementById('res-total').innerText = total.toLocaleString('vi-VN');

    const qrImg = document.getElementById('res-qr');
    const qrText = document.getElementById('qr-text');
    if (parseInt(deposit) > 0) {
        qrImg.src = `https://img.vietqr.io/image/MB-0901341018-qr_only.png?amount=${deposit}&addInfo=Coc%20chup%20hinh%20nangfotone`; 
        qrImg.style.display = 'block';
        if(qrText) qrText.style.display = 'block';
    } else {
        qrImg.style.display = 'none';
        if(qrText) qrText.style.display = 'none';
    }

    document.getElementById('download-btn').style.display = "block";
    document.getElementById('invoice-card').scrollIntoView({ behavior: 'smooth' });
}

function downloadImg() {
    const invoice = document.getElementById('invoice-card');
    html2canvas(invoice, { 
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff"
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `nangfotone_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}