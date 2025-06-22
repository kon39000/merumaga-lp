// メールアドレス検証
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// フォーム送信処理
function handleFormSubmit(e) {
    e.preventDefault();
    
    const emailInput = e.target.querySelector('.email-input');
    const email = emailInput.value.trim();
    
    // バリデーション
    if (!email) {
        alert('メールアドレスを入力してください。');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('正しいメールアドレスを入力してください。');
        return;
    }
    
    // ここで実際のメール配信サービスへの登録処理を行う
    // 今回はデモなので、成功メッセージを表示
    alert(`ご登録ありがとうございます！\n${email} 宛に確認メールをお送りしました。\n\n毎日20:00に配信をお楽しみください。`);
    
    // フォームをリセット
    emailInput.value = '';
}

// DOMContentLoaded イベント
document.addEventListener('DOMContentLoaded', function() {
    // フォームの取得と処理の登録
    const forms = document.querySelectorAll('.signup-form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
    
    // スムーススクロール
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // スクロールアニメーション
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s, transform 0.6s';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // アニメーション対象の要素を監視
    const animateElements = document.querySelectorAll('.feature-item, .content-item, .faq-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });
});