// 모달 닫기 함수
function closeModal(modal, overlay) {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
    document.body.style.overflow = ''; // 스크롤 다시 활성화
}

function openModal(title, message, onConfirm) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    modal.innerHTML = `
        <div class="modal-content">
            <h2 id="title">${title}</h2>
            <p>${message}</p>
            <div class="modal-actions">
                <button id="cancel-action">취소</button>
                <button id="confirm-action">확인</button>
            </div>
        </div>
    `;

    // 확인 시 실행
    modal.querySelector('#confirm-action').addEventListener('click', () => {
        onConfirm();
        closeModal(modal, overlay);
    });

    // 취소 시 실행;
    modal.querySelector('#cancel-action').addEventListener('click', () => {
        closeModal(modal, overlay);
    });

    // 배경 클릭 시 모달 닫기
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal(modal, overlay);
        }
    });

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    document.body.style.overflow = 'hidden'; // 스크롤 방지
    modal.style.display = 'flex';
    overlay.style.display = 'block';
}

export default openModal;
