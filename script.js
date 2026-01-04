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
            <label> Makeup Khách ${i}:</label>
            <select class="makeup-item">
                <option value="0" data-name="Không">Không Makeup</option>
                <option value="250000" data-name="Cơ bản">Makeup cơ bản (250k)</option>
                <option value="300000" data-name="Chuyên nghiệp">Makeup chuyên nghiệp (300k)</option>
            </select>
        `;
    }
}

function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + " <span style='text-decoration: underline;'>đ</span>";
}

function generateInvoice() {
    const pkg = document.getElementById('package');
    const travel = document.getElementById('travel');
    const location = document.getElementById('location').value || "Chưa xác định";
    const datetime = document.getElementById('datetime').value;
    const groupQty = parseInt(document.getElementById('group-qty').value);

    let pkgPrice = parseInt(pkg.value);
    let pkgName = pkg.options[pkg.selectedIndex].getAttribute('data-name');
    if (pkg.value === "360000") {
        pkgPrice = pkgPrice * groupQty;
        pkgName = `Nhóm (${groupQty} người / chỉnh sửa 6 ảnh mỗi người)`;
    }

    let totalMakeupPrice = 0;
    let makeupDetails = [];
    const makeupSelects = document.querySelectorAll('.makeup-item');
    makeupSelects.forEach((select, index) => {
        totalMakeupPrice += parseInt(select.value);
        let mName = select.options[select.selectedIndex].getAttribute('data-name');
        if (mName !== "Không") {
            makeupDetails.push(`Khách ${index + 1}: ${mName}`);
        }
    });

    let travelPrice = parseInt(travel.value);

    document.getElementById('res-package').innerText = pkgName;
    document.getElementById('res-makeup').innerText = makeupDetails.length > 0 ? makeupDetails.join(' | ') : "Không";
    document.getElementById('res-travel').innerText = travel.options[travel.selectedIndex].getAttribute('data-name');
    document.getElementById('res-location').innerText = location;

    document.getElementById('res-package-price').innerHTML = formatCurrency(pkgPrice);
    document.getElementById('res-makeup-price').innerHTML = totalMakeupPrice > 0 ? formatCurrency(totalMakeupPrice) : formatCurrency(0);
    document.getElementById('res-travel-price').innerHTML = formatCurrency(travelPrice);

    let dateObj = new Date(datetime);
    document.getElementById('res-datetime').innerText = datetime ? dateObj.toLocaleString('vi-VN') : "Chưa chọn";
    
    const total = pkgPrice + totalMakeupPrice + travelPrice;
    document.getElementById('res-total').innerText = total.toLocaleString('vi-VN');

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

window.onload = updateUI;