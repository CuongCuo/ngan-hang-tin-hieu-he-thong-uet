document.addEventListener('DOMContentLoaded', async () => {
    const topicListEl = document.getElementById('topic-list');
    const currentTopicTitle = document.getElementById('current-topic-title');
    const questionCount = document.getElementById('question-count');
    const quizContainer = document.getElementById('quiz-container');

    let allQuestions = [];
    let topicsMap = new Map();

    // Load data
    try {
        allQuestions = typeof questionsData !== 'undefined' ? questionsData : [];
        
        // Group by topic
        allQuestions.forEach(q => {
            const topic = q.topic;
            if (!topicsMap.has(topic)) {
                topicsMap.set(topic, []);
            }
            topicsMap.get(topic).push(q);
        });

        renderSidebar();
    } catch (error) {
        console.error('Error loading questions:', error);
        quizContainer.innerHTML = `<div class="empty-state">
            <div class="empty-icon">⚠️</div>
            <p>Không thể tải dữ liệu ngân hàng câu hỏi. Có lệnh báo lỗi: ${error.message}</p>
        </div>`;
    }

    function renderSidebar() {
        topicListEl.innerHTML = '';
        
        let isFirst = true;
        for (const [topic, questions] of topicsMap.entries()) {
            const li = document.createElement('li');
            li.className = 'topic-item';
            li.textContent = `${topic} (${questions.length})`;
            
            li.addEventListener('click', () => {
                document.querySelectorAll('.topic-item').forEach(el => el.classList.remove('active'));
                li.classList.add('active');
                renderQuestions(topic, questions);
            });
            
            topicListEl.appendChild(li);

            // Auto select first topic
            if (isFirst) {
                li.click();
                isFirst = false;
            }
        }
    }

    function renderQuestions(topic, questions) {
        currentTopicTitle.textContent = topic;
        questionCount.textContent = `${questions.length} câu hỏi`;
        
        quizContainer.innerHTML = '';
        
        questions.forEach((q, index) => {
            const delay = index * 0.1;
            
            const card = document.createElement('div');
            card.className = 'question-card';
            card.style.animationDelay = `${delay}s`;
            
            card.innerHTML = `
                <div class="question-header">
                    <span>Câu hỏi gốc #${q.id}</span>
                    <span>Nguồn: Trang ${q.page || '?'}</span>
                </div>
                <img src="${q.image}" class="question-image" alt="Question ${q.id}" loading="lazy" />
            `;
            
            quizContainer.appendChild(card);
        });
    }
});
