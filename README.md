# Gemini Python Tutor

Đây là một trang web học Python được xây dựng bằng React, Netlify Functions và Google Gemini API. Nó cho phép người dùng đọc các bài học, xem ví dụ, làm quiz và chạy code Python trực tiếp trên trình duyệt.

## Hướng dẫn triển khai

Bạn không cần máy tính để cài đặt. Chỉ cần làm theo các bước sau:

### Bước 1: Tải tất cả các file lên GitHub

1.  Tạo một tài khoản [GitHub](https://github.com/) nếu bạn chưa có.
2.  Tạo một repository mới (ví dụ: `gemini-python-tutor`).
3.  Trong repository mới tạo, hãy tạo lại chính xác cấu trúc thư mục và file đã được cung cấp. Copy và paste nội dung của từng file vào đúng vị trí.

### Bước 2: Lấy API Key của Google Gemini

1.  Đi đến [Google AI Studio](https://aistudio.google.com/).
2.  Nhấp vào **"Get API key"** và tạo một API key mới.
3.  **Sao chép và lưu key này lại một cách cẩn thận. Đây là thông tin bí mật.**

### Bước 3: Triển khai với Netlify

1.  Tạo một tài khoản [Netlify](https://www.netlify.com/) và đăng nhập bằng tài khoản GitHub của bạn.
2.  Trên trang chủ Netlify, nhấp vào **"Add new site"** -> **"Import an existing project"**.
3.  Chọn **"Deploy with GitHub"** và cấp quyền cho Netlify truy cập vào repository của bạn.
4.  Chọn repository `gemini-python-tutor` mà bạn đã tạo ở Bước 1.
5.  Netlify sẽ tự động phát hiện các cài đặt build từ file `netlify.toml`. Bạn không cần thay đổi gì ở đây.
6.  **Bước quan trọng nhất:** Trước khi nhấn deploy, hãy vào phần **"Advanced build settings"** hoặc tìm mục **"Environment variables"**.
    *   Nhấp vào **"New variable"**.
    *   **Key:** `GEMINI_API_KEY`
    *   **Value:** Dán API key của Gemini bạn đã lấy ở Bước 2 vào đây.
7.  Cuối cùng, nhấp vào nút **"Deploy site"** (hoặc "Deploy `your-repo-name`").

Netlify sẽ bắt đầu quá trình build và triển khai trang web của bạn. Quá trình này có thể mất vài phút. Sau khi hoàn tất, Netlify sẽ cung cấp cho bạn một URL công khai (ví dụ: `your-site-name.netlify.app`) để truy cập trang web.

Chúc bạn thành công!
