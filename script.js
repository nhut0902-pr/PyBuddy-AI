// script.js
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const actionSelect = document.getElementById('action-select');
    const mainInput = document.getElementById('mainInput');
    const submitButton = document.getElementById('submitButton');
    const resultContainer = document.getElementById('resultContainer');
    const tabs = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const historyContainer = document.getElementById('historyContainer');
    const clearHistoryButton = document.getElementById('clearHistoryButton');

    // !!! QUAN TRỌNG: THAY THẾ BẰNG URL BACKEND CỦA BẠN TRÊN RENDER !!!
    const API_URL = 'https://your-backend-name.onrender.com/api';

    let history = JSON.parse(localStorage.getItem('pybuddy_history')) || [];

    // --- Functions ---

    function setLoading(isLoading) {
        submitButton.disabled = isLoading;
        submitButton.textContent = isLoading ? 'Đang xử lý...' : 'Gửi yêu cầu';
        submitButton.classList.toggle('loading', isLoading);
    }

    function updatePlaceholder() {
        const selectedAction = actionSelect.value;
        const placeholders = {
            explain: "Dán code Python cần giải thích vào đây...",
            debug: "Dán code Python bị lỗi vào đây...",
            optimize: "Dán code Python cần tối ưu vào đây...",
            text_to_code: "Nhập mô tả bằng tiếng Việt, ví dụ: 'Viết hàm kiểm tra một số có phải số chẵn không'",
            create_quiz: "Nhập một chủ đề Python, ví dụ: 'Vòng lặp for' hoặc 'Dictionary'"
        };
        mainInput.placeholder = placeholders[selectedAction];
    }

    function saveHistory(request, response, action) {
        const historyItem = {
            action: action,
            request: request,
            response: response,
            timestamp: new Date().toISOString()
        };
        history.unshift(historyItem); // Thêm vào đầu mảng
        if (history.length > 20) history.pop(); // Giới hạn 20 mục
        localStorage.setItem('pybuddy_history', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        if (history.length === 0) {
            historyContainer.innerHTML = '<p class="placeholder">Chưa có lịch sử.</p>';
            clearHistoryButton.style.display = 'none';
            return;
        }

        clearHistoryButton.style.display = 'block';
        historyContainer.innerHTML = '';
        history.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.dataset.index = index;

            const actionText = {
                explain: "Giải thích Code", debug: "Sửa lỗi", optimize: "Tối ưu",
                text_to_code: "Tạo Code", create_quiz: "Tạo Quiz"
            }[item.action] || "Yêu cầu";

            const escapedRequest = item.request.replace(/</g, "<").replace(/>/g, ">");

            div.innerHTML = `
                <h4>${actionText} - ${new Date(item.timestamp).toLocaleString('vi-VN')}</h4>
                <div class="history-item-input"><strong>Yêu cầu:</strong><pre><code>${escapedRequest}</code></pre></div>
            `;
            historyContainer.appendChild(div);
        });
    }

    async function handleSubmit() {
        const action = actionSelect.value;
        const inputValue = mainInput.value.trim();

        if (inputValue === '') {
            alert('Vui lòng nhập nội dung.');
            return;
        }

        setLoading(true);
        resultContainer.innerHTML = '<p class="placeholder">PyBuddy AI đang suy nghĩ...</p>';
        
        switchToTab('main-tool');

        let payload = {};
        if (action === "text_to_code" || action === "create_quiz") {
            payload = action === "text_to_code" ? { text: inputValue } : { topic: inputValue };
        } else {
            payload = { code: inputValue };
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, payload }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Lỗi từ server: ${response.status}`);
            }

            resultContainer.innerHTML = marked.parse(data.result);
            saveHistory(inputValue, data.result, action);

        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            resultContainer.innerHTML = `<p style="color: red; font-weight: bold;">Đã xảy ra lỗi: ${error.message}</p>`;
        } finally {
            setLoading(false);
        }
    }
    
    function switchToTab(tabId) {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        document.querySelector(`.tab-link[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }

    // --- Event Listeners ---

    submitButton.addEventListener('click', handleSubmit);
    actionSelect.addEventListener('change', updatePlaceholder);

    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchToTab(tab.dataset.tab));
    });

    clearHistoryButton.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
            history = [];
            localStorage.removeItem('pybuddy_history');
            renderHistory();
        }
    });

    historyContainer.addEventListener('click', (e) => {
        const itemDiv = e.target.closest('.history-item');
        if (itemDiv) {
            const index = itemDiv.dataset.index;
            const historyItem = history[index];
            if (historyItem) {
                actionSelect.value = historyItem.action;
                mainInput.value = historyItem.request;
                resultContainer.innerHTML = marked.parse(historyItem.response);
                updatePlaceholder();
                switchToTab('main-tool');
            }
        }
    });

    // --- Initial Setup ---
    updatePlaceholder();
    renderHistory();
});
