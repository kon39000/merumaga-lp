// FAQ アコーディオン機能
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // 他のFAQを閉じる
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.classList.remove('active');
                }
            });
            
            // 現在のFAQを開閉
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.classList.remove('active');
            } else {
                this.setAttribute('aria-expanded', 'true');
                answer.classList.add('active');
            }
        });
    });
}

// スムーススクロール
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#top') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// スクロール時のヘッダー表示・非表示
function initHeaderScroll() {
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 下スクロール時は隠す
            header.style.transform = 'translateY(-100%)';
        } else {
            // 上スクロール時は表示
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ヘッダーにトランジションを追加
    header.style.transition = 'transform 0.3s ease-in-out';
}

// インターセクションオブザーバーによるアニメーション
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // アニメーション対象の要素を初期化
    const animateElements = document.querySelectorAll(
        '.benefit-item, .curriculum-item, .testimonial-item, .bonus-content, .profile-content'
    );
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// フォームバリデーション（念のため）
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const emailInputs = this.querySelectorAll('input[type="email"]');
            let isValid = true;
            
            emailInputs.forEach(input => {
                const email = input.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (!email || !emailRegex.test(email)) {
                    isValid = false;
                    input.style.border = '2px solid #DC2626';
                    input.focus();
                } else {
                    input.style.border = '';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('正しいメールアドレスを入力してください。');
            }
        });
    });
}

// キーボードナビゲーション対応
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Escキーでアクティブなモーダルやアコーディオンを閉じる
        if (e.key === 'Escape') {
            const expandedFAQs = document.querySelectorAll('.faq-question[aria-expanded="true"]');
            expandedFAQs.forEach(faq => {
                faq.setAttribute('aria-expanded', 'false');
                faq.nextElementSibling.classList.remove('active');
            });
        }
        
        // TabキーでのフォーカスがCTAボタンに当たった時の処理
        if (e.key === 'Tab') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('cta-button')) {
                focusedElement.style.outline = '3px solid #FFBD4A';
                setTimeout(() => {
                    focusedElement.style.outline = '';
                }, 3000);
            }
        }
    });
}

// ページロード完了時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // 各機能を初期化
    initFAQ();
    initSmoothScroll();
    initHeaderScroll();
    initScrollAnimations();
    initFormValidation();
    initKeyboardNavigation();
    
    // パフォーマンス最適化：画像の遅延読み込み
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Google Analytics トラッキング（必要に応じて）
    function trackCTAClick(buttonText) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'CTA',
                event_label: buttonText,
                value: 1
            });
        }
    }
    
    // CTAボタンのクリックトラッキング
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackCTAClick(this.textContent.trim());
        });
    });
});

// ページ離脱時の警告（オプション）
window.addEventListener('beforeunload', function(e) {
    const hasInteracted = sessionStorage.getItem('userInteracted');
    
    if (!hasInteracted) {
        const confirmationMessage = 'まだメルマガに登録されていません。本当にページを離れますか？';
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    }
});

// ユーザーインタラクションの記録
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('cta-button')) {
        sessionStorage.setItem('userInteracted', 'true');
    }
});

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // プロダクション環境では、エラーログサービスに送信
});

// レスポンシブ対応：モバイルでのタッチ操作最適化
if ('ontouchstart' in window) {
    // タッチデバイス用のホバー効果を無効化
    const hoverElements = document.querySelectorAll('.benefit-item, .curriculum-item, .testimonial-item');
    hoverElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        });
    });
}