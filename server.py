# server.py
from flask import Flask, request, jsonify
import google.generativeai as genai
import os

# Khởi tạo ứng dụng Flask
app = Flask(__name__)

# Cấu hình Gemini API
# Render.com sẽ cung cấp biến môi trường này từ Secrets bạn đã cài đặt.
try:
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    if not GOOGLE_API_KEY:
        raise ValueError("Biến môi trường GOOGLE_API_KEY chưa được thiết lập.")
    
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("Khởi tạo Gemini Model thành công.")
except Exception as e:
    # Nếu có lỗi, model sẽ là None và các request sẽ thất bại với thông báo lỗi rõ ràng.
    print(f"LỖI NGHIÊM TRỌNG khi khởi tạo Gemini: {e}")
    model = None

# Hàm chung để gọi API Gemini và xử lý lỗi một cách nhất quán
def generate_ai_response(prompt):
    """Hàm này nhận một prompt, gọi Gemini, và trả về một đối tượng JSON response."""
    if not model:
        return jsonify({'error': 'Gemini model không thể khởi tạo. Vui lòng kiểm tra API Key trên server.'}), 500
    try:
        response = model.generate_content(prompt)
        # Truy cập vào nội dung text một cách an toàn
        result_text = response.text if hasattr(response, 'text') else "Không nhận được phản hồi hợp lệ từ AI."
        return jsonify({'result': result_text})
    except Exception as e:
        print(f"Lỗi khi gọi Gemini API: {e}")
        return jsonify({'error': f'Đã xảy ra lỗi từ phía Gemini API: {str(e)}'}), 500

# Route chính để kiểm tra server có hoạt động không
@app.route('/')
def home():
    return "PyBuddy AI Backend is running with all features!"

# Một route API duy nhất (/api) để xử lý tất cả các loại yêu cầu
@app.route('/api', methods=['POST'])
def handle_api_request():
    """Route này nhận 'action' và 'payload' để quyết định cần làm gì."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request không chứa dữ liệu JSON.'}), 400

    action = data.get('action')
    payload = data.get('payload')

    if not action or payload is None:
        return jsonify({'error': 'Yêu cầu thiếu "action" hoặc "payload".'}), 400

    # Từ điển chứa các prompt cho từng hành động
    prompts = {
        "explain": f"Hãy giải thích đoạn code Python sau đây cho một người mới bắt đầu. Giải thích từng dòng một cách đơn giản, dễ hiểu và chuyên nghiệp:\n\n```python\n{payload.get('code', '')}\n```",
        
        "debug": f"Tìm và sửa lỗi trong đoạn code Python sau. Cung cấp phiên bản code đã sửa trong một khối mã (```python) và giải thích rõ ràng lỗi sai là gì, tại sao lại sửa như vậy.\n\nCode lỗi:\n```python\n{payload.get('code', '')}\n```",
        
        "optimize": f"Tối ưu hóa đoạn code Python sau để nó chạy hiệu quả hơn hoặc 'pythonic' hơn (theo chuẩn PEP 8). Cung cấp phiên bản tối ưu trong khối mã (```python) và giải thích những thay đổi bạn đã thực hiện.\n\nCode gốc:\n```python\n{payload.get('code', '')}\n```",
        
        "text_to_code": f"Viết một đoạn code Python dựa trên yêu cầu sau đây. Chỉ trả về code trong một khối mã (```python), không cần giải thích gì thêm.\n\nYêu cầu: {payload.get('text', '')}",
        
        "create_quiz": f"Với vai trò là một chuyên gia Python, hãy tạo một bài kiểm tra trắc nghiệm gồm 3 câu hỏi về chủ đề sau: '{payload.get('topic', '')}'. Mỗi câu hỏi phải có 4 lựa chọn (A, B, C, D) và đánh dấu đáp án đúng bằng dấu * ở cuối (ví dụ: A. Lựa chọn A*)."
    }

    # Lấy prompt tương ứng với action
    prompt = prompts.get(action)
    if not prompt:
        return jsonify({'error': f'Hành động "{action}" không hợp lệ.'}), 400

    # Gọi hàm chung để xử lý và trả về kết quả
    return generate_ai_response(prompt)

# Gunicorn sẽ sử dụng file này để chạy, không cần dòng if __name__ == '__main__'
